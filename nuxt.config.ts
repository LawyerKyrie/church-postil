// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    }
  },
  routeRules: {
    '/': { prerender: true },
    // '/da/intro/': { redirect: '/da/intro', prerender: false }
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },

  typescript: {
    shim: false,
    strict: false,
    typeCheck: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify'
  },

  llms: {
    domain: 'https://church-postil.vercel.app/',
    title: 'Church Postil',
    description: 'Luther\'s Church Postil - One year lectionary sermons',
    full: {
      title: 'Luther\'s Church Postil',
      description: 'Luther\'s Church postil in English and Danish Language.'
    },
    sections: [
      {
        title: 'English Postil',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/en%' }
        ]
      },
      {
        title: 'Danish Postil',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/da%' }
        ]
      }
    ]
  },

  mcp: {
    name: 'Church Postil'
  }
})
