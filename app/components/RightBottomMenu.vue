<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWindowScroll, useWindowSize } from '@vueuse/core'
import type { DropdownMenuItem } from '@nuxt/ui'

/*
const allNotes = useLocalStorage<any[]>('global-church-notes', [])
const { copyRichNotesToGmail } = useExport()
*/
const { allNotes } = useNotes()
const { sendToGmail } = useExport()
const { copyNotesToClipboard } = useClipboard()

// The grouping logic (Keep this here or in useNotes)
const groupedNotes = computed(() => {
  const groups: Record<string, any> = {}
  allNotes.value.forEach((note: any) => {
    const key = `${note.path}-${note.title}`
    if (!groups[key]) groups[key] = { path: note.path, title: note.title, items: [] }
    groups[key].items.push(note)
  })
  return Object.values(groups)
})

const handleCopyToGmaiAsDraft = () => {
  sendToGmail(groupedNotes.value, allNotes.value.length)
}
const handleCopyAndGmail = (toGmail) => {
  if (toGmail)
    copyNotesToClipboard(groupedNotes.value, true)
  else
    copyNotesToClipboard(groupedNotes.value, false)
}

const mdNotes = () => {
  const cleanNotes = groupedNotes.value.filter(g => g.items.some(i => i.text.length > 0))
  $openNotesInNewTab(cleanNotes)
}
const styledNotes = () => {
  // Filter before passing to the function
  const cleanNotes = groupedNotes.value.filter(g => g.items.some(i => i.text.length > 0))
  $openStyledNotes(cleanNotes)
}
const downloadNotes = () => {
  // Filter before passing to the function
  const cleanNotes = groupedNotes.value.filter(g => g.items.some(i => i.text.length > 0))
  $exportNotesAsFile(cleanNotes)
}

/* Above is only the gmail send code */

// Set the 'type' to 'outer' to use window.outerHeight
// const { height } = useWindowSize({ type: 'outer' })

const isMobile = ref('ontouchstart' in window)

const viewportWidth = useViewportWidth()
const viewportHeight = useViewportHeight()

const pos = computed(() => {
  // Desktop Default (Bottom Right)
  let x = window.innerWidth - 25 // 80px = button width + margin
  let y = window.innerHeight - 35 // 80px = button height + margin // I think the button will be in the bottom in both cases using innerHeight and outerHeight

  if ('ontouchstart' in window) {
    // On Mobile, use visualViewport if available for better accuracy
    const viewportWidth = window.visualViewport
      ? window.visualViewport.width
      : window.innerWidth
    // Align to bottom-right with a 20px padding
    // We use 50 as an estimate for the button size

    const viewportHeight = window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight
    // Align to bottom-right with a 20px padding
    // We use 50 as an estimate for the button size

    x = viewportWidth - 25
    y = viewportHeight - 35 // only this on mobile
  }
  return { x, y }
})

viewportWidth.value = pos.value.x
viewportHeight.value = pos.value.y

const showBottomMenu = ref(false)

// 1. Monitor scroll with idle detection
const { y, isScrolling } = useWindowScroll({ idle: 200 })

// 2. Single watcher to handle showing/hiding AND mobile detection
watch(isScrolling, (scrolling) => {
  // We only care when scrolling STOPS
  if (!scrolling) {
    // Perform mobile check only when needed (saves resources)
    // Wait with detect navigator to we are sure it exist (on scroll)
    const isWindows = navigator.userAgent.includes('Windows')
    isMobile.value = (!isWindows && window.innerWidth < 540) // || 'ontouchstart' in window

    // y.value = window.innerHeight
    // Show menu only if we are past 200px
    showBottomMenu.value = y.value > 200
  } else if (cpOpen.value !== true) {
    // Hide menu immediately when scrolling starts
    showBottomMenu.value = false
    // Re-setting the state of all the menu buttons
    inActive.value = true
    cpOpen.value = false
  }
})

