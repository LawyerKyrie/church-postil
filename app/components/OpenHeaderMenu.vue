<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import * as locales from '@nuxt/ui/locale'
import type { AccordionItem, TabsItem } from '@nuxt/ui'
import { findPageChildren } from '@nuxt/content/utils'
import { useRouter } from 'vue-router'

const router = useRouter()

const isMenuOpen = ref(false)
isMenuOpen.value = true // this code is only running when the menu is open

// const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }

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
const uiLocale = computed(() => locales[locale.value as keyof typeof locales])
// uiLocale used one time in showToast when toggle lang

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

  const headerParent = event.target.closest('div[data-dismissable-layer]')
  const closeBtn = headerParent.children[1].children[1].children[2].children[0]

  /* // Testing children1children1children2children0
  const divHeader = headerParent.children[1] // <div data-slot="header" OK
  const divRight = divHeader.children[1] // <div data-slot="right">
  const btn3 = divRight.children[2] // < close button (third child of <div data-slot"right")
  const closeBtn = btn3.children[0] // <span (click on close btn is registered here)
  */

  showToast(`${uiLocale.value.name} is selected`, `Close the menu and read the page in English `)

  closeBtn.addEventListener('click', oneTimeClickHandler)

  // Check locale and if... update the page language
  function oneTimeClickHandler() { // inside closeMenuAndUpdate()
    if (localeBefore !== locale.value) {
      updateThePageLanguage()
    } // And don't wait for more click
    closeBtn.removeEventListener('click', oneTimeClickHandler)
  } // End of function oneTimeClickHandler()

  function updateThePageLanguage() { // inside closeMenuAndUpdate
    localeBefore = locale.value // updating localeBefore to the last changed language
    const oldPath = ref(window.location.pathname)
    let restPath = oldPath.value?.slice(3)
    if (restPath.startsWith('/')) restPath = restPath.slice(1)

    const newPath = `../${locale.value}/${restPath}`

    const endings = ['advent', 'christmas', 'lent', 'easter', 'trinity1', 'trinity2']
    function endsWithAny(str, suffixes) {
      return suffixes.some(function (suffix) {
        return str.endsWith(suffix)
      })
    }
    if (endsWithAny(newPath, endings)) {
      console.log('The string ends with one of the specified suffixes.')
      // Output: The string ends with one of the specified suffixes.
      router.push(`${newPath}`)
      isMenuOpen.value = false
    } else {
      console.log('The string does not end with any of the specified suffixes.')

      // Checking if the old route exists in the new language code
      const index2LastSlash = newPath.lastIndexOf('/')
      let resultUrl
      if (!router.hasRoute(newPath)) {
        if (index2LastSlash !== -1) {
          // removing /filename and returning to the folders index-file
          // if not a folder
          resultUrl = newPath.slice(0, index2LastSlash)
          console.log('before resultUrl')
          console.log('New resultUrl: ')
          console.log(resultUrl)
          router.push(`../${resultUrl}`)
          // removing the old locale value with ../
        }
        return
      }
    }
  }
} // End of function main function closeMenuAndUpdate(event)

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
  '/api/sermons', {
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
    <UTabs
      v-model="activeTab"
      :items="tabs"
      @click="closeMenuAndUpdate"
    >
      <template #en>
        <UContentNavigation
          v-model:open="isMenuOpen"
          highlight
          :navigation="flatNavigation"
          type="single"
          :default-open="false"
          class="pl-2 pr-2"
        />
      </template>

      <template #da>
        <UContentNavigation
          v-model:open="isMenuOpen"
          highlight
          :navigation="flatNavigation"
          type="single"
          :default-open="false"
          class="pl-2 pr-2"
        />
      </template>
    </UTabs>

    <template #footer>
      <USelectMenu
        placeholder="Most relevant sermons"
        icon="i-lucide-search"
        trailing-icon="i-lucide-arrow-down"
        :items="sermons"
        :search-input="{
          placeholder: 'Filter...',
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
  </UCard>
</template>
