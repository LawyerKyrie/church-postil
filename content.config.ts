import { defineContentConfig, defineCollection, z } from '@nuxt/content'

// const globPattern = /^\/api/

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**'
      },
      schema: z.object({
        bibletext: z.string().transform(val => val.replace(/\n/g, '<br>')).optional(),
        links: z.array(z.object({
          label: z.string(),
          icon: z.string(),
          to: z.string(),
          target: z.string().optional()
        })).optional()
      })
    })
  }
})