const cpOpen = ref(false)

const { height } = useWindowSize()

watch(height, (/* oldVal, newVal */) => {
  // console.log('Height is changed from ', oldVal, ' to ', newVal)
  viewportWidth.value = window.visualViewport
    ? window.visualViewport.width - 25
    : window.innerWidth - 25
  viewportHeight.value = window.visualViewport
    ? window.visualViewport.height - 35
    : window.innerHeight - 35
})

/* On click outside movable menu the button stays inActive = false */
watch(cpOpen, () => {
  // This code making the uSwitch button active when it's closing with click outside
  if (cpOpen.value !== true)
    inActive.value = true
})

/* Creating popup menu and insert it on the right side */
const inActive = ref(true)
const toast = useToast()

const scrollToTop = () => {
  cpOpen.value = !cpOpen.value
  inActive.value = true
  toast.add({ title: 'Scrolling to Top!', description: '- and closing bottom menu' })
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Smooth scroll behavior
  })
}

defineShortcuts({
  o: () => cpOpen.value = !cpOpen.value
})

/* ------------- TOGGLE LANGUAGE BUTTON ------------- */

const {
  $updateThePageOnLanguageChange,
  $keyboardClickK,
  $keyboardClickM,
  $localeDate, // for notes
  $openNotesInNewTab,
  $openStyledNotes,
  $exportNotesAsFile
  // $created
} = useNuxtApp() as any

const { locale } = useI18n()

const isLang = ref(false)
const toggleLang = () => {
  isLang.value = isLang.value === true ? false : true
  locale.value = locale.value === 'en' ? 'da' : 'en'

  toast.add({ title: `${locale.value} Language Selected!` })
  $updateThePageOnLanguageChange(locale.value)
}

/* START PREVENT THE MENU FROM POPPING UP WHEN DRAGGED */

const isHold = ref(false)
let pressTimer: NodeJS.Timeout | null = null
const holdTime = 350 // milliseconds for a "hold"

const handlePressStart = (/* event: MouseEvent | TouchEvent */) => {
  console.log('handlePressStart')
  // Clear any existing timer to prevent issues
  // buttonRef.value = event.target as HTMLElement
  if (pressTimer) {
    clearTimeout(pressTimer)
  }
  // Start a timer for the hold action
  pressTimer = setTimeout(() => {
    isHold.value = true
    if (cpOpen.value === true) inActive.value = true
    else inActive.value = false
  }, holdTime)
}
const handlePressEnd = (/* event: MouseEvent | TouchEvent */) => {
  console.log('handlePressEnd')
  if (pressTimer) {
    clearTimeout(pressTimer)
    // If the timer was cleared before the threshold, it was a click/tap
    if (isHold.value !== true)
      isHold.value = false
  }
}
const handleClickEvent = (event, condition) => { // condition = isHold value
  console.log('handleClickEvent')
  if (condition) {
    // Stop the event from bubbling up to the parent div's handler
    event.stopPropagation()
    isHold.value = false // Resetting button after hold/ move etc.
  }
}
// I could done the same with a mousedown handle and vueUse onLongPress(buttonRef, () => {

/* END PREVENT THE MENU FROM POPPING UP WHEN DRAGGED */

// const selectMenuOpen = ref(false)
const searchTermRef = ref('')

