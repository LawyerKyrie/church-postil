<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

/* // This is only workng with @nuxtjs/i18n package
const app = useNuxtApp() as any
console.log(app.$i18n.availableLocales)
app.$i18n.setLocale('da')
console.log('The locale value is set to ' + app.$i18n.locale.value)
*/

// const { data: page } = await useAsyncData('index', () => queryCollection('landing').path(`/`).first())

const { data: page } = await useAsyncData(
  `/${locale.value}/index`, () => queryCollection('docs')
    // .where('path', '=', `/${locale.value}/`)
    .path(`/${locale.value}/`)
    .first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: false })
}

// if (!/^(\/en|\/da)/.test(path))
//  console.log('If path do not start with en/da (probably only when root index is loaded) this message is printed in console.')

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
