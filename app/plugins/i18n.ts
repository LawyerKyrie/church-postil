// plugins/i18n.ts
import { createI18n } from 'vue-i18n'
import * as locales from '@nuxt/ui/locale'

// console.log('This code runs before app.vue (and before other plugins) is loading!')

export default defineNuxtPlugin(({ vueApp }) => {
  // Define your messages/translations here or load them dynamically
  const messages = {
    en: { welcome: 'Welcome!' },
    da: { welcome: 'Velkommen !' }
  }

  const myLocale = 'en' // Set fallback/default locale

  const i18n = createI18n({
    legacy: false, // Use Composition API
    globalInjection: true,
    locale: myLocale, // Set a default locale
    messages
  })

  vueApp.use(i18n)

  // Make the available Nuxt UI locales globally accessible if needed
  return {
    provide: {
      localesList: locales, // Not much need for this list
      lang: myLocale
    }
  }
})
