<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// source: https://gemini.google.com/share/024e9af34e8b
const props = defineProps<{
  target: HTMLElement | null
  title: string
}>()

const route = useRoute()

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
  window.oncontextmenu = function (event) {
    if (event.target.closest('.your-scripture-class')) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }
  // We use the same 'Brain' for both Mouse and Touch
  document.addEventListener('mouseup', handleTextInteraction)
  document.addEventListener('touchend', handleTextInteraction, { passive: false })
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handleTextInteraction)
  document.removeEventListener('touchend', handleTextInteraction)
})

// --- Setup/State ---
const { checkDoubleTap, reset } = useDoubleTap() // Initialize once
const isSelecting = ref(false)
let mobileSelectionTimeout: ReturnType<typeof setTimeout> | null = null
let lastInteractionType = ''
// let lastActionTime = 0
// const timeStamp = useTimeStamp()
const lastActionTime = useLastActionTime() as any// For the "Double-fire" shield

const handleTextInteraction = (event: Event) => {
  console.log(`[Interaction] Type: ${event.type}, Target:`, event.target)
  /* -- GUARDING RULES -- */
  const target = event.target as HTMLElement
  // If we are touching the bubble or the popover content...
  // Update this to match your harmonized template
  if (target.closest('.note-item') || target.closest('.p-4')) {
    console.log('Shielding note from background logic')
    event.stopPropagation()
    return
  }

  // 2. GHOST TYPE SHIELD (Mouse following Touch)
  if (event.type === 'mouseup' && lastInteractionType === 'touchend') {
    return
  }
  lastInteractionType = event.type

  const now = Date.now()

  // GLOBAL GUARD: If we just did something (like saving a highlight),
  // ignore everything else for 300ms.
  if (now - lastActionTime.value < 300) {
    console.log('Guard active: ignoring ghost event, timeStamp = ', event.timeStamp)
    return
  }

  // 1. GHOST SHIELD: Ignore the "Ghost" MouseEvent after a TouchEvent
  if (event.type === 'mouseup' && lastInteractionType === 'touchend') {
    lastInteractionType = ''
    return
  }
  lastInteractionType = event.type
  /*   --------------------------     */

  const selection = window.getSelection()
  const text = selection?.toString().trim() || ''

  // --- PATH A: DOUBLE-CLICK / DOUBLE-TAP ---
  // We use our new "Solid" composable logic here
  if (checkDoubleTap(event as UIEvent)) {
    if (text.length === 0) {
      // LOCK THE DOOR IMMEDIATELY
      lastActionTime.value = Date.now()

      // LOG IT so we can see if it still tries to run twice
      console.log('Creating bubble, locking action time at:', lastActionTime.value)

      const pos = (event instanceof TouchEvent) ? event.changedTouches[0] : (event as MouseEvent)
      createNoteOnDblClick(pos)

      // CLEAR SELECTION so the PC doesn't get confused
      window.getSelection()?.removeAllRanges()

      return // EXIT IMMEDIATELY
    } else {
      console.log('Double tap detected, but text was found:', text)
      // It selected a word on dblclick? Ignore it as requested.
      selection?.removeAllRanges()
      return
    }
  }

  // --- PATH B: HIGHLIGHTING (SINGLE DRAG/HOLD) ---
  // This runs if Path A didn't "return" (i.e., it wasn't a double-tap)
  if (text.length > 0 && props.target) {
    if (!selection) return

    const range = selection?.getRangeAt(0)
    const rect = range?.getBoundingClientRect()
    // Inside your highlight creation logic
    if (selection) {
      // selection.removeAllRanges() // This "kills" the blue handles
    }

    if (rect && rect.width > 5) {
      const isMobile = 'ontouchstart' in window

      if (isMobile) {
        // 1. Don't auto-save immediately.
        // 2. Just let the browser show the handles ("flips").
        isSelecting.value = true

        // Clear the old timeout
        if (mobileSelectionTimeout) clearTimeout(mobileSelectionTimeout)

        // Wait for the user to PAUSE for 2 seconds before saving
        mobileSelectionTimeout = setTimeout(() => {
          const finalSelection = window.getSelection()
          const finalText = finalSelection?.toString().trim() || ''

          if (finalText.length > 0) {
            const finalRange = finalSelection?.getRangeAt(0)
            const finalRect = finalRange?.getBoundingClientRect()
            if (finalRect) {
              saveHighlightedText(finalRect, finalText)
              // Only remove ranges AFTER the user has stopped moving the flips
              finalSelection?.removeAllRanges()
              lastActionTime.value = Date.now()
              reset()
            }
          }
          isSelecting.value = false
        }, 4000) // Give them 2.5 seconds to adjust the handles
      } else {
        // PC: Standard Drag-and-Release highlighting
        // console.log('Log from creating highlight on pc')
        saveHighlightedText(rect, text)
        selection?.removeAllRanges()
        lastActionTime.value = now // <--- THIS LOCKS THE BUBBLE PATH
        reset()
      }
    }
  }
}

