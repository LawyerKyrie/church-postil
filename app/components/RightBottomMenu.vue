<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWindowScroll } from '@vueuse/core'

const pos = computed(() => {
  // Desktop Default (Bottom Right)
  let x = window.innerWidth - 30 // 80px = button width + margin
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
    x = viewportWidth - 30
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { $updateThePageOnLanguageChange, $keyboardClickK, $keyboardClickM } = useNuxtApp() as any
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

const handlePressStart = () => {
  // Clear any existing timer to prevent issues
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
handleClickEvent.stopped = false
function handleClickEvent(event, condition) {
  if (condition) {
    // Stop the event from bubbling up to the parent div's handler
    event.stopPropagation()
    handleClickEvent.stopped = true
    isHold.value = false
    // toast.add({ title: 'Move Menu', description: 'Hold and Drag to move the Menu!' })
  }
}

/* END PREVENT THE MENU FROM POPPING UP WHEN DRAGGED */

const selectMenuOpen = ref(false)
const groups = [
  {
    id: 'actions',
    label: 'Actions',
    items: [
      {
        label: 'Add Notes to docs',
        title: 'Add NOTES with Double Click, and read it next time you open the document (on the same device).',
        icon: 'i-heroicons-academic-cap',
        onSelect(e: Event) {
          e.preventDefault()
          toast.add({
            title: 'Add Notes with Double Click!',
            description: 'Add Notes - and read it next time you open the document.'
          })
        }
      },
      {
        label: 'Toggle Language',
        title: 'Toggle between Engligish/Danish', //  isLang.value = isLang.value === true ? false : true
        icon: isLang.value ? 'i-fluent-local-language-24-filled' : 'i-ix-language-filled',
        onSelect(e: Event) {
          e.preventDefault()
          toggleLang()
        }
      }
    ]
  }
]

/* -- HANDLING THE BLUR ON INPUT ON STARTUP AND ON TYPING  -- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    if (input) {
      // Your logic here (e.g., input.focus())

      // Option A: Blur it immediately
      const rawComp = toRaw(input)

      const inputValue = rawComp.value
      if (inputValue.trim().length === 0)
        input.blur() // not keyboard typing
      else
        setTimeout(() => {
          input.blur()
        }, 3000)
        // blur input after tree seconds if typing (maybe it needs to be set to 5000)

      // Option B: Make it readonly temporarily so keyboard can't open
      input.readOnly = true
      setTimeout(() => {
        input.readOnly = false
      }, 100)
    }
  }
}

// const templateExpandedHandler = () => { /* */ }
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
              @pointerup="handlePressEnd"
              @touchstart="handlePressStart"
              @touchend="handlePressEnd"
              @click="handleClickEvent($event, isHold)"
            />
          </div>
          <template #content>
            <div>
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
                    class="overflow-x-auto overflow-y-auto"
                  >
                    <!--
                      Source code:
                      https://ui.nuxt.com/docs/components/command-palette#with-children-in-items
                    -->
                    <UCommandPalette
                      :ref="handleInputRef"
                      :groups="groups"
                      placeholder="Menu Filter..."
                      class="text-muted"
                      :autofocus="false"
                      :ui="{
                        input: '[&>input]:[inputmode:none]'
                      }"
                    >
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
</style>
