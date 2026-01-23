<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
// const { path } = useRoute()

const { data: page } = await useAsyncData(
  `/${locale.value}/index`,
  () => queryCollection('docs')
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
  // Get query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search)
  const action = urlParams.get('action') // Gets the value of the 'action' parameter

  // Run a function based on the value
  if (action === 'selectDanish') {
    if (locale.value !== 'da') {
      locale.value = 'da'
      navigateTo(`/`)
      showToast(`Danske prædikener valgt`, `Åpne meny eller velg postille nedenfor!`)
      // alert('Data fra URL query parameter i DA')
    }
  } else if (action === 'selectEnglish') {
    if (locale.value !== 'en') {
      locale.value = 'en'
      navigateTo(`/`)
      showToast(`English Sermons Selected`, `Open Menu or Select Sermons below!`)
    }
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
