<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// source loading and saving json with id and files: https://gemini.google.com/share/1f70050d441f
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { useI18n } from 'vue-i18n'
import type { AccordionItem } from '@nuxt/ui'

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
const source = page?.value.seo.source || page?.value?.source

const currentOrigin = ref('https://church-postil.vercel.app')

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: () => `${currentOrigin.value}${route.path}`
})

const showSourceAccordion = computed(() => {
  if (route.path.startsWith('/en')) return true
  else if (route.path.endsWith('-postil')) return false
  else if (route.path.includes('/da/notes')) return false
  else if (route.path.includes('/uddrag')) return false
  else return true
})

// Using computed ensures it updates if route.path changes
const sourceObj = computed(() => {
  let postilRef, volumeRef, urlRef, differences

  if (route.path.startsWith('/da')) return // if (locale.value !== 'en') return
  else {
    let postil = title.split(' ')[0]
    if (postil === 'Trinity') {
      const oneOrTwo = title.split(' ')[1]
      postil += ' ' + oneOrTwo
    }
    switch (postil) {
      case 'Advent':
        postilRef = '[7 & 10](https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr07luth+OR+precioussacredwr10luth&sort=publicdate){:target="_blank" title="Link to this two volumes on archive.org"}'
        volumeRef = '- Epistles (vol 7) & \n- Gospels (vol 10)'
        urlRef = 'https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr07luth+OR+precioussacredwr10luth&sort=publicdate'
        differences = ''
        break
      case 'Christmas':
        postilRef = '[7, 8, 10 & 11](https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr07luth+OR+precioussacredwr11luth+OR+precioussacredwr10luth+OR+precioussacredwr11luth&sort=publicdate){:target="_blank" title="Link to this four volumes on archive.org"}' // 8 & 11 = Epiphany
        volumeRef = '- Epistles (vol 7 & 8) & \n- Gospels (vol 10 & 11)' // 8 & 11 = Epiphany
        urlRef = 'https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr07luth+OR+precioussacredwr11luth+OR+precioussacredwr10luth+OR+precioussacredwr11luth&sort=publicdate'
        differences = '- The original Christmas (& Advent) postil of 1521/22 was in 1544 part of the Winter Postil'
        break
      case 'Lent':
        postilRef = '[8 & 11](https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr08luth+OR+precioussacredwr11luth&sort=publicdate){:target="_blank" title="Link to this two volumes on archive.org"}'
        volumeRef = '- Epistles (vol 8) & \n Gospels (vol 11)'
        urlRef = 'https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr08luth+OR+precioussacredwr11luth&sort=publicdate'
        differences = '- In the 1543/44 version of the Church Postil this postil and (the previous two postil\'s) was part of the winter postil.'
        break
      case 'Easter':
        postilRef = '[8, 9, 11 & 12](https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr08luth+OR+precioussacredwr09luth+OR+precioussacredwr11luth+OR+precioussacredwr12luth&sort=publicdate){:target="_blank" title="Link to this four volumes on archive.org"}' // 9 & 12 = Trinitatis
        volumeRef = '- Epistles (vol 8 & 9) & \n- Gospels (vol 11 & 12)' // 9 & 12 = Trinitatis
        urlRef = 'https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr08luth+OR+precioussacredwr09luth+OR+precioussacredwr11luth+OR+precioussacredwr12luth&sort=publicdate'
        differences = '- Original "easter" postil starts on the first day of easter (1.part of the Summer Postil)'
        break
      case 'Trinity I':
        postilRef = '[9 & 13](https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr09luth+OR+precioussacredwr13luth&sort=publicdate){:target="_blank" title="Link to this two volumes on archive.org"}' // 1-12 Sunday after Trinitatis
        volumeRef = '- Epistles (vol 9) & \n- Gospels (vol 13)' // 1-12 Sunday after Trinitatis
        urlRef = 'https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr09luth+OR+precioussacredwr13luth&sort=publicdate'
        differences = '- This postil was originally part of the Summer Postil (1526/27)'
        break
      case 'Trinity II':
        postilRef = '[9 & 14](https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr09luth+OR+precioussacredwr14luth&sort=publicdate){:target="_blank" title="Link to this two volumes on archive.org"}'
        volumeRef = '- Epistles (vol 9) & \n- Gospels (vol 14)'
        urlRef = 'https://archive.org/details/Wellesley_College_Library?tab=collection&query=precioussacredwr09luth+OR+precioussacredwr14luth&sort=publicdate'
        differences = '- - The sermon on all saint\'s (included here) was originally from the Festival Postil (1526/27)'
        break
      default:
        postilRef = '[Error](http://bad-url-ref.com){:target="_blank" title="Error - No volumes is detected!"} in Title - Unknown Postil!'
        volumeRef = '- Error in Title - Unknown volume of Lenker\'s work!'
        urlRef = 'http://bad-url-ref.com'
        differences = ''
        break
    }
  }
  // https://share.google/aimode/p0aviyRrIPS1Ouwdp
  return { postilRef, volumeRef, urlRef, differences }
})