/* -- HANDLING THE BLUR ON INPUT ON STARTUP AND ON TYPING  -- */
const handleInputRef = (el: any) => {
  if (!el) return
  // 1. Get the DOM node.
  // If it's a component, grab $el.
  let domNode = el.$el ?? el
  // 2. If it's a #text node (nodeType 3), look for the nearest element sibling
  if (domNode.nodeType === 3 && domNode.nextElementSibling) {
    domNode = domNode.nextElementSibling
  }
  // 3. Now ensure we have a real element to query
  if (domNode instanceof HTMLElement || domNode instanceof Element) {
    const input = domNode.children[0]!.children[0] as HTMLInputElement // domNode.querySelector('input')
    let timer
    function startTimer() {
      // 1. Capture the ID
      timer = setTimeout(() => {
        input.blur()
      }, 3000) // 3-second delay before input blur()
    }

    if (input) {
      // Your logic here (e.g., input.focus())
      // Option A: Blur it immediately
      const rawComp = toRaw(input)
      const inputValue = rawComp.value as any
      if (inputValue.trim().length === 0)
        input.blur() // not keyboard typing
      else {
        searchTermRef.value = inputValue
        startTimer()
      }
      watch(inputValue, () => {
        function resetTimer() {
          // 2. Clear the existing timer
          clearTimeout(timer)
          // 3. Restart the timer
          startTimer()
        }
        resetTimer()
      })

      // Option B: Make it readonly temporarily so keyboard can't open
      input.readOnly = true
      setTimeout(() => {
        input.readOnly = false
      }, 100)
    }
  }
}

// const templateExpandedHandler = () => { /* */ }
const backupJson = () => {
  const data = JSON.stringify(allNotes.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `my-scripture-notes-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
}

const quotesApostrophes = (text) => {
  const match = text.match(/«(.*?)»/)
  if (match) {
    return text = match[1]
  } else return text
}
// quotes apostrophes

/* -- ADDING NEW COMMAND PALETTE GROUP FOR NOTES -- */

// 1. Hook into the same global storage key you used in the slug page
// const allNotes = useLocalStorage<any[]>('global-church-notes', [])
const router = useRouter()
const showDescriptions = ref(false)

// 2. Format the notes for the Command Palette
const noteGroups = computed(() => [
  // GROUP 1: Your Existing Notes
  {
    id: 'notes',
    label: 'NOTES Opens on Click',
    items: allNotes.value.map(note => ({
      id: note.id,
      // Show a snippet of the text + the page title
      label: `${quotesApostrophes(note.text) + ' | ' + note.title}` || 'No note here!', //  + note.text
      description: note.path || '',
      suffix: note.path || note.title,
      title: `..${note.path} \n${note.title} \n${note.text} \n${$localeDate(note.id)}`,
      icon: 'i-heroicons-pencil-square',
      // What happens when you click the note in the palette:
      onSelect: () => {
        goToNote(note) // router.push(note.path) // `${note.path}#note-${note.id}`
      }
    }))
  },

  // GROUP 2: Utility Actions (Formated for VS Code/Linter)
  ...(allNotes.value.length > 0
    ? [
        {
          id: 'actions',
          label: 'Note Actions',
          items: [
            {
              id: 'toggle-desc',
              label: showDescriptions.value ? 'Hide Path to Note' : 'Show Path to Note',
              icon: 'i-heroicons-eye',
              onSelect: () => { showDescriptions.value = !showDescriptions.value }
            }
          ]
        }
      ]
    : [] // The alternate (empty array)
  )
])

// https://gemini.google.com/share/9167ca0a6ca8
const goToNote = (note) => {
  // Ensure the ID is attached so the destination page knows where to look
  const pathWithHash = `${note.path}#note-${note.id}`
  router.push(pathWithHash)
  cpOpen.value = false
}

