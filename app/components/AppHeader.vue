<script setup lang="ts">
const { header } = useAppConfig()
const isDrawerOpen = ref(false)
const openMenu = useOpenMenu() // const globalValue = useGlobalValue()

const handleClose = (isOpen: boolean) => {
  if (!isOpen)
    openMenu.value = false // globalValue.value = false
  else
    openMenu.value = true // globalValue.value = true
}
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
