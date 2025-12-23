<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

console.log('checking when this is started')

const { data: page } = await useAsyncData(
  `/da/index`, () => queryCollection('docs')
    .path(`/da/`)
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

onMounted(() => {
  console.log('onMounted is started in danish index.vue')
  // Get query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search)
  const action = urlParams.get('action') // Gets the value of the 'action' parameter

  // Run a function based on the value
  if (action === 'urlAction') {
    locale.value = 'da'
    showToast(`Danske prædikener valgt`, `Åpne meny eller velg postille nedenfor`)
    // alert('Data from URL query parameter in DA')
  }
})
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :prose="false"
  />
</template>