/* ------------------- NOTE ACTIONS MENU ---------------------- */
const noteActions = ref<DropdownMenuItem[][]>([
  [
    {
      id: 'into-clipboard',
      label: 'Copy to Clipboard',
      title: 'Copy Notes to Clipboard and manually past them anywhere',
      icon: 'i-lucide-copy',
      onSelect: () => handleCopyAndGmail(false)
    },
    {
      id: 'into-clipboard',
      label: 'Copy/Paste to Gmail',
      title: 'Copy Notes to Clipboard and open Gmail - Past it manually into Gmail',
      icon: 'i-lucide-clipboard-copy',
      onSelect: () => handleCopyAndGmail(true)
    },
    {
      id: 'gmail-notes',
      label: 'Export to Gmail (PC)',
      title: 'Export Notes automatically to Gmail - ONLY ON PC!',
      icon: 'i-simple-icons-gmail',
      onSelect: () => handleCopyToGmaiAsDraft()
    },
    {
      id: 'md-notes',
      label: 'Open Md Notes',
      title: 'Open notes in md format!',
      icon: 'i-lucide-notepad-text',
      onSelect: () => mdNotes()
    },
    {
      id: 'styled-notes',
      label: 'Print Notes',
      title: 'Print Styled notes!',
      icon: 'i-heroicons-printer',
      onSelect: () => styledNotes()
    }
  ],

  [
    {
      id: 'download-notes',
      label: 'Download Notes',
      title: 'Download Md notes!',
      icon: 'i-lucide-hard-drive-download',
      onSelect: () => downloadNotes()
    },
    {
      id: 'backup-notes',
      label: 'Backup JSON',
      title: 'Backup JSON data!',
      icon: 'i-mdi-code-json',
      onSelect: () => backupJson()
    }
  ],
  [
    {
      id: 'toggle-desc',
      label: showDescriptions.value ? 'Hide Path to Note' : 'Show Path to Note',
      icon: 'i-heroicons-eye',
      onSelect: () => { showDescriptions.value = !showDescriptions.value }
    }
  ]
])
</script>

