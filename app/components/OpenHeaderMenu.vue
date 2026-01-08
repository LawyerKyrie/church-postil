<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import * as locales from '@nuxt/ui/locale'
import type { AccordionItem, TabsItem } from '@nuxt/ui'
import { findPageChildren } from '@nuxt/content/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { $updateThePageOnLanguageChange } = useNuxtApp() as any

const openMenu = useOpenMenu()
const { locale } = useI18n()
const uiLocale = computed(() => locales[locale.value as keyof typeof locales])

const localeBefore = locale.value // updating it on close click

watch(openMenu, (/* newValue, oldValue */) => {
  if (openMenu.value === false) {
    if (localeBefore !== locale.value) {
      $updateThePageOnLanguageChange(locale.value, localeBefore)
      showToast(`${uiLocale.value.name} selected`, `Updating the page language!`)
    }
  }
  // console.log(`Global variable "openMenu" was changed from "${oldValue}" to "${newValue}"`)
})

// const toggleMenu = () => { openMenu.value = !openMenu.value }

/* <!-- Tabs for toggle of language --> */

const tabs: TabsItem[] = [
  {
    label: 'English',
    icon: 'i-iconoir-language',
    slot: 'en',
    value: 'en'
  },
  {
    label: 'Danish',
    icon: 'i-lucide-languages',
    slot: 'da',
    value: 'da'
  }
]

// 1. Read the locale value and set the correct tab active
const activeTab = ref(locale.value === 'en' ? 'en' : 'da')

// 2. Watch the activeTab variable for changes
watch(activeTab, (newTabValue: string, oldTabValue) => {
  // Optional: check if the new value is different from the old one before running the function
  if (newTabValue !== oldTabValue) {
    locale.value = newTabValue
  }
})

// const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { data: nav_en } = await useAsyncData('filtered-nav1', () => {
  return queryCollectionNavigation('docs')
    .where('path', 'LIKE', '/en/%') // Only include items starting with this path
})
const { data: nav_da } = await useAsyncData('filtered-nav2', () => {
  return queryCollectionNavigation('docs')
    .where('path', 'LIKE', '/da/%') // Only include items starting with this path
})

// filtering away the parent, /en or /da
const flatNavigation = computed(() => {
  const nav_menu = locale.value === 'en' ? nav_en : nav_da
  if (!nav_menu.value) return []

  const targetPath = `/${locale.value}`
  const children = findPageChildren(nav_menu.value, targetPath)
  return children || nav_menu.value // Fallback or adjust logic
})

/* <!-- Select Menu for more alternatives --> */

const { data: sermons } = await useFetch(
  '/api/en-ctrl-k', {
    key: 'church-postil',
    transform: (
      data: { label: string, value: string, type: never, id: number, icon: string, tooltip: string, onSelect: never }[]
    ) => {
      return data?.map(sermon => ({
        label: `${sermon.label}`,
        value: String(sermon.value), // Nothing here
        type: sermon.type,
        id: String(sermon.id),
        icon: String(sermon.icon),
        tooltip: sermon.label, // could also be set above in data sermon
        onSelect: () => {
          showToast(`${sermon.label} selected`, `Sermon opens in a new window`)
          navigateTo(`${sermon.value}`, {
            external: true,
            open: {
              target: '_blank',
              windowFeatures: { width: 800, height: 600 }
            }
          })
        }
      }))
    },
    lazy: true
  }
)

const toast = useToast()
function showToast(title, description) {
  toast.add({
    title: title,
    description: description,
    icon: 'i-lucide-wifi',
    close: {
      color: 'secondary',
      variant: 'outline',
      class: 'rounded-full'
    }
  })
}

const headerMenuAccordion = ref<AccordionItem[]>([
  {
    label: 'Luther\'s Church Postil',
    icon: 'i-iconoir-church'
  }
])
const headerMenuAccordionTabs = ref<TabsItem[]>([
  {
    label: 'Languages',
    icon: 'i-lucide-toggle-right',
    content: 'Toggle between English and Danish version of Luther\'s Church Postil.'
  },
  {
    label: 'About',
    icon: 'i-lucide-file-question-mark',
    content: 'Use Select menu below if you like to search fast for a sermon.'
  }
])
</script>

<template>
  <UCard>
    <template #header>
      <USelectMenu
        placeholder="Luther's Church Postil"
        icon="i-lucide-search"
        trailing-icon="i-lucide-arrow-down"
        :items="sermons"
        :search-input="{
          placeholder: 'Filter Sermons ...',
          icon: 'i-lucide-search'
        }"
        class="w-full"
        @click="console.log('Clicking on the search field')"
      >
        <template #item-label="{ item }">
          <!-- @vue-expect-error  Property 'tooltip' does not exist on type 'AcceptableValue... -->
          <UTooltip :text="item?.tooltip">
            <!-- @vue-expect-error  Property 'label' does not exist on type 'AcceptableValue... -->
            <span v-if="typeof item !== 'string' && 'label' in item">{{ item?.label }}</span>
            <span v-else>Error: No label</span>
          </UTooltip>
        </template>
      </USelectMenu>
    </template>

    <UTabs
      v-model="activeTab"
      :items="tabs"
    >
      <!-- <UTabs @click="closeMenuAndUpdate" -->
      <template #en>
        <UContentNavigation
          highlight
          :navigation="flatNavigation"
          type="single"
          :default-open="false"
          class="pl-2 pr-2"
        />
      </template>

      <template #da>
        <UContentNavigation
          highlight
          :navigation="flatNavigation"
          type="single"
          :default-open="false"
          class="pl-2 pr-2"
        />
      </template>
    </UTabs>

    <template #footer>
      <UAccordion :items="headerMenuAccordion">
        <template #body="{ }">
          <!-- <template #body="{ item }" -->
          <UTabs
            :unmount-on-hide="false"
            :items="headerMenuAccordionTabs"
            class="w-full"
          />
        </template>
      </UAccordion>
    </template>
  </UCard>
</template>
