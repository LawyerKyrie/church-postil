<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWindowScroll } from '@vueuse/core'

/*
const allNotes = useLocalStorage<any[]>('global-church-notes', [])
const { copyRichNotesToGmail } = useExport()
*/
const { allNotes } = useNotes()
const { sendToGmail } = useExport()

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

const handleExport = () => {
  sendToGmail(groupedNotes.value, allNotes.value.length)
}

/* Above is only the gmail send code */

const pos = computed(() => {
  // Desktop Default (Bottom Right)
  let x = window.innerWidth - 25 // 80px = button width + margin
  let y = window.innerHeight - 35 // 80px = button height + margin

  if (isMobile.value) {
    // On Mobile, use visualViewport if available for better accuracy
    const viewportHeight = window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight
    const viewportWidth = window.visualViewport
      ? window.visualViewport.width
      : window.innerWidth
    // Align to bottom-right with a 20px padding
    // We use 50 as an estimate for the button size
    x = viewportWidth - 25
    y = viewportHeight - 35
  }

  return { x, y }
})

const showBottomMenu = ref(false)
const isMobile = ref(false)

// 1. Monitor scroll with idle detection
const { y, isScrolling } = useWindowScroll({ idle: 200 })

// 2. Single watcher to handle showing/hiding AND mobile detection
watch(isScrolling, (scrolling) => {
  // We only care when scrolling STOPS
  if (!scrolling) {
    // Perform mobile check only when needed (saves resources)
    const isWindows = navigator.userAgent.includes('Windows')
    isMobile.value = !isWindows && window.innerWidth < 540

    // Show menu only if we are past 200px
    showBottomMenu.value = y.value > 200
  } else {
    // Hide menu immediately when scrolling starts
    showBottomMenu.value = false
    // Re-setting the state of all the menu buttons
    inActive.value = true
    notClosed.value = false
  }
})

const notClosed = ref(false)

/* On click outside movable menu the button stays inActive = false */
watch(notClosed, () => {
  // This code making the uSwitch button active when it's closing with click outside
  if (notClosed.value !== true)
    inActive.value = true
})

/* Creating popup menu and insert it on the right side */
const inActive = ref(true)
const toast = useToast()

const scrollToTop = () => {
  notClosed.value = !notClosed.value
  inActive.value = true
  toast.add({ title: 'Scrolling to Top!', description: '- and closing bottom menu' })
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Smooth scroll behavior
  })
}

defineShortcuts({
  o: () => notClosed.value = !notClosed.value
})

/* ------------- TOGGLE LANGUAGE BUTTON ------------- */

const {
  $updateThePageOnLanguageChange,
  $keyboardClickK,
  $keyboardClickM,
  $created, // for notes
  $localeDate // for notes
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
  // Clear any existing timer to prevent issues
  // buttonRef.value = event.target as HTMLElement
  if (pressTimer) {
    clearTimeout(pressTimer)
  }
  // Start a timer for the hold action
  pressTimer = setTimeout(() => {
    isHold.value = true
    if (notClosed.value === true) inActive.value = true
    else inActive.value = false
  }, holdTime)
}
const handlePressEnd = (/* event: MouseEvent | TouchEvent */) => {
  if (pressTimer) {
    clearTimeout(pressTimer)
    // If the timer was cleared before the threshold, it was a click/tap
    if (isHold.value !== true)
      isHold.value = false
  }
}
const handleClickEvent = (event, condition) => { // condition = isHold value
  if (condition) {
    // Stop the event from bubbling up to the parent div's handler
    event.stopPropagation()
    isHold.value = false // Resetting button after hold/ move etc.
  }
}
// I could done the same with a mousedown handle and vueUse onLongPress(buttonRef, () => {

/* END PREVENT THE MENU FROM POPPING UP WHEN DRAGGED */

const selectMenuOpen = ref(false)
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

/* -- ADDING NEW COMMAND PALETTE GROUP FOR NOTES -- */

// 1. Hook into the same global storage key you used in the slug page

// const allNotes = useLocalStorage<any[]>('global-church-notes', [])
const router = useRouter()

const showDescriptions = ref(true)

// 2. Format the notes for the Command Palette

