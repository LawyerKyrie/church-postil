<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
// const { path } = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

// const { data: page } = await useAsyncData(path, () => queryCollection('docs').path(path).first())

const { data: page } = await useAsyncData(
  `${route.path}`,
  () =>
    queryCollection('docs')
      // .where('path', '=', path)
      .path(route.path)
      .first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', `${route.path}`, {
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

// Maybe it's better to watch the route.path than clickedToc
// const route = useRoute()
// Watch for route changes and close the menu

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    console.log('Url path changed from', oldPath, ' to ', newPath)
    // Close the Content Toc
    // The Close Button Element have to be registered first
    // tocNavRef.value.click()
  }
)

const tocNavRef = ref<HTMLDivElement | null>(null) // first click
const clickedToc = ref<HTMLDivElement | null>(null) // second click

function clickOnContentToc(event) {
  clickedToc.value = event.target
}

// Watch for changes in the clicked TOC value:
watch(clickedToc, (newValue, oldValue) => {
  /*
  console.log(`clickedToc changed from ${oldValue} to ${newValue}. \noldValue =`)
  console.log(oldValue)
  console.log('newValue =')
  console.log(newValue)
  */
  if (oldValue === null) { // then save the tocNavRef button element
    // console.log('Content Toc Menu was opened just now!')
    const navToc = clickedToc.value.closest('nav[data-state="open"]')
    if (navToc.hasAttribute('data-state')
      && navToc.getAttribute('data-state') === 'open') {
      tocNavRef.value = clickedToc.value
      // console.log('navToc click-element is saved \n(to simulate click when link is selected).')
      // It's only need to save it once (on the first opening)
    }
  } else {
    // console.log('Click on menu item in content TOC')
    if (clickedToc.value !== null) {
      const dataSlot = clickedToc.value.getAttribute('data-slot')
      if (dataSlot === 'linkText'
        || dataSlot === 'link') {
        // console.log('It is confirmed/ verified. link or linkText was clicked! Closing the Toc Menu and resetting all the values.')
        tocNavRef.value.click()
      }
    }
  }
})
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
      </ClientOnly>

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <!-- <template v-if="page?.body?.toc?.links?.length" #right> -->
    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :title="toc?.title"
        :links="page.body?.toc?.links"
        @click="clickOnContentToc"
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
