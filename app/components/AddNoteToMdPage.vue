<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
const props = defineProps<{
  target: HTMLElement | null
  title: string
}>()

const route = useRoute()

const isSelecting = ref(false)
let mobileSelectionTimeout: ReturnType<typeof setTimeout> | null = null

// 1. Change to a SINGLE global storage key so all pages share one list
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
let lastActionTime = 0 // The Shield

const handleTextInteraction = (event: Event) => {
  const currentTime = Date.now()
  if (currentTime - lastActionTime < 300) return

  const target = event.target as HTMLElement
  if (target.closest('.pointer-events-auto') || target.closest('button')) return

  const tapLength = currentTime - lastTap
  const isDoubleAction = (event as UIEvent).detail === 2 || (tapLength < 300 && tapLength > 0)
  lastTap = currentTime

  const selection = window.getSelection()
  const text = selection?.toString().trim() || ''

  // --- PATH A: DOUBLE-CLICK / DOUBLE-TAP (ALWAYS A BUBBLE) ---

  if (isDoubleAction) {
    // 1. STOP the browser from selecting the word under the cursor
    event.preventDefault()
    selection?.removeAllRanges()

    const pos = (window.TouchEvent && event instanceof TouchEvent)
      ? event.changedTouches[0]
      : (event as MouseEvent)

    console.log('Double-action detected: Forcing a Bubble, ignoring text.')
    createNoteOnDblClick(pos)

    lastActionTime = Date.now()
    lastTap = 0
    return // EXIT: If it's a double-click, we NEVER want a highlight
  }

  // --- PATH B: HIGHLIGHTING (ONLY VIA DRAG/HOLD) ---

  // Since we 'returned' above on double-click, this only runs on
  // single 'mouseup' or 'touchend' where text was selected via drag/hold.
  // Inside Path B: HIGHLIGHTING
  if (text.length > 0 && props.target) {
    const range = selection?.getRangeAt(0)
    const rect = range?.getBoundingClientRect()

    if (rect && rect.width > 5) {
      const isMobile = 'ontouchstart' in window

      if (isMobile) {
        // 1. Show the indicator
        isSelecting.value = true

        // 2. Clear any existing timer (user is still moving handles)
        if (mobileSelectionTimeout) clearTimeout(mobileSelectionTimeout)

        // 3. Start the "Patience" timer
        mobileSelectionTimeout = setTimeout(() => {
          const finalSelection = window.getSelection()
          const finalText = finalSelection?.toString().trim() || ''

          if (finalText.length > 0) {
            const finalRange = finalSelection?.getRangeAt(0)
            const finalRect = finalRange?.getBoundingClientRect()

            if (finalRect) {
              saveHighlightedText(finalRect, finalText)
              finalSelection?.removeAllRanges()
              lastActionTime = Date.now()
            }
          }

          // 4. Hide the indicator
          isSelecting.value = false
        }, 1000) // 1 second of "no movement" before saving
      } else {
        // PC: Instant save
        saveHighlightedText(rect, text)
        selection?.removeAllRanges()
      }
    }
  }
}

const createNoteOnDblClick = (pos) => {
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
    text: '',
    top: top,
    left: left,
    isOpen: true, // Must be true so you can see it!
    isHighlight: false // This is a bubble, not a highlight
  }

  allNotes.value.push(newNote)
}

const deleteNote = (id: number) => {
  // Filters the global list directly
  allNotes.value = allNotes.value.filter(n => n.id !== id)
}

const saveHighlightedText = (rect, text) => {
  const targetRect = props?.target?.getBoundingClientRect() as any
  const newNote = {
    id: Date.now(),
    path: route.path,
    title: props.title,
    text: `"${text}"`,
    top: (rect.top - targetRect.top), // Align to top of text
    left: (rect.left - targetRect.left), // Align to start of text
    width: rect.width, // NEW: Store width
    height: rect.height, // NEW: Store height
    isOpen: true, // Keep it closed by default for highlights
    isHighlight: true
  }

  // 3. Push to the global list (since pageNotes is a computed setter)
  allNotes.value.push(newNote)
}

/* DRAGGING THE NOTE BOBBLES (ON PC) */

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
      v-if="isSelecting"
      class="selection-indicator"
    >
      Saving highlight...
    </div>
    <div
      v-for="note in pageNotes"
      :key="note.id"
      class="absolute pointer-events-none"
      :style="{
        top: `${note.top}px`,
        left: `${note.left}px`,
        width: note.isHighlight ? note.width + 'px' : 'auto',
        zIndex: note.isOpen ? 50 : 10
      }"
    >
      <div v-if="note.isOpen || !note.isHighlight">
        {{ note.text }}
      </div>
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
/*
1. pointer-events: none on the container: Think of the .bubbles-container like a piece of glass over your scripture. If you don't use none, that glass blocks your finger from touching the text below. You wouldn't be able to select anything! By setting it to none, your finger "passes through" the layer of notes and touches the words perfectly.
2. pointer-events: auto on the individual bubble: This "punches a hole" back through the glass. It tells the browser: "The container is invisible to touch, BUT if the user hits the bubble itself, let them click it so they can type their note."
3. The z-index: 999: This ensures that when a bubble pops up, it doesn't get hidden behind the text or other background elements. It stays on top where it belongs.
*/
.scripture-wrapper {
  position: relative; /* This is the anchor! */
}

.bubbles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Now this covers the WHOLE long document */
  pointer-events: none; /* Let clicks pass through to the text */
  z-index: 999; /* Make sure it's on top of EVERYTHING */
}

.individual-bubble {
  pointer-events: auto; /* Make the bubble itself clickable */
}

.scripture-content {
  /* Prevents the 'Copy/Paste' menu on iOS/Android */
  /* -webkit-touch-callout: none; *//* This might hide the magnifying glass on some iPhones */
  /* Ensures text is still selectable for your code to read */
  -webkit-user-select: text;
  user-select: text;
}

/* Source: https://gemini.google.com/share/4bed45ef3569 */

.selection-indicator {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: gold;
  color: black;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}
/* Source: https://gemini.google.com/share/88d3437fd7a4 */
</style>
