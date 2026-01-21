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
    showToast(`Close the Menu`, `- and open it again - if you need the SELECT MENU in Updated Language`)
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
type RowCells = {
  id: string
  postil: string
  tag: string
  label: string
  bible: string
  value: string
  type: never
  icon: string // creates one tab on sermons
}

const { data: sermons } = await useFetch<RowCells[]>(
  `/api/${locale.value}/sermons`, {
    key: 'church-postil',
    transform: (
      data
    ) => {
      return data?.map(sermon => ({
        ...sermon,
        label: `${sermon.label} - ${sermon.bible === undefined ? '' : sermon.bible}`,
        icon: sermon.icon === undefined ? '&nbsp;' : sermon.icon, // This creates a tab on sermons
        tooltip: `${sermon.label} - ${sermon.bible === undefined ? '' : sermon.bible}`,
        onSelect: () => {
          showToast(`${sermon.label} selected`, `Sermon opens in a new window`)
          navigateTo(`${sermon.value}`, {
            external: false
            /*
            open: {
              target: '_blank',
              windowFeatures: { width: 800, height: 600 }
            }
            */
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

const footerMenuAccordion = ref<AccordionItem[]>([
  {
    label: 'About Luther\'s Church Postil',
    icon: 'i-iconoir-church'
  }
])
const footerMenuAccordionTabs = ref<TabsItem[]>([
  {
    label: 'Languages',
    icon: 'i-lucide-toggle-right',
    content: `
      Toggle between English and Danish version of Luther's Church Postil.
    `
  },
  {
    label: 'About',
    icon: 'i-lucide-file-question-mark',
    content: `
      - Church Postil is in public domain. 
      - "Ctrl k" activate the Select Menu.
    `
  }
])

/* Open the UContentNavigation where it was last open */
const openedPaths = useState('nav-persistent-state', () => [])
</script>

<template>
  <UCard>
    <template #header>
      <USelectMenu
        :placeholder="`${locale === 'en' ? 'Sermons Luther\'s Church Postil' : 'Prædikener Luthers Postiller'}`"
        icon="i-lucide-search"
        trailing-icon="i-lucide-arrow-down"
        :items="sermons"
        :search-input="{
          placeholder: `${locale === 'en' ? 'Filter Sermons...' : 'Filtrer Prædikener...'}`,
          icon: 'i-lucide-search'
        }"
        class="w-full"
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
          highlight-color="primary"
          :navigation="flatNavigation"
          type="single"
          :default-open="false"
          class="pl-2 pr-2"
        />
      </template>

      <template #da>
        <UContentNavigation
          v-model:open="openedPaths"
          highlight
          highlight-color="primary"
          :navigation="flatNavigation"
          type="single"
          :default-open="true"
          class="pl-2 pr-2"
        />
      </template>
    </UTabs>

    <template #footer>
      <UAccordion :items="footerMenuAccordion">
        <template #body="{ }">
          <!-- <template #body="{ item }" -->
          <UTabs
            :unmount-on-hide="false"
            :items="footerMenuAccordionTabs"
            color="neutral"
            class="w-full"
          />
        </template>
      </UAccordion>
    </template>
  </UCard>
</template>