useHead({
  link: computed(() => {
    if (source === undefined) return []

    return [{
      rel: 'canonical',
      href: sourceObj.value?.urlRef === undefined ? source : sourceObj.value?.urlRef
    }]
  })
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
const { $tocHashArr, $collapsibleToc /* , $activateNoteMenu */ } = useNuxtApp() as any

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
      if (headerId?.length === 4) {
        pageId.value = headerId
      }
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

/* ------- CREDIT AND SOURCES --------- */
const sourceAccordion: AccordionItem[] = [
  {
    label: 'Kilde & Publikasjon Historie',
    icon: 'i-wordpress-comment-author-name'
  }
]

const activeSourceAccordion = ref()

const getPostil = () => {
  const filePath = route.path
  const pathArray = filePath.split('/')

  const postil = pathArray[2]
  switch (postil) {
    case 'advent':
      return 'Advent Postil'
    case 'christmas':
      return 'Jule Postil'
    case 'lent':
      return 'Faste Postil'
    case 'easter':
      return 'Påske Postil'
    case 'trinity1':
      return 'Trefoldighed I'
    case 'trinity2':
      return 'Trefoldighed II'
    default:
      return 'Error'
  }
}

const daItems = [
  {
    label: 'Oversettelse - Referanse',
    icon: 'i-entypo-creative-commons-public-domain',
    class: '',
    content: '&nbsp;'
      + 'Denne prediken er **oversatt/digitalisert av Finn B. Andersen**\n'
      + '- **Kilde:** [www.lutherdansk.dk/etc.]('
      + source
      + '){:target="_blank" title="Kirkepostillen i dansk oversættelse av Finn B.Andersen"}'
  },
  {
    label: 'Digital kilde',
    icon: 'i-lucide-library',
    class: '',
    content: '&nbsp;'
      + 'Digitalisert/ oversatt til html/pdf osv. av _Finn B.Andersen_.\n'
      + '- **Digital kilde:** [www.lutherdansk.dk/etc.]('
      + source
      + '){:target="_blank" title="Den danske kirkepostille av Finn B.Andersen"}\n'
  },
  {
    label: 'Historisk info - Kirke Postil',
    icon: 'i-lucide-church',
    class: '',
    content: '&nbsp;'
      + '**Original værk:**\n'
      + '- _Luther\'s Kirke Postil_ (1544)\n'
      + '- **Postil?** Denne prædiken er del av '
      + '**' + getPostil() + '**'
  },
  {
    label: 'Optimalisert for mobil',
    icon: 'i-circum-mobile-4',
    class: '',
    content: '&nbsp;'
      + 'Optimized for studies on mobile.\n'
      + 'Students (& others) can:\n'
      + '- Highlight text &\n'
      + '- Create note bobbles (dbl.click)\n'
      + '- Print, export & import notes etc.\n'
      + '- Share the URL to notes or\n'
      + '- Find notes in the note menu\n'
      + '- & click to go to the notes.\n'
      + '- Note Menu = Right Btm Menu'
  }
]// https://share.google/aimode/p0aviyRrIPS1Ouwdp

const enItems = [
  {
    label: 'Translation - Lenker Reference',
    icon: 'i-entypo-creative-commons-public-domain',
    class: '',
    content: '&nbsp;'
      + 'This version of the postil was **translated by J.N. Lenker D.D.** (1903)\n'
      + '- Source of postil sermons is vol. '
      + sourceObj.value?.postilRef
      + ' of Lenker\'s multivolume work: _The Precious and Sacred Writings of Martin Luther_ (1903)\n'
      + sourceObj.value?.volumeRef
  },
  {
    label: 'Digital Source - USA Library',
    icon: 'i-lucide-library',
    class: '',
    content: '&nbsp;'
      + 'Digitized to pdf/txt etc. by _Wellesley College Library_.\n'
      + '- **Digital Source:** [Wellesley College Library]('
      + sourceObj.value?.urlRef
      + '){:target="_blank" title="The volumes of Lenker\'s Church Postil at archive.org (that contains the original text of this page)"} (archive.org)\n'
      + '- Part of this Library\'s [Collection on Internet Archive](https://archive.org/details/Wellesley_College_Library?tab=collection&query=Lenker&sort=publicdate){:target="_blank" title="The eight (8) volumes of Lenker\'s Church Postil at archive.org"}.\n'
      + '- Wellesley College Library is part of the [The Boston Library Consortium](https://archive.org/details/blc?tab=collection&query=Wellesley){:target="_blank" title="The Boston Library Consortium (on Internet Archive)"}'
  },
  {
    label: 'Historical info - Church Postil',
    icon: 'i-lucide-church',
    class: '',
    content: '&nbsp;'
      + '**Original Work:**\n'
      + '- _Luther\'s Church Postil_ (1544)\n'
      + '- **Postil?** The sermons on this page belongs to the '
      + '**' + title + '**\n'
      + sourceObj.value?.differences
  },
  {
    label: 'Optimized for mobile etc.',
    icon: 'i-circum-mobile-4',
    class: '',
    content: '&nbsp;'
      + 'Optimized for studies on mobile.\n'
      + 'Students (& others) can:\n'
      + '- Highlight text &\n'
      + '- Create note bobbles (dbl.click)\n'
      + '- Print, export & import notes etc.\n'
      + '- Share the URL to notes or\n'
      + '- Find notes in the note menu\n'
      + '- & click to go to the notes.\n'
      + '- Note Menu = Right Btm Menu'
  }
]// https://share.google/aimode/p0aviyRrIPS1Ouwdp
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
      <UAccordion
        v-if="showSourceAccordion"
        v-model="activeSourceAccordion"
        :items="sourceAccordion"
      >
        <template #content>
          <!-- <p class="pb-3.5 text-sm text-muted"></p> -->
          <UAccordion
            type="single"
            :items="route.path.startsWith('/en') ? enItems : daItems"
            :unmount-on-hide="false"
            :default-value="['0']"
            class="pl-4"
            :ui="{
              trigger: 'text-base',
              body: 'text-base text-muted'
            }"
          >
            <template #body="{ item }">
              <MDC
                :value="item.content"
                unwrap="p"
              />
            </template>
          </UAccordion>
        </template>
      </UAccordion>
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

        <UAlert
          v-if="route.path.startsWith('/en')"
          title="Translated by J. N. Lenker (1903)"
          :description="`${sourceObj?.volumeRef}`"
          color="neutral"
          variant="outline"
          :actions="[
            {
              label: 'Check Source',
              to: sourceObj?.urlRef,
              target: '_blank'
            }
          ]"
          class="my-6"
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
          trailing: 'text-info',
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
