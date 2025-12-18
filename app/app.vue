<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
const uiLocale = computed(() => locales[locale.value as keyof typeof locales])

// console.log('Locale is already set in plugin/i18n.ts')

const { seo } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image',
  googleSiteVerification: 'OBR08WFLQQiJUKuLzi19h9dr7I99cVDn5UzDi9mAjwA'
})

provide('navigation', navigation)

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: uiLocale.value.code,
    dir: uiLocale.value.dir
  }
})
</script>

<template>
  <UApp :locale="$localesList[locale]">
    <!-- <UApp :locale="uiLocale" :locale="$localesList[locale]" > -->
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <BackToTop />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