const createNoteOnDblClick = (pos) => {
  if (!props.target) return

  // LOCK OUT all background logic immediately
  lastActionTime.value = Date.now()

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
    isOpen: false, // 1. START CLOSED
    isHighlight: false // This is a bubble, not a highlight
  }

  allNotes.value.push(newNote)
  // 2. OPEN LATER (After the ghost events pass)
  setTimeout(() => {
    const note = allNotes.value.find(n => n.id === newNote.id)
    if (note) note.isOpen = true
  }, 50)
  console.log(`[Creation] New Note ID: ${newNote.id} at ${top}, ${left}`)
}

const deleteNote = (id: number) => {
  // Filters the global list directly
  console.log('deleteNote log')
  allNotes.value = allNotes.value.filter(n => n.id !== id)
}

const saveHighlightedText = (rect, text) => {
  // LOCK OUT all background logic immediately
  lastActionTime.value = Date.now()

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
    isOpen: false, // Keep it closed by default for highlights
    isHighlight: true
  }

  // 3. Push to the global list (since pageNotes is a computed setter)
  allNotes.value.push(newNote)
  /*
  console.log('--- HIGHLIGHT DATA CHECK ---')
  console.log('ID:', newNote.id)
  console.log('isHighlight:', newNote.isHighlight) // Should be true
  console.log('Initial Position:', { top: newNote.top, left: newNote.left })
  */
}

/* DRAGGING THE NOTE BOBBLES (ON PC) */

const startDragging = (ev: PointerEvent, note: any) => {
  const target = ev.currentTarget as HTMLElement
  const startTime = Date.now()
  const startX = ev.clientX
  const startY = ev.clientY
  const initialTop = note.top
  const initialLeft = note.left
  let hasMoved = false

  // LOCK THE POINTER: This stops the scrolling on mobile!
  target.setPointerCapture(ev.pointerId)

  const onMove = (moveEv: PointerEvent) => {
    const deltaX = moveEv.clientX - startX
    const deltaY = moveEv.clientY - startY

    // Only move if we pass a 5px 'deadzone'
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasMoved = true
      note.top = initialTop + deltaY
      note.left = initialLeft + deltaX
    }
  }

  const onEnd = (endEv: PointerEvent) => {
    const duration = Date.now() - startTime
    target.releasePointerCapture(endEv.pointerId)

    // CLEANUP
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onEnd)

    // THE DECISION
    if (!hasMoved && duration < 300) {
      // It's a tap! Toggle the box.
      // console.log('TAP DETECTED: Toggling note.')
      note.isOpen = !note.isOpen
      lastActionTime.value = Date.now()
    } else {
      // console.log('DRAG DETECTED: Not toggling.')
    }
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onEnd)
}

// Inside AddNoteToMdPage.vue
defineExpose({
  handleTextInteraction
})

const devLog = (/* ev, el */) => {
  /*
  if (ev !== undefined)
    console.log('zIndex: ', window.getComputedStyle(ev).zIndex)
  else
    console.log('zIndex: ', window.getComputedStyle(el).zIndex)
  */
}

// Without defineExpose, the function stays "private" inside the child component, and the parent won't be able to "reach in" and trigger it.
const hiddenTemplateFunction = (/* note */) => {
  /*
  console.log('Highlight Depth Check:', { id: note.id })
  console.log('Highlight Anchor:', { top: note.top, left: note.left, textSnippet: note.text.substring(0, 10) })
  console.log('Identity Crisis Check:', note.id, 'isHighlight is:', note.isHighlight)
  */
}
const pencilLogger = (el: any, note: any) => {
  if (!el) return

  // If 'el' is a Vue component instance, we need 'el.$el'
  // If it's a plain DOM element, we use 'el'
  const domElement = el.$el || el

  if (domElement && typeof domElement.getBoundingClientRect === 'function') {
    const rect = domElement.getBoundingClientRect()
    console.log(`[Pencil Check] ID: ${note.id}`, {
      text: note.text,
      rect: { top: rect.top, left: rect.left, width: rect.width },
      pointerEvents: window.getComputedStyle(domElement).pointerEvents,
      zIndex: window.getComputedStyle(domElement).zIndex
    })
  }
}
</script>

