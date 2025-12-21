<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const { data: page } = await useAsyncData(
  `/${locale.value}/index`, () => queryCollection('docs')
    // .where('path', '=', `/${locale.value}/`)
    .path(`/${locale.value}/`)
    .first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: false })
}

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

// Select language from the buttons in the landing page
// See lang code in index.vue in /en and /da folder
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :prose="false"
  />
</template>
