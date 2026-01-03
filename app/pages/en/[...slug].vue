<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs'
})

const { path } = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

// const { data: page } = await useAsyncData(path, () => queryCollection('docs').path(path).first())

const { data: page } = await useAsyncData(
  `${path}`,
  () =>
    queryCollection('docs')
      // .where('path', '=', path)
      .path(path)
      .first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', `${path}`, {
    fields: ['description']
  })
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

defineOgImageComponent('Docs', {
  headline: headline.value
})

const links = computed(() => {
  const links = []
  if (toc?.bottom?.edit) {
    links.push({
      icon: 'i-lucide-external-link',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${page?.value?.stem}.${page?.value?.extension}`,
      target: '_blank'
    })
  }

  return [...links, ...(toc?.bottom?.links || [])].filter(Boolean)
})

/* ------------------ */

function clickOnContentToc(event) {
  closeBtnRef.value = event.target
}

const closeBtnRef = ref<HTMLElement | null>(null) // 1.click reference
const navMenuRef = ref<HTMLElement | null>(null) // found after 1.click

// Watch for changes in the clicked TOC value:

watch(closeBtnRef, (newValue, oldValue) => {
  if (oldValue === null) {
    navMenuRef.value = newValue.closest('nav[data-state]') as HTMLElement
    if (newValue.tagName !== 'BUTTON')
      closeBtnRef.value = newValue.parentElement
    else
      closeBtnRef.value = newValue // saving close button
  }
})

/* ------------------ */
async function collapsibleToc() {
  let ulParent
  if (navMenuRef.value !== null) {
    ulParent = navMenuRef.value.children[0].children[1].children[0] as HTMLElement
    console.log('')
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  let i = 1
  while (ulParent === undefined) {
    await sleep(500)
    ulParent = document.querySelector('nav > div div:nth-child(2) > ul')
    i++
    if (i > 3) {
      console.log('Error: ulParent is still undefined!')
      break // prevent eternal loop
    }
  }

  // ulParent.setAttribute('class', 'ul_tree')

  // Mark only LIs that actually have a nested UL
  ulParent.querySelectorAll('li').forEach((li) => {
    if (li.querySelector('ul')) {
      li.classList.add('has-children')
    }
  })

  ulParent.addEventListener('click', (e) => {
    const eTarget = e.target as HTMLElement
    const clickedLi = eTarget.closest('li')
    // Only proceed if the clicked item has children
    if (!clickedLi || !clickedLi.classList.contains('has-children')) return

    // Stop the click from bubbling up to parent LIs
    e.stopPropagation()

    const isAlreadyOpen = clickedLi.classList.contains('is-open')

    // ACCORDION: Close all sibling LIs at this specific level
    const siblings = clickedLi.parentElement.children
    for (const sibling of siblings) {
      sibling.classList.remove('is-open')
    }

    // Toggle the clicked one
    if (!isAlreadyOpen) {
      clickedLi.classList.add('is-open')
    }
  })
} // End of async collapsibleToc function

onMounted(() => {
  document.addEventListener('click', function (event) {
    const containsElement = event.composedPath().includes(navMenuRef.value)

    if (!containsElement) // if click is outside Nav Menu then...
      if (openTocMenu.value) // === true
        closeBtnRef.value.click() // closing toc menu
  })
})

const openTocMenu = ref(null)

const handleUpdate = (isOpen: boolean) => {
  openTocMenu.value = !isOpen ? false : true
  if (isOpen) collapsibleToc()
}
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
    >
      <template #links>
        <UButton
          v-for="(link, index) in page.links"
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
</style>
