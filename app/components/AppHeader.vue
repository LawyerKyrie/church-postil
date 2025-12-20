<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { TabsItem } from '@nuxt/ui'
// import type { ContentNavigationItem } from '@nuxt/content'

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

  const headerParent = event.target.closest('div[data-dismissable-layer]')
  const closeBtn = headerParent.children[1].children[1].children[2].children[0]
  /* // Testing and building up the children1children1children2children0
  const child1 = headerParent.children[1] // <div data-slot="header" OK
  const child2 = child1.children[1] // <div data-slot="right">
  const child3 = child2.children[2] // < close button (third child of <div data-slot"right")
  const child4 = child3.children[0] // <span (click on close btn is registered here)
  */

  showToast(`Toggle the Language`, `${locale.value} is selected!`)

  closeBtn.addEventListener('click', oneTimeClickHandler)

  // Check locale and if... update the page language
  function oneTimeClickHandler() { // inside closeMenuAndUpdate()
    if (localeBefore !== locale.value) {
      console.log('update the page language')
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

// const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { data: nav_en } = await useAsyncData('filtered-nav1', () => {
  return queryCollectionNavigation('docs')
    .where('path', 'LIKE', '/en/%') // Only include items starting with this path
})
const { data: nav_da } = await useAsyncData('filtered-nav2', () => {
  return queryCollectionNavigation('docs')
    .where('path', 'LIKE', '/da/%') // Only include items starting with this path
})

/* <!-- Select Menu for more alternatives --> */
const { header } = useAppConfig()

const { data: sermons } = await useFetch(
  '/api/sermons', {
    key: 'church-postil',
    transform: (
      data: { label: string, value: string, type: never, id: number, icon: string }[]
    ) => {
      return data?.map(sermon => ({
        label: `${sermon.label}`,
        value: String(sermon.value), // Nothing here
        type: sermon.type,
        id: String(sermon.id),
        icon: String(sermon.icon)
      }))
    }
  // lazy: true
  }
)
// NB! The original _value object in computedRefImpl is not iterable and dos not get copied to the new computed ref.
const computedRefSermons = computed(() => {
  return sermons.value.map((sermon) => {
    return {
      ...sermon,
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
    }
  })
})

const toast = useToast()
function showToast(title, description) {
  toast.add({
    title: title,
    description: description,
    icon: 'i-lucide-wifi',
    close: {
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    }
  })
}
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
      <UCard>
        <template #header>
          <UBanner
            class="content-navigation-body-banner"
            title="Toggle Between English & Danish Language of Luther's Church Postil"
            close
            close-icon="i-lucide-x-circle"
          />
        </template>

        <UTabs
          v-model="activeTab"
          :items="tabs"
          @click="closeMenuAndUpdate"
        >
          <template #en>
            <UContentNavigation
              highlight
              :navigation="nav_en"
              type="single"
              :default-open="false"
              class="pl-2 pr-2"
            />
          </template>

          <template #da>
            <UContentNavigation
              highlight
              :navigation="nav_da"
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
            :items="computedRefSermons"
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
  </UHeader>
</template>
