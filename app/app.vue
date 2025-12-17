<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

console.log('RUNNING WHEN APP IS RUNNING')

const { seo } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

const { locale } = useI18n()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image',
  googleSiteVerification: 'OBR08WFLQQiJUKuLzi19h9dr7I99cVDn5UzDi9mAjwA'
})

provide('navigation', navigation)

const myLocale = computed(() => locales[locale.value as keyof typeof locales])
console.log('\nmyLocale.value... dir, name and code in <UApp = \n')
console.log(myLocale.value.dir, myLocale.value.name, myLocale.value.code)
</script>

<template>
  <UApp>
    <!-- <UApp :locale="myLocale"> -->
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
