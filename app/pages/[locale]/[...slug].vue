<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// source loading and saving json with id and files: https://gemini.google.com/share/1f70050d441f
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { useI18n } from 'vue-i18n'

const route = useRoute()

const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

definePageMeta({
  layout: 'docs',
  scrollToTop: false
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

const { locale } = useI18n()

const detectedLocale = computed(() => {
  if (route.path.startsWith('/da')) return 'da'
  if (route.path.startsWith('/en')) return 'en'
  return locale.value // fallback to default i18n state
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Page not found in ${detectedLocale.value} at ${route.path}`,
    fatal: true
  })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', `${route.path}`, {
    fields: ['description']
  })
})

const title = page?.value?.seo?.title || page?.value?.title
const description = page?.value?.seo?.description || page?.value?.description

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
  if (clickOnContentToc.count === 1) {
    tocMenuRef.value = event.target
  } else if (event.target.matches('span[data-slot="linkText"]')
    || event.target.matches('a[data-slot="link"]')) {
    // console.log('isTocOpen,value = false after click on link/linkText!')
    isTocOpen.value = false
  }
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
        // console.log('isTocOpen,value = false after click outside the toc menu.')
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
    // console.log('newHasth: ', newHash)
    // console.log('fullPath: ', route.fullPath)
    const pattern = /-\d+-\d+$/
    if (pattern.test(newHash) && newHash.length > 25) {
      // the hash is probably h2 or ## Sermon Header Title Ending with Bible verse
      const headerId = getIdByPath(route.fullPath)
      if (headerId?.length === 4)
        pageId.value = headerId
    }
    // tocHashArr is required to open the collapsed toc menu where it was last open
    hashArrayRef.value = $tocHashArr(newHash)
  }
})

const pageContainer = ref(null)
const noteRef = ref<any>(null)
const lastActionTime = useLastActionTime() as any // For the "Double-fire" shield

const handleContextMenu = (e: Event) => {
  const now = Date.now()
  // If a highlight was created in the last 1 second, prevent the menu
  if (now - lastActionTime < 1000) {
    e.preventDefault()
  }
}

/* Handle scroll to note linke */
// source: https://gemini.google.com/share/f80fafd3413d
// const { allNotes } = useNotes()

// Watch for when the component is ready
onMounted(() => {
  // This handles the "Arrival" via a link
  // await nextTick()
  // const urlHash = useUrlHash()
  // const isMobile = ref(navigator.maxTouchPoints === 1 || navigator.maxTouchPoints === 1)
  // 1. Get the RAW URL from the performance entries (Nuxt can't hide this)
  const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const fullUrl = navEntry?.name || ''

  if (route.hash.startsWith('#note-')) { // NOTE HASH
    console.log('if1, hash startsWith "note-')
    scrollToNoteFromHash()
  } else if (route.hash.length > 5 // NORMAL HASH
    && !(route.hash.startsWith('#note-') || fullUrl.includes('#:~:text='))) {
    setTimeout(() => {
      console.log('if2 hash is normal')
      const routerHash = route.hash.slice(1)
      document.getElementById(routerHash)?.scrollIntoView({ behavior: 'smooth' })
      // urlHash.value = ''
    }, 50)
  } else if (fullUrl.includes('#:~:text=')) {
    console.log('if3 text search hash')
    const textFragment = fullUrl.split('#')[1] // Gets :~:text=...

    // 2. Put it back into the address bar so it stays there
    if (import.meta.client) {
      window.history?.replaceState(null, '', window.location.pathname + '#' + textFragment)
    }
    // 3. Your "Nudge" to ensure the browser highlights
    setTimeout(() => {
      window.scrollBy(0, 1)
      window.scrollBy(0, -1)
    }, 500)
  } else if (route.hash.length === 0 // NO HASH
    && !fullUrl.includes('#:~:text=')) {
    // Before this code the page opened in the bottom view
    console.log('if4 no hash')
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // or 'instant'
    })
  } else { // THIS SHOULD NEVER HAPPEN
    console.log('else(5) - scrollRestoration')
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto'
    }
  }
})

/*
if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto'
    }
*/

// This handles the "Jumping" if you are already on the page
watch(() => route.hash, () => {
  if (route.hash.startsWith('#note-'))
    scrollToNoteFromHash()
  else console.log('string not starts width #note-')
}) // https://gemini.google.com/share/c9a8b8ceb3f8

const { allNotes } = useNotes()

const scrollToNoteFromHash = () => {
  const noteId = route.hash?.replace('#note-', '')
  const targetNote = allNotes.value.find(n => String(n.id) === noteId)

  if (targetNote) {
    const notePos = targetNote.top

    // Your discovered "Sweet Spot" formula
    const responsiveOffset = window.innerWidth * 0.7
    const finalTarget = notePos + responsiveOffset

    window.scrollTo({
      top: finalTarget - 70,
      behavior: 'smooth'
    })
  }
}

/* GET THE PAGE ID FROM THE PAGE PATH AND SAVE IT */
const pageId = usePageId()
const { getIdByPath } = useOppositeLanguage()
pageId.value = getIdByPath(route.fullPath) as string

// Toc menu icon or x (close)
const tocIcon = (open) => {
  return open ? '✖' : '☰'
}
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
      <div
        ref="pageContainer"
        class="relative scripture-wrapper"
        @mouseup="noteRef?.handleTextInteraction"
        @touchend="noteRef?.handleTextInteraction"
        @contextmenu.prevent="handleContextMenu"
      >
        <ContentRenderer
          v-if="page"
          :value="page"
          class="cursor-crosshair scripture-content"
        />

        <ClientOnly>
          <GithubComments />
          <RightBottomMenu />
          <AddNoteToMdPage
            v-if="page"
            ref="noteRef"
            :target="pageContainer"
            :title="page.title"
          />
        </ClientOnly>

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </div>
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
        :title="`${tocIcon(isTocOpen)} ${toc?.title} ${page?.title}`"
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

<style scooped>
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

/* Remove 'scoped' from your <style> tag for this part */

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
</style>
