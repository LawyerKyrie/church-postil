<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWindowSize, useWindowScroll } from '@vueuse/core'

const { width, height } = useWindowSize()
const pos = {
  width: width.value, // not necessary
  height: height.value, // width.value could be used below
  get x() {
    const result = this.width - 50
    return result.toString()
  },
  get y() {
    const result = this.height - 35
    return result.toString()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { $updateThePageOnLanguageChange } = useNuxtApp() as any
const { locale } = useI18n()
const oldLocale = locale.value

/* --------------------------------- */

/* Creating popup menu and insert it on the right side */
const toast = useToast()
const showButtons = ref(false)
const handleScroll = () => {
  // Show button when user scrolls down 200px
  showButtons.value = window.scrollY > 200
}

const scrollToTop = () => {
  notClosed.value = !notClosed.value
  inActive.value = true
  // notClosed.value = notClosed.value === true ? false : true
  toast.add({ title: 'Scrolling to Top!', description: '- and closing bottom menu' })
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Smooth scroll behavior
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // Clean up event listener when component is destroyed
  window.removeEventListener('scroll', handleScroll)
})

const notClosed = ref(false)

defineShortcuts({
  o: () => notClosed.value = !notClosed.value
})

const isLang = ref(false)
const toggleLang = () => {
  isLang.value = isLang.value === true ? false : true

  if (locale.value === 'en') { // toggle to dan
    toast.add({ title: 'Danish Language Selected!' })
    locale.value = 'da'
    $updateThePageOnLanguageChange(locale.value, oldLocale)
  } else if (locale.value === 'da') { // toggle to eng
    toast.add({ title: 'English Language Selected!' })
    locale.value = 'en'
    $updateThePageOnLanguageChange(locale.value, oldLocale)
  }
}

const inActive = ref(true)

const isHold = ref(false)
let pressTimer: NodeJS.Timeout | null = null
const holdTime = 750 // milliseconds for a "hold"

const handlePressStart = () => {
  // Clear any existing timer to prevent issues
  if (pressTimer)
    clearTimeout(pressTimer)

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

/* ----------------------------------- */
const isOpen = ref(false)
const groups = [
  {
    id: 'actions',
    label: 'Actions',
    items: [
      {
        label: 'Language',
        icon: 'i-lucide-languages',
        children: [
          {
            label: 'English',
            icon: 'i-lucide-mouse-pointer-click',
            title: 'Select English Translation',
            onSelect(e: Event) {
              e.preventDefault()
              toast.add({ title: 'English Language Selected!' })
              locale.value = 'en'
              if (oldLocale !== 'en')
                $updateThePageOnLanguageChange(locale.value, oldLocale)
            }
          },
          {
            label: 'Danish',
            icon: 'i-lucide-archive',
            title: 'Select Danish Translation',
            onSelect(e: Event) {
              e.preventDefault()
              toast.add({ title: 'Danish Language Selected!' })
              locale.value = 'da'
              if (oldLocale !== 'da')
                $updateThePageOnLanguageChange(locale.value, oldLocale)
            }
          }
        ]
      }
    ]
  }
]

// Open Select Menu with click on button on mobile phone
const keyboardClick = () => {
  const targetElement = document
  const ctrlKEvent = new KeyboardEvent('keydown', {
    key: 'k',
    code: 'KeyK',
    ctrlKey: true,
    bubbles: true,
    cancelable: true
  })
  inActive.value = true
  targetElement.dispatchEvent(ctrlKEvent)
}

/* Close movable button on scroll */
const { /* x, */y } = useWindowScroll()

// React to scroll changes
watch(y, (newY) => {
  if (newY > 100) {
    if (notClosed.value === true) {
      isOpen.value = false
      inActive.value = true
      notClosed.value = false
    }
  }
})

/* On click outside movable menu the button stays inActive = false */
watch(notClosed, () => {
  // This is making the uSwitch button active when it's closing with click outside
  if (notClosed.value !== true)
    inActive.value = true
})
</script>

<template>
  <ClientOnly>
    <div
      v-if="showButtons"
      class="fixed -bottom-10 right-2"
    >
      <!-- Extra div with the class-content prevents that content scroll on mobile when trying to drag the menu -->
      <div class="fixed bottom-0 right-0 w-[90px] h-[200px] z-50 touch-none">
        <WrapAndDragEl
          :x-init="pos.x"
          :y-init="pos.y"
          @touchstart.stop
          @touchmove.stop
        >
          <UPopover
            v-model:open="notClosed"
            arrow
            :content="{ side: 'top', align: 'start' }"
            class=""
          >
            <div
              ref="movableMenu"
              class="rotate-90"
            >
              <USwitch
                ref="switchRef"
                v-model="inActive"
                :title="inActive === true ? 'Open Menu' : 'Close Menu'"
                color="secondary"
                unchecked-icon="i-lucide-x"
                checked-icon="i-lucide-check"
                @mousedown="handlePressStart"
                @mouseup="handlePressEnd"
                @touchstart="handlePressStart"
                @touchend="handlePressEnd"
                @click="handleClickEvent($event, isHold)"
              />
            </div>

            <template #content>
              <div class="">
                <UButton
                  title="Back to Top"
                  icon="i-heroicons-arrow-up-solid"
                  color="secondary"
                  variant="ghost"
                  aria-label="Back to top"
                  class="block"
                  @click="scrollToTop"
                />
                <UButton
                  title="Toggle Language"
                  :icon="isLang ? 'i-fluent-local-language-24-filled' : 'i-ix-language-filled'"
                  color="secondary"
                  square
                  variant="ghost"
                  @click="toggleLang"
                />

                <UPopover
                  v-model:open="isOpen"
                  :content="{ side: 'right', align: 'start' }"
                  class="overflow-y-auto"
                >
                  <div class="">
                    <UButton
                      :icon="isOpen ? 'i-heroicons-x-mark' : 'i-lucide-menu'"
                      color="secondary"
                      square
                      variant="subtle"
                    />
                  </div>

                  <template #content>
                    <div class="overflow-x-auto overflow-y-auto">
                      <!--
                        Source code:
                        https://ui.nuxt.com/docs/components/command-palette#with-children-in-items
                      -->
                      <UCommandPalette
                        :groups="groups"
                        placeholder="Filter..."
                      >
                        <template #footer>
                          <div class="flex items-center justify-between gap-2">
                            <UIcon
                              name="i-lucide-list-filter"
                              title="Ctrl K - shortcut to sermon list"
                              class="size-5 text-dimmed ml-1"
                            />
                            <div class="flex items-center  gap-1">
                              <UButton
                                color="neutral"
                                variant="ghost"
                                label="Select Menu"
                                size="xs"
                                class="text-dimmed"
                                @click="keyboardClick"
                              >
                                <template #trailing>
                                  <UKbd value="enter" />
                                </template>
                              </UButton>
                              <USeparator
                                orientation="vertical"
                                class="h-4"
                              />

                              <UButton
                                color="neutral"
                                variant="ghost"
                                label=""
                                class="text-dimmed"
                                size="xs"
                              >
                                <template #trailing>
                                  <UKbd value="meta" />
                                  <UKbd value="k" />
                                </template>
                              </UButton>
                            </div>
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
      </div>
    </div>
  </ClientOnly>
</template>