<template>
  <div
    v-if="target"
    class="notes-layer"
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
      class="note-item group"
      :class="{ 'is-highlight': note.isHighlight, 'is-open pointer-events: none': note.isOpen }"
      :style="{
        top: `${note.top}px`,
        left: `${note.left}px`,
        width: note.isHighlight ? note.width + 'px' : 'auto',
        zIndex: note.isOpen ? 2000 : 1000
      }"
    >
      <UPopover
        v-model:open="note.isOpen"
        :popper="{ placement: 'top', strategy: 'fixed' }"
      >
        <template #default>
          <div class="pointer-events-auto relative">
            <UButton
              v-if="!note.isHighlight"
              icon="i-heroicons-chat-bubble-left-ellipsis"
              size="xs"
              class="touch-none rounded-full shadow-md translate-x-[-50%] translate-y-[-100%]"
              @pointerdown.stop="startDragging($event, note)"
              @click.stop.prevent
            />
            <!-- class="touch-action-none"  -->

            <template v-else>
              <!--
              <span
                :ref="devLog"
                class="hidden"
              >
                {{ hiddenTemplateFunction(note) }}
              </span>
            -->
              <div
                class="highlight-box"
                :style="{ height: note.height + 'px' }"
              />
              <UButton
                :ref="(el) => pencilLogger(el, note)"
                icon="i-heroicons-pencil"
                variant="ghost"
                size="xs"
                color="neutral"
                class="pencil-btn absolute top-0 right-10 translate-x-[100%] translate-y-[-50%]"
                @click.stop="note.isOpen = !note.isOpen"
              />
            </template>
          </div>
        </template>

        <template #content>
          <div class="p-4 w-72 flex flex-col gap-3 shadow-xl">
            <div class="flex justify-between items-center border-b pb-2 mb-1">
              <span class="text-xs font-bold text-gray-500">
                {{ note.isHighlight ? 'HIGHLIGHT' : 'NOTE' }}
              </span>
              <span class="text-[10px] text-gray-400">ID: {{ note.id.toString().slice(-4) }}</span>
            </div>

            <UTextarea
              v-model="note.text"
              autofocus
              color="primary"
              variant="outline"
              placeholder="Start typing your thoughts here..."
              :rows="4"
              class="text-sm"
            />

            <div class="flex justify-between gap-2 pt-2">
              <UButton
                icon="i-heroicons-trash"
                color="warning"
                variant="ghost"
                size="xs"
                label="Delete"
                @click="deleteNote(note.id)"
              />

              <UButton
                icon="i-heroicons-check"
                color="primary"
                size="xs"
                label="Done"
                @click="note.isOpen = false"
              />
            </div>
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>

<style scoped>
/* 1. THE LAYER: Full screen glass, passes clicks through */
.notes-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
}

/* 2. THE ITEM: The individual anchor */
.note-item {
  position: absolute;
  /* We remove pointer-events: none here because the child handles it */
  user-select: none;
  -webkit-user-select: none;
}

/* 3. THE TRIGGER: This "punches the hole" in the glass */
.pointer-events-auto {
  pointer-events: auto;
}

/* 4. THE HIGHLIGHT BOX */
.highlight-box {
  width: 100%; /* Spans the width defined in :style above */
  background-color: rgba(96, 165, 250, 0.3);
  border-bottom: 2px solid rgb(59, 130, 246);
  cursor: pointer;
}
.highlight-box:hover {
  background-color: rgba(96, 165, 250, 0.5);
}

/* 5. THE PENCIL: Visibility logic */
.pencil-btn {
  z-index: 50;
  transition: opacity 0.3s ease;
}

/* PC: Show only on hover */
@media (min-width: 1024px) {
  .pencil-btn { opacity: 0; }
  .group:hover .pencil-btn { opacity: 1; }
}

/* Mobile or Open: Always show */
.is-open .pencil-btn,
.is-mobile .pencil-btn {
  opacity: 1 !important;
}

/* 6. SCRIPTURE */
.scripture-content {
  cursor: crosshair;
  user-select: text;
  -webkit-user-select: text;
  /* This prevents the long-press 'Magnifying Glass' from
     getting stuck in a loop with your double-tap logic */
  -webkit-touch-callout: default;
}
/*
Source:
https://gemini.google.com/share/19f7ba5a37b5
*/

.note-item.is-highlight {
  /* Crucial: Let the finger 'pass through' to the text handles */
  pointer-events: none !important;
  /* Ensure the container doesn't have a background blocking the view */
  background: transparent !important;
}

/* Re-enable touch for the pencil only */
.note-item.is-highlight .pencil-btn {
  pointer-events: auto !important;
}
</style>