const noteGroups = computed(() => [
  // GROUP 1: Your Existing Notes
  {
    id: 'notes',
    label: 'NOTES Opens on Click',
    items: allNotes.value.map(note => ({
      id: note.id,
      // Show a snippet of the text + the page title
      label: `${$created(note.id) + ' ..' + note.text + ' ' + note.title}` || 'No note here!', //  + note.text
      description: note.path,
      suffix: note.path || note.title,
      title: `..${note.path} \n${note.title} \n${note.text} \n${$localeDate(note.id)}`,
      icon: 'i-heroicons-pencil-square',
      // What happens when you click the note in the palette:
      onSelect: () => {
        router.push(note.path)
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
              label: showDescriptions.value ? 'Hide Path' : 'Show Path',
              icon: 'i-heroicons-eye',
              onSelect: () => { showDescriptions.value = !showDescriptions.value }
            },
            {
              id: 'print-notes',
              label: 'Print My Notes',
              icon: 'i-heroicons-printer',
              onSelect: () => handlePrint()
            },
            {
              id: 'gmail-notes',
              label: 'Export to Gmail',
              icon: 'i-simple-icons-gmail',
              onSelect: () => handleExport()
            }
          ]
        }
      ]
    : [] // The alternate (empty array)
  )
])

// Add these to your command palette's :groups or items array

const handlePrint = () => {
  // Add a class to the body to help the CSS find its target
  document.body.classList.add('is-printing')

  // Remove it after the print dialog closes
  setTimeout(() => {
    window.print()
    document.body.classList.remove('is-printing')
  }, 100)
}
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
        :x-init="pos.x"
        :y-init="pos.y"
        :mobile="isMobile"
        @touchstart.stop
        @touchmove.stop
      >
        <UPopover
          v-model:open="notClosed"
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
              <UPopover
                v-model:open="selectMenuOpen"
                :content="{ side: 'right', align: 'start' }"
                class="overflow-y-auto"
                :restore-focus="false"
              >
                <div>
                  <UButton
                    :icon="selectMenuOpen ? 'i-heroicons-x-mark' : 'i-lucide-menu'"
                    color="secondary"
                    square
                    variant="subtle"
                  />
                </div>

                <template #content>
                  <div
                    class="overflow-x-auto overflow-y-auto u-command-palette-parent"
                    :class="{ 'hide-note-details': !showDescriptions }"
                  >
                    <!--
                      Source code:
                      https://ui.nuxt.com/docs/components/command-palette#with-children-in-items
                    -->
                    <UCommandPalette
                      :ref="handleInputRef"
                      :groups="noteGroups"
                      placeholder="Note Filter..."
                      class="text-muted"
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
                        <div class="flex items-center justify-between gap-2">
                          <UButton
                            color="neutral"
                            icon="i-lucide-square-menu"
                            variant="ghost"
                            label="Search"
                            size="xs"
                            class="text-dimmed"
                            trailing-icon="i-lucide-arrow-up"
                            @click="$keyboardClickK"
                          />
                          <USeparator
                            orientation="vertical"
                            class="h-4"
                          />
                          <UButton
                            color="neutral"
                            icon="i-lucide-menu"
                            variant="ghost"
                            label="Menu"
                            size="xs"
                            class="text-dimmed"
                            trailing-icon="i-lucide-arrow-up"
                            @click="$keyboardClickM"
                          />
                        </div>
                      </template>
                    </UCommandPalette>
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
        </UPopover>
      </WrapAndDragEl>
      <!-- </div> -->
    </div>
  </ClientOnly>
</template>

<style scoped>
.menu-container {
  position: fixed; /* Ensure this is fixed */
  right: 1rem;
  /* Use env(safe-area-inset-bottom) to stay above mobile home bars */
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 9999;
  /* Prevent interaction issues during scroll */
  pointer-events: auto;
  /* Touch-action none can prevent the background from scrolling
     when you drag the menu */
  touch-action: none
}

/* 1. Target the Palette Parent */
.u-command-palette-parent {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  max-width: 100vw !important;
  overflow: hidden !important;
  padding: 0 8px;
}

/* .u-command-palette className is added in ui above */
/* 2. The Palette Root (Forcing the width you found) */
:deep(.u-command-palette) {
  max-width: calc(100vw - 85px) !important;
  margin: 0 auto;
  /* Restore the blue background here if it went transparent */
  background-color: rgb(var(--color-secondary-500)) !important;
}

/* 3. The Button (Shrink logic) */
:deep([data-slot="group"] > button) {
  width: 100% !important;
  max-width: calc(100vw - 60px) !important;
  flex-shrink: 1 !important;
  flex-basis: auto !important;
  overflow: hidden !important;
  display: flex !important;
}

/* 4. The Wrapper */
:deep([data-slot="itemWrapper"]) {
  min-width: 0 !important;
  flex: 1 1 0% !important;
  display: block !important;
}

/* 5. The Label Truncation */
:deep([data-slot="itemLabel"]) {
  display: block !important;
  width: 100% !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  color: white !important; /* Ensures text is visible on blue */
}

/* Dark Mode handling without the '&' flag */
:global(.dark) :deep(.u-command-palette) {
  background-color: rgb(var(--color-secondary-900)) !important;
}

/* PRINT FUNCTIONALITY FOR THE NOTES */
/* See app.vue */

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
</style>
