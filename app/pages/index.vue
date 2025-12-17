<script setup lang="ts">
const { locale } = useI18n()
const { path } = useRoute()

console.log('\nTHIS IS THE PAGES/INDEX LOADING\n'
  + '\nGetting the translations from md-files in locale folders /en and /da'
)

// const { data: page } = await useAsyncData('index', () => queryCollection('landing').path(`/`).first())

const { data: page } = await useAsyncData(
  `/${locale.value}/index`, () => queryCollection('docs')
    // .where('path', '=', `/${locale.value}/`)
    .path(`/${locale.value}/`)
    .first()
)

if (!page.value) {
  console.log('ERROR page.value: ' + page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: false })
} else console.log('Index loading from pages/')

if (!/^(\/en|\/da)/.test(path))
  console.log('IGNORE FOLLOWING WARN [Vue Router warn] No match found for location with path (...)')

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png'
})
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :prose="false"
  />
</template>
