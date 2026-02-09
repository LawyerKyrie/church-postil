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

const savePositionAndNote = (pos /* : { clientX: number, clientY: number } */, text: string) => {
  console.log('If text in savePostionAndNote? ', text)
  const selection = window.getSelection()

  console.log('Is there a selection? ', selection)
  // Only return if the user has manually dragged across multiple lines/words.
  // 'Range' usually implies a deliberate highlight, while 'Caret' or a
  // single word selection from a dblclick shouldn't block the note.
  if (selection && selection.type === 'Range' && selection.toString().includes(' ')) {
    // Optional: only block if they selected more than one word (contains a space)
    return
  }
  if (!props.target) return

  const targetRect = props.target.getBoundingClientRect()
  // Calculate position relative to the container, NOT the screen
  const top = pos.clientY - targetRect.top
  const left = pos.clientX - targetRect.left

  // 3. We push to the GLOBAL list, but include the metadata (path and title)
  const newNote = {
    id: Date.now(),
    path: route.path, // Crucial for the overview page
    title: props.title, // pageTitle: document.title, // Useful for the select menu label
    text: text,
    top: top,
    left: left,
    isOpen: true,
    isHighlight: false // This is a bubble, not a highlight
  }

  allNotes.value.push(newNote)
}

const deleteNote = (id: number) => {
  // Filters the global list directly
  allNotes.value = allNotes.value.filter(n => n.id !== id)
}

onMounted(() => {
  // We use the same 'Brain' for both Mouse and Touch
  document.addEventListener('mouseup', handleTextInteraction)
  document.addEventListener('touchend', handleTextInteraction, { passive: false })
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handleTextInteraction)
  document.removeEventListener('touchend', handleTextInteraction)
})

let lastTap = 0
const lastEventType = '' // To track if we just handled a touch

const handleTextInteraction = async (event: Event) => {
  const currentTime = Date.now()
  const tapLength = currentTime - lastTap
  const isDoubleTap = lastTap > 0 && tapLength < 300 && tapLength > 40
  lastTap = currentTime

  // 1. Basic Guards
  const target = event.target as HTMLElement
  if (target.closest('.u-command-palette') || target.closest('[role="dialog"]')) return

  if (isDoubleTap || (event as UIEvent).detail === 2) {
    // 2. THE WAIT: Give the browser 100ms to finish selecting the word/dot
    await new Promise(resolve => setTimeout(resolve, 100))

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      console.log('No selection range found - possibly still animating on mobile')
      return
    }
    let text = selection?.toString().trim() || ''

    // 3. THE DOT/PUNCTUATION RULE:
    // If the selected text is just a single character (like a . , ! ?)
    // we clear it so the code treats it as an "Empty Space" bubble.
    if (text.length === 1 && /[\.\,\!\?\;\:]/.test(text)) {
      text = ''
    }

    if (text.length === 0) {
      console.log('Treating as empty space -> Creating Bubble')
      const pos = event instanceof MouseEvent ? event : (event as TouchEvent).changedTouches[0]
      savePositionAndNote(pos, '')
      if (selection) selection.removeAllRanges()
      lastTap = 0
      return
    } else {
      console.log('Word detected -> Falling through to Highlight mode')
      // Don't return! Let it fall through to the Highlight logic below.
    }
  }

  // ---------------------------------------------------------
  // MODE B: HIGHLIGHTING
  // ---------------------------------------------------------
  const selection = window.getSelection()
  const text = selection?.toString().trim() || ''

  if (text.length > 0 && text.length < 500 && props.target) {
    const range = selection?.getRangeAt(0)
    const rect = range?.getBoundingClientRect()

    if (rect && rect.width > 2) {
      const targetRect = props.target.getBoundingClientRect()

      const newNote = {
        id: Date.now(),
        title: props.title || 'Note',
        text: `"${text}"`,
        top: (rect.top - targetRect.top),
        left: (rect.left - targetRect.left),
        width: rect.width,
        height: rect.height,
        isOpen: true,
        path: route.path,
        isHighlight: true
      }
      allNotes.value.push(newNote)
      if (selection) selection.removeAllRanges()
    }
  }
}

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
            @touchdown="startDragging($event, note)"
            @click="console.log('Note possibly created, registering click!')"
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

<style scoped>
.bubbles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let clicks pass through to the text */
  z-index: 999; /* Make sure it's on top of EVERYTHING */
}

.individual-bubble {
  pointer-events: auto; /* Make the bubble itself clickable */
}

.scripture-content {
  -webkit-user-select: text; /* Crucial for iOS */
  user-select: text;
  touch-action: manipulation; /* Allows taps/swipes but not double-tap-to-zoom */
}
</style>
