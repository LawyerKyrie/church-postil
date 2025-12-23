<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
const uiLocale = computed(() => locales[locale.value as keyof typeof locales])

const { data: page } = await useAsyncData(
  `/en/index`, () => queryCollection('docs')
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
  if (action === 'urlAction') {
    locale.value = 'en'
    showToast(`${uiLocale.value.name} is selected`, `Open menu or select postil below!`)
    // alert('Data from URL query parameter in EN')
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
