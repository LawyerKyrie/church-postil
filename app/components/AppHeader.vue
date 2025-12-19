<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ContentNavigationItem } from '@nuxt/content'
import type { TabsItem } from '@nuxt/ui'

/* <!-- Tabs for toggle of language --> */

const tabs: TabsItem[] = [
  {
    label: 'English',
    icon: 'i-iconoir-language',
    slot: 'en',
    value: 0
  },
  {
    label: 'Danish',
    icon: 'i-lucide-languages',
    slot: 'da',
    value: 1
  }
]

// 1. Read the locale value and set the correct tab active
const { locale } = useI18n()

const handleTabChange = (newTabValue: number) => {
  // Code for changing the content menu should be added below
  switch (newTabValue) {
    case 0:
      locale.value = 'en'
      break
    case 1:
      locale.value = 'da'
      break
    default:
      console.log('Sorry! Only Eng/Dan Tabs.')
  }
}

const activeTab = ref(locale.value === 'en' ? 0 : 1)

// 2. Watch the activeTab variable for changes
watch(activeTab, (newTabValue: number, oldTabValue) => {
  // Optional: check if the new value is different from the old one before running the function
  if (newTabValue !== oldTabValue) {
    handleTabChange(newTabValue)
  }
})

let localeBefore = locale.value // updating it on close click

function closeMenuAndUpdate(event) { // When Lang Tab is clicked
  // Clicked locale tabs is in-argument to this function

  if (localeBefore === locale.value) return

  const bodyElement = event.target.closest('div[data-slot="body"]')
  const menuParent = bodyElement.parentElement
  const closeBtn = menuParent.children[1].children[1].children[2].children[0]

  closeBtn.addEventListener('click', oneTimeClickHandler)

  // Check locale and if... update the page language
  function oneTimeClickHandler() { // inside closeMenuAndUpdate()
    if (localeBefore !== locale.value) {
      updateThePageLanguage()
    } // And don't wait for more click
    closeBtn.removeEventListener('click', oneTimeClickHandler)
  } // End of function oneTimeClickHandler()

  function updateThePageLanguage() { // inside closeMenuAndUpdate
    const path = ref(window.location.pathname)
    console.log('Path to last page: ' + path.value)
    console.log('The new locale (language) is: ' + locale.value)
    localeBefore = locale.value
    console.log('UPDATE THE PAGE TO NEW LANG!')
  }
} // End of function main function closeMenuAndUpdate(event)

/* <!-- Select Menu for more alternatives --> */

const selectmenu = ref(['Postil 1', 'Postil 2', 'In Progress', 'Done'])

// Using only in template
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { header } = useAppConfig()
</script>

<template>
  <UHeader
    :ui="{ center: 'flex-1' }"
    :to="header?.to || '/'"
  >
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
      <UBanner
        class="content-navigation-body-banner"
        title="Toggle Between English & Danish Language of Luther's Church Postil"
        close
        close-icon="i-lucide-x-circle"
      />
      <UCard>
        <template #header>
          <UTabs
            v-model="activeTab"
            :items="tabs"
            @click="closeMenuAndUpdate"
          >
            <template #en />
            <template #da />
          </UTabs>
        </template>

        <UContentNavigation
          highlight
          :navigation="navigation"
          type="single"
          :default-open="false"
        />

        <template #footer>
          <USelectMenu
            placeholder="Other Pages"
            :items="selectmenu"
            class="w-full"
          />
        </template>
      </UCard>
    </template>
  </UHeader>
</template>
