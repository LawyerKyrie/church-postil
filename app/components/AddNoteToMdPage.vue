<script setup lang="ts">
import { useLocalStorage, useEventListener } from '@vueuse/core'

const props = defineProps<{
  target: HTMLElement | null
}>()

const route = useRoute()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pageNotes = useLocalStorage<any[]>(`notes-${route.path}`, [])

// Listen for double clicks on the target element passed from slug.vue
useEventListener(props.target, 'dblclick', (event: MouseEvent) => {
  if (!props.target) return

  const rect = props.target.getBoundingClientRect()
  const top = event.clientY - rect.top
  const left = event.clientX - rect.left

  pageNotes.value.push({
    id: Date.now(),
    text: '',
    top,
    left,
    isOpen: true
  })
})

const deleteNote = (id: number) => {
  pageNotes.value = pageNotes.value.filter(n => n.id !== id)
}
</script>

<template>
  <div
    v-if="target"
    class="absolute inset-0 pointer-events-none"
  >
    <div
      v-for="note in pageNotes"
      :key="note.id"
      class="absolute pointer-events-auto"
      :style="{ top: `${note.top}px`, left: `${note.left}px` }"
    >
      <UPopover v-model:open="note.isOpen">
        <UButton
          icon="i-heroicons-chat-bubble-left-ellipsis"
          size="sm"
          class="rounded-full shadow-lg translate-x-[-50%] translate-y-[-50%]"
        />

        <template #content>
          <div class="p-4 w-64 flex flex-col gap-2">
            <UTextarea
              v-model="note.text"
              placeholder="Your note..."
              autoresize
              autofocus
            />
            <UButton
              icon="i-heroicons-trash"
              color="warning"
              variant="ghost"
              label="Delete"
              block
              @click="deleteNote(note.id)"
            />
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>
