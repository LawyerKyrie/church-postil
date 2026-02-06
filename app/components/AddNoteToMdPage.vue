<script setup lang="ts">
const props = defineProps<{
  target: HTMLElement | null
  title: string
}>()

const route = useRoute()

// 1. Change to a SINGLE global storage key so all pages share one list
// const allNotes = useLocalStorage<any[]>('global-church-notes', [])
// Inside <script setup> of AddNoteToMdPage.vue
const { allNotes } = useNotes()

// Remove the old const allNotes = useLocalStorage(...)

// 2. Create a computed property for notes belonging ONLY to this specific page
// This keeps your current UI working exactly as it was.
const pageNotes = computed({
  get: () => allNotes.value.filter(n => n.path === route.path),
  set: (newVal) => {
    // When a note is deleted or updated, we update the master list
    const otherNotes = allNotes.value.filter(n => n.path !== route.path)
    allNotes.value = [...otherNotes, ...newVal]
  }
})

// Listen for double clicks
useEventListener(props.target, 'dblclick', (event: MouseEvent) => {
  const selection = window.getSelection()
  // Only return if the user has manually dragged across multiple lines/words.
  // 'Range' usually implies a deliberate highlight, while 'Caret' or a
  // single word selection from a dblclick shouldn't block the note.
  if (selection && selection.type === 'Range' && selection.toString().includes(' ')) {
    // Optional: only block if they selected more than one word (contains a space)
    return
  }
  if (!props.target) return

  const rect = props.target.getBoundingClientRect()
  const top = event.clientY - rect.top
  const left = event.clientX - rect.left

  // 3. We push to the GLOBAL list, but include the metadata (path and title)
  allNotes.value.push({
    id: Date.now(),
    path: route.path, // Crucial for the overview page
    title: props.title, // pageTitle: document.title, // Useful for the select menu label
    text: '',
    top,
    left,
    isOpen: true
  })
})

const deleteNote = (id: number) => {
  // Filters the global list directly
  allNotes.value = allNotes.value.filter(n => n.id !== id)
}

/*
Add another alternative when user marks the text
and making a note of this
instead of copy/paste it into the bobble.
*/

const handleMouseUp = (event: MouseEvent) => {
  // 1. Guard against clicking existing notes
  if ((event.target as HTMLElement).closest('.pointer-events-auto')) return

  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || event.detail > 1) return

  const text = selection.toString().trim() || ''

  // New Guard: If selection is basically the whole page, ignore it.
  const bodyLength = document.body.innerText.length
  if (text.length > (bodyLength * 0.8)) return

  // 2. THE FIX: Set a character limit (e.g., 500 chars)
  // and ensure it's not the whole document
  if (text.length > 0 && text.length < 500 && props.target) {
    const range = selection.getRangeAt(0)
    const selectionRect = range.getBoundingClientRect()

    // 3. Distance Guard: Ensure the user actually dragged the mouse
    // If width is 0, it was just a stray click
    if (selectionRect.width < 2) return

    const targetRect = props.target.getBoundingClientRect()

    const newNote = {
      id: Date.now(),
      title: props.title,
      text: `"${text}"`,
      top: (selectionRect.top - targetRect.top),
      left: (selectionRect.left - targetRect.left),
      width: selectionRect.width,
      height: selectionRect.height,
      isOpen: true,
      path: route.path,
      isHighlight: true
    }

    allNotes.value.push(newNote)
    selection.removeAllRanges() // Deselect after creating
  }
}

// Lifecycle hooks to add/remove the listener
onMounted(() => {
  // It's better to listen on a specific 'content' container if possible
  // e.g., document.querySelector('.prose').addEventListener(...)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handleMouseUp)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const startDragging = (e: MouseEvent, note: any) => {
  // 1. Don't drag if the popover is open (user might be trying to select text in the textarea)
  if (note.isOpen) return

  // 2. Prevent the click from triggering a new note or text selection
  e.preventDefault()
  e.stopPropagation()

  const startX = e.clientX
  const startY = e.clientY
  const initialTop = note.top
  const initialLeft = note.left

  const onMouseMove = (moveEvent: MouseEvent) => {
    // 3. Calculate new position
    const deltaX = moveEvent.clientX - startX
    const deltaY = moveEvent.clientY - startY

    note.top = initialTop + deltaY
    note.left = initialLeft + deltaX
  }

  const onMouseUp = () => {
    // 4. Clean up listeners when the mouse is released
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
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
      class="absolute pointer-events-none"
      :style="{ top: `${note.top}px`, left: `${note.left}px`, zIndex: note.isOpen ? 50 : 10 }"
    >
      <UPopover v-model:open="note.isOpen">
        <div class="pointer-events-auto cursor-pointer relative">
          <div
            v-if="note.isHighlight"
            class="absolute bg-secondary-400/30 border-b-2 border-secondary-500 hover:bg-secondary-400/50 transition-colors"
            :style="{ width: `${note.width}px`, height: `${note.height}px`, zIndex: 0 }"
          />

          <UButton
            v-if="!note.isHighlight"
            icon="i-heroicons-chat-bubble-left-ellipsis"
            color="warning"
            size="xs"
            class="rounded-full shadow-sm translate-x-[-50%] translate-y-[-100%] cursor-move"
            @mousedown="startDragging($event, note)"
          />

          <UButton
            v-else
            icon="i-heroicons-pencil"
            color="secondary"
            variant="ghost"
            size="xs"
            class="rounded-full translate-x-[-50%] translate-y-[-100%] opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <template #content>
          <div
            class="p-4 w-64 flex flex-col gap-2"
            @mousedown.stop
            @mouseup.stop
          >
            <UTextarea
              v-model="note.text"
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
