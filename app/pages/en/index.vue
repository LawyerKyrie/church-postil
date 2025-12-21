<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const { data: page } = await useAsyncData(
  `/${locale.value}/index`, () => queryCollection('docs')
    .path(`/en/`)
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

onMounted(() => {
  console.log('onMounted is started in english index.vue')
  // Get query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search)
  const action = urlParams.get('action') // Gets the value of the 'action' parameter

  // Run a function based on the value
  if (action === 'showAlert') {
    locale.value = 'en'
    myJavaScriptFunction('Data from URL query parameter in EN')
  }
})

const myJavaScriptFunction = (message) => {
  alert(message)
}
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :prose="false"
  />
</template>