<template>
  <ClientOnly>
    <div
      v-if="showBottomMenu"
      class="fixed -bottom-10 right-2"
    >
      <!-- Extra div with the class-content prevents that content scroll on mobile when trying to drag the menu -->
      <!-- This div move the draggable menu upwards -->
      <!-- <div class="fixed bottom-0 right-0 w-[90px] h-[200px] z-50 touch-none"> -->
      <WrapAndDragEl
        :x-width="viewportWidth"
        :y-height="viewportHeight"
        :mobile="isMobile"
        @touchstart.stop
        @touchmove.stop
      >
        <UPopover
          v-model:open="cpOpen"
          arrow
          :content="{ side: 'top', align: 'start' }"
          class=""
        >
          <div class="rotate-90">
            <USwitch
              v-model="inActive"
              :title="inActive === true ? 'Open Menu' : 'Close Menu'"
              color="secondary"
              unchecked-icon="i-lucide-x"
              checked-icon="i-lucide-arrow-left"
              @pointerdown="handlePressStart"
              @touchstart="handlePressStart"
              @pointerup="handlePressEnd"
              @touchend="handlePressEnd"
              @click="handleClickEvent($event, isHold)"
            />
          </div>
          <template #content>
            <div>
              <!-- BUTTON MENU WITH TWO MENU BUTTONS -->
              <div class="w-8">
                <UButton
                  title="Back to Top"
                  icon="i-heroicons-arrow-up-solid"
                  square
                  color="secondary"
                  variant="ghost"
                  aria-label="Back to top"
                  class="ghost h-8"
                  @click="scrollToTop"
                />
                <UButton
                  title="Toggle Language"
                  :icon="isLang ? 'i-fluent-local-language-24-filled' : 'i-ix-language-filled'"
                  color="secondary"
                  square
                  variant="ghost"
                  aria-label="Toggle Language"
                  @click="toggleLang"
                />
              </div>
              <UDrawer
                handle-only
                :ui="{
                  container: 'p-0',
                  body: 'p-0'
                }"
              >
                <UButton
                  color="secondary"
                  square
                  variant="subtle"
                  icon="i-lucide-menu"
                />
                <template #body>
                  <div
                    class="max-h-[80vh] flex flex-col u-command-palette-parent overflow-hidden"
                    :class="{ 'hide-note-details': !showDescriptions }"
                  >
                    <!--
                      Source code:
                      https://ui.nuxt.com/docs/components/command-palette#with-children-in-items
                      class="groups text-muted"   min-h-0 flex flex-col
                    -->
                    <UCommandPalette
                      :ref="handleInputRef"
                      :groups="noteGroups"
                      placeholder="Note Filter..."
                      class="groups text-muted"
                      :autofocus="false"
                      :ui="{
                        input: '[&>input]:[inputmode:none]',
                        root: 'u-command-palette'
                      }"
                    >
                      <div
                        v-if="showDescriptions"
                        class="text-xs opacity-70 truncate"
                      >
                      <!-- {{ note.text }} -->
                      </div>
                      <template #empty>
                        <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
                          <div
                            v-if="allNotes.length === 0"
                            class="space-y-3"
                          >
                            <UIcon
                              name="i-heroicons-pencil-square"
                              class="w-10 h-10 mx-auto text-gray-400 opacity-50"
                            />
                            <p class="text-sm text-gray-500">
                              Your Study Journal is empty.
                            </p>
                            <p class="text-xs text-gray-400 italic">
                              Start highlighting text <br>
                              or <br>
                              double-click <br>
                              <br>
                              to see them here!
                            </p>
                          </div>

                          <div
                            v-else
                            class="space-y-3"
                          >
                            <UIcon
                              name="i-heroicons-magnifying-glass"
                              class="w-10 h-10 mx-auto text-gray-400 opacity-50"
                            />
                            <p class="text-sm text-gray-500">
                              No notes match your search <br>
                              <br>
                              <strong>"{{ searchTermRef }}"</strong>
                            </p>
                            <UButton
                              label="Clear Filter"
                              variant="link"
                              color="primary"
                              disabled
                              @click="searchTermRef = ''"
                            />
                          </div>
                        </div>
                      </template>
                      <template #footer>
                        <!--
                        https://gemini.google.com/share/5719bd6e91d8
                        https://gemini.google.com/share/5df860e7dd9a
                        -->
                        <div class="sticky bottom-0 flex items-center justify-between gap-2 w-full">
                          <UDropdownMenu :items="noteActions">
                            <UButton
                              icon="heroicons-pencil-square"
                              label="Note Actions"
                              size="xs"
                              variant="ghost"
                              color="primary"
                            />
                          </UDropdownMenu>

                          <USeparator
                            orientation="vertical"
                            class="h-4"
                          />

                          <UButton
                            color="warning"
                            icon="i-lucide-square-menu"
                            variant="ghost"
                            label="Search"
                            size="xs"
                            trailing-icon="i-lucide-arrow-up"
                            @click="$keyboardClickK"
                          />

                          <USeparator
                            orientation="vertical"
                            class="h-4"
                          />

                          <UButton
                            color="secondary"
                            icon="i-lucide-menu"
                            variant="ghost"
                            label="Menu"
                            size="xs"
                            trailing-icon="i-lucide-arrow-up"
                            @click="$keyboardClickM"
                          />

                          <USeparator
                            orientation="vertical"
                            class="h-4"
                          />

                          <UButton
                            color="neutral"
                            icon="i-heroicons-x-mark"
                            variant="ghost"
                            label=""
                            size="xs"
                            class="text-dimmed"
                            trailing-icon="i-lucide-arrow-down"
                            @click="cpOpen = false"
                          />
                        </div>
                      </template>
                    </UCommandPalette>
                  </div>
                </template>
              </UDrawer>
            </div>
          </template>
        </UPopover>
      </WrapAndDragEl>
      <!-- </div> -->
    </div>
  </ClientOnly>
</template>

<style scoped>
/* TOGGLE THE DESCRIPTION */
/* When the 'hide-note-details' class is active on the parent... */
.hide-note-details :deep([data-slot="itemSuffix"]),
.hide-note-details :deep([data-slot="itemDescription"]) {
  display: none !important;
}

/* This ensures the row height shrinks when the description is gone */
.hide-note-details :deep([data-slot="group"] > button) {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  min-height: 0 !important;
}

/*  ------------------------  */
</style>
