<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWindowSize, useWindowScroll } from '@vueuse/core'

const isMobile = ref(false)
const { width, height } = useWindowSize()
const pos = {
  width: width.value, // not necessary
  height: height.value, // width.value could be used below
  get x() {
    const result = isMobile.value === true ? this.width - 35 : this.width - 48
    return result.toString()
  },
  get y() {
    const result = this.height - 33
    return result.toString()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { $updateThePageOnLanguageChange, $keyboardClickK, $keyboardClickM } = useNuxtApp() as any
const { locale } = useI18n()
const oldLocale = locale.value

/* --------------------------------- */

/* Creating popup menu and insert it on the right side */
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

onMounted(() => {
  if (navigator.userAgent.includes('Windows'))
    return isMobile.value = false
  else if (width.value < 540)
    return isMobile.value = true
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
const selectMenuOpen = ref(false)
const groups = [
  {
    id: 'actions',
    label: 'Actions',
    items: [
      {
        label: 'Content Menu',
        icon: 'i-lucide-menu',
        title: 'Keyboard click on M opens this Menu',
        onClick: $keyboardClickM

      },
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

/* Close movable button on scroll */
const { /* x, */y } = useWindowScroll({ idle: 200,
  onStop: () => { scrollStopped.value = true }
})

const scrollStopped = ref(false)
const showBottomMenu = ref(false)

watch(scrollStopped, () => {
  showBottomMenu.value = window.scrollY > 200
  scrollStopped.value = false
})

// React to scroll changes
watch(y, (newY) => {
  if (newY > 100) {
    if (notClosed.value === true) {
      if (selectMenuOpen.value === true) return
      // Handling a problem with the state of the button (nothing serious)
      inActive.value = true
      notClosed.value = false
    } else {
      showBottomMenu.value = false
    }
  }
})

/* On click outside movable menu the button stays inActive = false */
watch(notClosed, () => {
  // This code making the uSwitch button active when it's closing with click outside
  if (notClosed.value !== true)
    inActive.value = true
})

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
    const input = domNode.children[0].children[0] as HTMLInputElement // domNode.querySelector('input')

    if (input) {
      // Your logic here (e.g., input.focus())

      // Option A: Blur it immediately
      input.blur()

      // Option B: Make it readonly temporarily so keyboard can't open
      input.readOnly = true
      setTimeout(() => {
        input.readOnly = false
      }, 100)
    }
  }
}

const templateExpandedHandler = () => { /* */ }
</script>

<template>
  <ClientOnly>
    <div
      v-if="showBottomMenu"
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
            <div class="rotate-90">
              <USwitch
                v-model="inActive"
                :title="inActive === true ? 'Open Menu' : 'Close Menu'"
                color="secondary"
                unchecked-icon="i-lucide-x"
                checked-icon="i-lucide-arrow-left"
                @mousedown="handlePressStart"
                @mouseup="handlePressEnd"
                @touchstart="handlePressStart"
                @touchend="handlePressEnd"
                @click="handleClickEvent($event, isHold)"
              />
            </div>

            <template #content>
              <div>
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
                                @click="$keyboardClickK"
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
                                  <span class="hidden">{{ templateExpandedHandler() }}</span>
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
