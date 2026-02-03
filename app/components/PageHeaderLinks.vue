<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const toast = useToast()
const { copy, copied } = useClipboard()
const site = useSiteConfig()

const mdPath = computed(() => `${site.url}/raw${route.path}.md`)

const items = [
  {
    label: 'View as Markdown',
    icon: 'i-simple-icons:markdown',
    target: '_blank',
    to: `/raw${route.path}.md`
  },
  {
    label: 'Copy Page Content',
    icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy',
    onSelect() {
      copyPage()
      toast.add({
        icon: 'i-lucide-check-circle',
        title: 'Page Content Copied',
        description: 'Copy/paste it where you want!'
      })
    }
  },
  {
    label: 'Download MD-file',
    icon: 'i-lucide-hard-drive-download',
    onSelect() {
      toast.add({
        icon: 'i-lucide-hard-drive-download',
        title: 'Downloading file to',
        description: '../downloads/church-postil-md-file-download'
      })
      downloadFile(`/raw${route.path}.md?download`)
    }
  },
  {
    label: 'Copy MD link',
    icon: 'i-lucide-link',
    onSelect() {
      copy(mdPath.value)
      toast.add({
        icon: 'i-lucide-check-circle',
        title: 'Page Copied to clipboard'
      })
    }
  },
  {
    label: 'Dbl.Click Add Notes',
    title: 'Add Notes with double click and read it when you open the document next time (on the same device).',
    icon: 'i-lucide-notebook-pen',
    onSelect() {
      toast.add({
        icon: 'i-lucide-notebook-pen',
        title: 'Double Click add Notes!',
        description: 'Add Notes with double click, and read it later on the same device.'
      })
    }
  } /* ,
  {
    label: 'Create Accordions',
    title: 'Create Accordion Style - Collapse all Headers',
    icon: 'i-lucide-list-collapse',
    onSelect() {
      toast.add({
        icon: 'i-lucide-list-collapse',
        title: 'Under construction!',
        description: 'This programming isn\'t finished yet!'

      })
    }
  }
  */
]

async function copyPage() {
  copy(await $fetch<string>(`/raw${route.path}.md`))
}

const downloadFile = (url) => {
  if (!url) return
  // Create a temorary element
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'church-postil-md-file-download')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <UFieldGroup>
    <UButton
      label="Markdown Page etc…"
      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
      color="neutral"
      variant="outline"
      :ui="{
        leadingIcon: [copied ? 'text-primary' : 'text-neutral', 'size-3.5']
      }"
      @click="copyPage"
    />
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-48'
      }"
    >
      <UButton
        icon="i-lucide-chevron-down"
        size="sm"
        color="neutral"
        variant="outline"
        aria-label="Open copy actions menu"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
