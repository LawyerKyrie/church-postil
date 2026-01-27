<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { useI18n } from 'vue-i18n'

const route = useRoute()

const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

definePageMeta({
  layout: 'docs'
})
// const { data: page } = await useAsyncData(path, () => queryCollection('docs').path(path).first())

const { data: page } = await useAsyncData(
  `${route.path}`,
  () =>
    queryCollection('docs')
      // .where('path', '=', path)
      .path(route.path)
      .first()
)
/*
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
*/
const { locale } = useI18n()

const detectedLocale = computed(() => {
  if (route.path.startsWith('/da')) return 'da'
  if (route.path.startsWith('/en')) return 'en'
  return locale.value // fallback to default i18n state
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    message: `Page not found in ${detectedLocale.value} at ${route.path}`,
    fatal: true
  })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', `${route.path}`, {
    fields: ['description']
  })
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

const currentOrigin = ref('https://church-postil.vercel.app')

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: () => `${currentOrigin.value}${route.path}`
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

defineOgImageComponent('Docs', {
  headline: headline.value
})

// 3. Wrap the logic in a safe Computed block
const links = computed(() => {
  // If page is null (because it's an API route or 404),
  // return an empty array immediately. No 'return' outside this function!
  if (!page.value) return []

  const toc = (page.value as any)?.body?.toc
  const result: any[] = []

  // Now we safely use page.value because we checked it above
  if (toc?.bottom?.edit) {
    result.push({
      icon: 'i-lucide-external-link',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${page.value.stem}.${page.value.extension}`,
      target: '_blank'
    })
  }

  return result
})
// Start working with the toc menu

/* -------- SAVING NAV MENU REF ---------- */
// Only used as ref to recognize click outside toc menu
const tocMenuRef = ref<HTMLElement | null>(null) // found after 1.click

// Saving nav menu reference when toc is opened first time
clickOnContentToc.count = 0
function clickOnContentToc(event) {
  clickOnContentToc.count++
  if (clickOnContentToc.count === 1)
    tocMenuRef.value = event.target
}

watch(tocMenuRef, (newValue, oldValue) => {
  if (oldValue === null) // Happening only once
    tocMenuRef.value = newValue?.closest('nav[data-state]') as HTMLElement
})

/* FINISH SAVING TOC NAV MENU REF */

// Close the toc menu on click outside the toc menu
onMounted(() => {
  document.addEventListener('click', function (event) {
    if (isTocOpen.value && tocMenuRef.value !== null) {
      const containsElement = event.composedPath().includes(tocMenuRef.value)
      if (!containsElement) {
        isTocOpen.value = false
      }
    }
  })
})

/* COLLAPSIBLE HANDLER FOR CLICK ETC. ON CONTENT TOC */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { $tocHashArr, $collapsibleToc } = useNuxtApp() as any

const isTocOpen = ref(false) // Initial state (e.g., closed)

const handleUpdate = (isOpen: boolean) => {
  isTocOpen.value = !isOpen ? false : true
  if (isOpen) {
    // if menu have already been open open it again in the same place
    $collapsibleToc([...hashArrayRef.value]) // collapsibleToc()
  }
}

const hashArrayRef = ref([])

// Watch for changes in the URL hash (e.g., #second-sunday... etc.)
watch(() => route.hash, (newHash /* , oldHash */) => {
  if (newHash) {
    // tocHashArr is required to open the collapsed toc menu where it was last open
    hashArrayRef.value = $tocHashArr(newHash)
  }
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      v-if="page"
      :title="page.title"
      :description="page.description"
      :headline="headline"
    >
      <template #links>
        <UButton
          v-for="(link, index) in page?.links"
          :key="index"
          v-bind="link"
        />

        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <ClientOnly>
        <GithubComments />
        <RightBottomMenu />
      </ClientOnly>

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <!--
      CREATING CUSTOM ACCORDION OF CONTENT TOC - LOOK ON THE FOLLOWING URL FOR TIPS
      https://www.google.com/search?q=nuxt+ui+content+toc+-+enable+collabseble+rows+for+subchapters&oq=nuxt+ui+content+toc+-+enable+collabseble+rows+for+subchapters&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCTY2MDQyajBqN6gCCLACAfEF-8X75usZAAg&sourceid=chrome&ie=UTF-8
      -->
      <UContentToc
        v-model:open="isTocOpen"
        :title="`${toc?.title} -  ${page?.title}`"
        :links="page.body?.toc?.links"
        :ui="{
          title: 'text-info',
          trailing: 'text-error',
          link: 'focus:text-secondary active:text-warning hover:text-error visited:text-neutral'
        }"
        @click="clickOnContentToc"
        @update:open="handleUpdate"
      >
        <template
          v-if="toc?.bottom"
          #bottom
        >
          <div
            class="hidden lg:block space-y-6"
            :class="{ '!mt-6': page.body?.toc?.links?.length }"
          >
            <USeparator
              v-if="page.body?.toc?.links?.length"
              type="dashed"
            />

            <UPageLinks
              :title="toc.bottom.title"
              :links="links"
            />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>

<style scope>
/*
  Style and solution for content toc accordion.
  Uncomment above (line 126) // ulParent.setAttribute('class', 'tree')
  and change "nav > div div:nth-child(2)" with .tree below
  - if you want to simplify css code below.
*/

nav > div div:nth-child(2) > ul, nav > div div:nth-child(2) > ul ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

nav > div div:nth-child(2) > ul li {
  position: relative;
  padding-left: 25px; /* Space for the arrow */

  line-height: 2;
  cursor: pointer;
  user-select: none; /* Prevents text highlighting on double click */

}

/* 1. The Base Arrow State */

nav > div div:nth-child(2) > ul li.has-children::before {
  content: '\25B7'; /* '▶' */

  position: absolute;
  left: 5px;
  top: 0;
  display: inline-block; /* REQUIRED for rotation to work */

  transition: transform 0.2s ease;
  font-size: 10px;
  color: #666;
}

/* 2. The Rotation Logic (FIXED SELECTOR) */
/* Removed the ">" because ::before belongs to the LI itself */

nav > div div:nth-child(2) > ul li.is-open::before {
  transform: rotate(90deg);
}

/* 3. Visibility Logic */

nav > div div:nth-child(2) > ul li > ul {
  display: none;
}

nav > div div:nth-child(2) > ul li.is-open > ul {
  display: block;
}

/*
Reference
https://gemini.google.com/share/59939ee5a006
*/
/* For all elements */
body::-webkit-scrollbar {
    width: 15px; /* For vertical scrollbar */
}
body::-webkit-scrollbar-thumb {
    background: #888; /* Dark gray thumb */
    border-radius: 6px; /* Rounded corners */
    /* height: 35px */
}

body::-webkit-scrollbar-thumb:hover {
    background: #555; /* Darker on hover */
}
</style>
