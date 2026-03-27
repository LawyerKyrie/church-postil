<script setup lang="ts">
// source: https://gemini.google.com/share/c6cba2f388a8
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  id: string
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>()

const { copy, copied } = useClipboard()
const route = useRoute()

// Helper to turn 'h2' into 2
const getLevel = (tag: string) => parseInt(tag.replace('h', ''))

const getBreadcrumbs = () => {
  const currentLevel = getLevel(props.tag)
  if (currentLevel === 2) return '' // h2 has no relevant parents in docs usually

  const crumbs: string[] = []
  // Get all headers in the article
  const allHeaders = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6'))
  const currentIndex = allHeaders.findIndex(el => el.id === props.id)

  let searchLevel = currentLevel - 1

  // Look backwards from the current header
  for (let i = currentIndex - 1; i >= 0; i--) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = allHeaders[i] as any
    const elLevel = getLevel(el.tagName.toLowerCase())

    if (elLevel === searchLevel) {
      crumbs.unshift(el.textContent?.trim() || '')
      searchLevel--
    }
    if (searchLevel < 2) break
  }

  return crumbs.join(' > ')
}

const handleShareClick = (event: MouseEvent) => {
  event.stopPropagation()

  const parentPath = getBreadcrumbs()
  const url = new URL(window.location.origin + route.path)

  // We can pass the breadcrumbs as an extra query param for the OG Image!
  url.searchParams.set('s', props.id)
  if (parentPath) url.searchParams.set('p', parentPath)

  copy(url.toString())
}

const sizes = {
  h1: 'text-4xl', h2: 'text-3xl', h3: 'text-2xl',
  h4: 'text-xl', h5: 'text-lg', h6: 'text-base'
}
</script>

<template>
  <component
    :is="tag"
    :id="id"
    class="group relative flex items-center mb-4 mt-8 font-bold transition-colors"
    :class="sizes[tag]"
  >
    <span
      class="mr-2 cursor-pointer transition-all duration-200 shrink-0"
      :class="copied ? 'text-primary-500 scale-110' : 'text-gray-400 opacity-0 group-hover:opacity-100'"
      @click="handleShareClick"
    >
      <UIcon
        name="i-lucide-share-2"
        class="w-5 h-5"
      />
    </span>

    <NuxtLink
      :to="`#${id}`"
      class="no-underline hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
    >
      <slot />
    </NuxtLink>

    <Transition name="fade">
      <span
        v-if="copied"
        class="ml-3 text-xs font-normal text-primary-500 italic"
      >
        Link copied!
      </span>
    </Transition>
  </component>
</template>
