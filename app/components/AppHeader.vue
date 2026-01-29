<script setup lang="ts">
import { nextTick } from 'vue'

const { header } = useAppConfig()
const isDrawerOpen = ref(false)
const openMenu = useOpenMenu() // const globalValue = useGlobalValue()

const handleClose = (isOpen: boolean) => {
  if (!isOpen)
    openMenu.value = false
  else
    openMenu.value = true
}

// const ctrlKMenu = ref(false)

defineShortcuts({
  m: () => isDrawerOpen.value = !isDrawerOpen.value,
  meta_k: {
    usingInput: true,
    handler: async () => {
      // 1. Open the menu (assuming you control it with a ref)
      // ctrlKMenu.value = true
      // 2. Wait for the Portal/DOM to render the input
      await nextTick()
      // 3. Find the specific input
      requestAnimationFrame(() => {
        const input = document.querySelector('input[placeholder="Type a command or search…"]') as HTMLInputElement
        if (input) {
          // 4. Lock it immediately (stops mobile keyboard)
          input.readOnly = true
          // 5. Add a one-time "Unlock" listener
          const unlock = () => {
            input.readOnly = false
            input.focus()
            // Listener removed automatically after run
          }
          input.addEventListener('mousedown', unlock, { once: true })
          input.addEventListener('touchstart', unlock, { once: true }) // Essential for mobile
        }
      })
    }
  }
})

/*
const handleGlobalCommandPaletteFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement

  // 1. Identify the input (Nuxt UI Command Palette usually has no unique ID,
  // so we check for class or placeholder)
  if (target && (target.placeholder === 'Type a command or search…' || target.closest('input[placeholder="Type a command or search…"]'))) {
    // 2. If it's a "fresh" focus (not yet clicked), lock it
    if (!target.dataset.isUnlocked) {
      target.readOnly = true

      // 3. Attach your 'mousedown' logic once to this specific input
      target.addEventListener('mousedown', () => {
        target.readOnly = false
        target.dataset.isUnlocked = 'true'
        target.focus() // Force focus back after making it editable
      }, { once: true })
    }
  }
}

// Optional: Reset the state when the menu closes
const resetInputsOnGlobalClick = (event: MouseEvent) => {
  // If the user clicks outside or closes, we might want to let the guard
  // protect the input again next time it opens
  const target = event.target as HTMLElement
  if (!target.closest('.u-command-palette')) {
    const input = document.querySelector('input[placeholder="Type a command or search…"]') as HTMLInputElement
    if (input) delete input.dataset.isUnlocked
  }
}

onMounted(() => {
  // 'focusin' catches the automatic focus before the keyboard can pop up
  document.addEventListener('focusin', handleGlobalCommandPaletteFocus)
  document.addEventListener('mousedown', resetInputsOnGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('focusin', handleGlobalCommandPaletteFocus)
  document.removeEventListener('mousedown', resetInputsOnGlobalClick)
})
*/
</script>

<template>
  <!-- mode= "modal" | "slideover" | "drawer" -->
  <UHeader
    v-model:open="isDrawerOpen"
    :ui="{ center: 'flex-1' }"
    :to="header?.to || '/'"
    mode="drawer"
    class="relative"
    @update:open="handleClose"
  >
    <!-- @update:open="handleClose" -->
    <UContentSearchButton
      v-if="header?.search"
      :collapsed="false"
      class="w-full"
    />

    <template
      v-if="header?.logo?.dark || header?.logo?.light || header?.title"
      #title
    >
      <UColorModeImage
        v-if="header?.logo?.dark || header?.logo?.light"
        :light="header?.logo?.light!"
        :dark="header?.logo?.dark!"
        :alt="header?.logo?.alt"
        class="h-6 w-auto shrink-0"
      />

      <span v-else-if="header?.title">
        {{ header.title }}
      </span>
    </template>

    <template
      v-else
      #left
    >
      <NuxtLink :to="header?.to || '/'">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>

      <TemplateMenu />
    </template>

    <template #right>
      <UContentSearchButton
        v-if="header?.search"
        class="lg:hidden"
      />

      <UColorModeButton v-if="header?.colorMode" />

      <!--
      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
      -->
    </template>

    <!-- View of open menu on mobile screens -->
    <template #body>
      <!-- Content navigation menu with language toggle, select menu and traditional content nav -->
      <openHeaderMenu />
      <!-- -->
    </template>
  </UHeader>
</template>
