import { withLeadingSlash } from 'ufo'
import { stringify } from 'minimark/stringify'
import { queryCollection } from '@nuxt/content/nitro'
import type { Collections } from '@nuxt/content'

export default eventHandler(async (event) => {
  const slug = getRouterParams(event)['slug.md']
  if (!slug?.endsWith('.md')) {
    // console.log('No ends width MD')
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: false })
  }

  const { locale } = useI18n() // Get current locale
  const path = withLeadingSlash(slug.replace('.md', ''))

  /*
  console.log('locale and path is: ')
  console.log(locale.value)
  console.log(path)
  */

  const page = await queryCollection(event, 'docs' as keyof Collections).path(`/${locale}/${path}`).first()
  if (!page) {
    // console.log('Not page (!page')
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: false })
  }

  // Add title and description to the top of the page if missing
  if (page.body.value[0]?.[0] !== 'h1') {
    page.body.value.unshift(['blockquote', {}, page.description])
    page.body.value.unshift(['h1', {}, page.title])
  }

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  return stringify({ ...page.body, type: 'minimark' }, { format: 'markdown/html' })
})
