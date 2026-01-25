// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit',
    '@vueuse/nuxt'
  ],
  // ssr maybe fixing open page in new tab/ windows
  ssr: true,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          depth: 5,
          searchDepth: 1
        }
      }
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      apiBase: process.env.NUXT_PUBLIC_API_BASE
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    }
  },
  routeRules: {
    '/': { prerender: true /* , redirect: '/new-path' */ }
  },
  sourcemap: {
    server: false,
    client: false
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    preset: 'vercel',
    timing: true,
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false,
      concurrency: 1,
      interval: 100
      // failOnError: false
    }
  },

  typescript: {
    shim: false,
    strict: false,
    typeCheck: true
  },
  hooks: {
    ready() {
      const apiBase = process.env.NUXT_PUBLIC_API_BASE
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

      console.log('--- SERVER STARTUP AUDIT ---')
      console.log('Final API Base URL:', apiBase)
      console.log('Source: ', process.env.NUXT_PUBLIC_API_BASE ? 'Dashboard' : (process.env.VERCEL_URL ? 'Vercel System' : 'Local Fallback'))
      console.log('---------------------------')
    }
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
