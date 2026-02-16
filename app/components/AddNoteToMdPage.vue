<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// source: https://gemini.google.com/share/16153a33b6fe
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
  // Inside onMounted
  document.addEventListener('selectionchange', () => {
    if (!isMobile) return

    const selection = window.getSelection() as any
    const text = selection?.toString().trim() || ''

    // If there is text, the "flips" are active. Show the buttons!
    if (text.length > 0) {
      const range = selection?.getRangeAt(0)
      tempMobileRect.value = range?.getBoundingClientRect()
      tempMobileText.value = text
      isSelecting.value = true
    } else {
      // If text is cleared, hide the buttons (but only if we aren't clicking 'Confirm')
      // We can add a small guard here if needed.
    }
  })
  // Optional: Update button position as user drags handles
  if ('ontouchstart' in window) {
    document.addEventListener('selectionchange', () => {
      if (isSelecting.value) {
        const sel = window.getSelection()
        if (sel && sel.rangeCount > 0) {
          tempMobileRect.value = sel.getRangeAt(0).getBoundingClientRect()
        }
      }
    })
  }
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
const isMobile = 'ontouchstart' in window

let lastInteractionType = ''
// let lastActionTime = 0
// const timeStamp = useTimeStamp()
const lastActionTime = useLastActionTime() as any// For the "Double-fire" shield

const tempMobileRect = ref<any>(null)
const tempMobileText = ref<any>(null)

const handleTextInteraction = (event: Event) => {
  // console.log(`[Interaction] Type: ${event.type}, Target:`, event.target)
  /* -- GUARDING RULES -- */
  const target = event.target as HTMLElement
  console.log('target = ', event.target)
  // If we are touching the bubble or the popover content...
  // Update this to match your harmonized template
  if (target.closest('.note-item') || target.closest('.p-4')) {
    // console.log('Shielding note from background logic')
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
    // console.log('Guard active: ignoring ghost event, timeStamp = ', event.timeStamp)
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

  console.log('log before path a and b')

  // --- PATH A: DOUBLE-CLICK / DOUBLE-TAP ---
  // We use our new "Solid" composable logic here
  if (checkDoubleTap(event as UIEvent)) {
    if (text.length === 0) {
      // LOCK THE DOOR IMMEDIATELY
      lastActionTime.value = Date.now()
      // LOG IT so we can see if it still tries to run twice
      // console.log('Creating bubble, locking action time at:', lastActionTime.value)
      const pos = (event instanceof TouchEvent) ? event.changedTouches[0] : (event as MouseEvent)
      createNoteOnDblClick(pos)

      // CLEAR SELECTION so the PC doesn't get confused
      window.getSelection()?.removeAllRanges()
      return // EXIT IMMEDIATELY
    } else {
      // console.log('Double tap detected, but text was found:', text)
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

    if (rect && rect.width > 5) {
      // 1. Capture the text
      const text = selection?.toString().trim() || ''

      if (isMobile) {
        /* --- MOBILE: THE WAITING ROOM --- */
        // Store the RAW screen position for the buttons
        tempMobileRect.value = rect
        tempMobileText.value = text

        // Turn on the "Confirm | Cancel" buttons
        isSelecting.value = true

        // STOP! Do not save. Do not clear selection.
        // This keeps the blue handles alive.
        return
      } else {
        // PC: Standard Drag-and-Release highlighting
        console.log('Log from creating highlight on pc')
        saveHighlightedText(rect, text)
        selection?.removeAllRanges()
        lastActionTime.value = now // <--- THIS LOCKS THE BUBBLE PATH
        reset()
      }
    }
  }

  // --- PATH C: HIGHLIGHTING ANCHOR / HEADER ---
  if (target.tagName === 'A') {
    console.log('anchor element - get the text from the anchor element and save it as highligh')
    alert('Kyrie! Get the text from the anchor element children and save it as highlighted text.')
  }
}

const createNoteOnDblClick = (rect) => {
  if (!props.target) return

  // LOCK OUT all background logic immediately
  lastActionTime.value = Date.now()

  const targetRect = props.target.getBoundingClientRect()
  // Calculate position relative to the container, NOT the screen
  const top = rect.clientY - targetRect.top
  const left = rect.clientX - targetRect.left

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
  }, 10)
  // console.log(`[Creation] New Note ID: ${newNote.id} at ${top}, ${left}`)
}

const deleteNote = (id: number) => {
  // Filters the global list directly
  allNotes.value = allNotes.value.filter(n => n.id !== id)
}

const saveHighlightedText = (rect, text) => {
  // LOCK OUT all background logic immediately
  lastActionTime.value = Date.now()

  console.log('text = ', text)

  const targetRect = props?.target?.getBoundingClientRect() as any
  const newNote = {
    id: Date.now(),
    path: route.path,
    title: props.title,
    text: `«${text}»`,
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
  console.log('--- HIGHLIGHT DATA CHECK (bottom of saveHighlightedText after allNotes.value.push(newNote)) ---')
  console.log('ID: ', newNote.id)
  console.log('isHighlight: ', newNote.isHighlight) // Should be true
  console.log('Initial Position: ', { top: newNote.top, left: newNote.left })
  console.log('newNote.width: ', newNote.width)
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

// Without defineExpose, the function stays "private" inside the child component, and the parent won't be able to "reach in" and trigger it.

/*
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
*/

const confirmHighlight = () => {
  const selection = window.getSelection()
  const text = selection?.toString().trim() || ''

  if (selection !== null && text.length > 0) {
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    // NOW we create the pencil and the highlight box
    saveHighlightedText(rect, text)

    // Clear the handles only after the pencil is saved
    selection.removeAllRanges()
    lastActionTime.value = Date.now()
    console.log('confirmHighlight have saved highlighted text, removed all ranges, and set last action time ot Date.now()')
  }

  isSelecting.value = false
  reset()
}

const cancelSelection = (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // 1. Force the browser to drop the handles
  window.getSelection()?.removeAllRanges()

  // 2. Hide our UI
  isSelecting.value = false
  tempMobileRect.value = null

  // 3. Clear the guard
  lastActionTime.value = Date.now()
  reset()
}

// https://gemini.google.com/share/d98cb44c52da
const shareNote = (note) => {
  let textToShare = note.text

  // const extractApostrophes = (text) => {
  // Check if the text contains guillemets apostrophes
  /*
  if (textToShare.includes('"')) {
    const parts = textToShare.split('"')
    // If there are at least two apostrophes, parts[1] will be the text between them
    if (parts.length >= 3) {
      textToShare = parts[1]
    }
  }
  */
  const match = textToShare.match(/«(.*?)»/)
  if (match) {
    textToShare = match[1]
  }
  // }

  // 1. Try to get text between apostrophes
  // 2. Fallback to the full note.text
  // 3. Last resort: try to "hit test" the coordinates
  // textToShare = textToShare || note.text || getNearestText(note)

  // 1. Get the base URL (e.g., https://example.com/page)
  // We use window.location.origin + note.path to ensure it's absolute
  const baseUrl = window.location.origin + note.path
  // 2. Encode the text for the Scroll-to-Text fragment
  const encodedText = encodeURIComponent(textToShare.trim())
  // 3. Construct the final "Magic Link"
  const shareUrl = `${baseUrl}#:~:text=${encodedText}`
  // Share logic...
  // 4. Use the Web Share API (Mobile friendly) or Copy to Clipboard
  if (navigator.share) {
    navigator.share({
      title: 'Check out this highlight',
      url: shareUrl
    }).catch(console.error)
  } else {
    // Fallback for PC: Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard!')
  }
}

/*
const getNearestText = (note: any) => {
  // Use client-relative coordinates
  const x = note.left
  const y = note.top - window.scrollY

  // 1. Official Standard (Firefox & modern spec)
  if ('caretPositionFromPoint' in document) {
    const pos = (document as any).caretPositionFromPoint(x, y)
    if (pos && pos.offsetNode) {
      return pos.offsetNode.textContent
    }
  }
  // 2. The most compatible "Modern" fallback
  // This gets the actual element at those coordinates
  const element = document.elementFromPoint(x, y)
  return element?.textContent || null
}
*/
</script>

<template>
  <div
    v-if="target"
    class="notes-layer"
  >
    <Transition name="fade">
      <div
        v-if="isSelecting && isMobile"
        class="fixed z-[3000] pointer-events-auto"
        :style="{
          top: (tempMobileRect.top - 35) + 'px',
          left: (tempMobileRect.left + (tempMobileRect.width / 2) - 25) + 'px'
        }"
      >
        <!--  left: (tempMobileRect.left + (tempMobileRect.width / 2) - 25) + 'px' -->
        <div
          class="shadow-2xl border border-primary-500 rounded-lg bg-white"
        >
          <!--
          <UButtonGroup orientation="horizontal"
          -->
          <UButton
            icon="i-heroicons-check"
            title="Confirm, cancel or extend the selected/ highlighted selection!"
            label="Highlight This"
            size="sm"
            color="primary"
            @pointerdown.stop="confirmHighlight"
          />
          <UButton
            icon="i-heroicons-x-mark"
            color="neutral"
            size="sm"
            @pointerdown.stop="cancelSelection"
          />
        </div>
      </div>
    </Transition>

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
              <div
                class="highlight-box"
                :style="{
                  width: note.width + 'px',
                  height: note.height + 'px'
                }"
              />
              <!--  <UButton :ref="(el) => pencilLogger(el, note)" ... -->
              <UButton
                icon="i-heroicons-pencil"
                variant="ghost"
                size="xs"
                color="neutral"
                class="pencil-btn absolute top-0 right-0 translate-x-[100%] translate-y-[-50%]"
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
                icon="i-heroicons-share"
                color="neutral"
                variant="ghost"
                size="xs"
                label="Share"
                @click="shareNote(note)"
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
/* KEEP: Essential for letting the user grab text handles behind the UI */
.notes-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
}

.note-item {
  position: absolute;
  /* Allow the pencil/bubble to be clicked */
  pointer-events: auto;
  /* Important: don't let the container itself be selectable */
  user-select: none;
}

/* Specific fix for highlights to let 'flips' work */
.note-item.is-highlight {
  pointer-events: none !important;
}

.note-item.is-highlight .pencil-btn,
.note-item.is-highlight .popover-content {
  pointer-events: auto !important;
}

.highlight-box {
  width: 100%;
  background-color: rgba(96, 165, 250, 0.3);
  border-bottom: 2px solid rgb(59, 130, 246);
  /* Since it's pointer-events: none, cursor won't show, which is fine! */
}
/*
Source:
https://gemini.google.com/share/3eb27e378047
*/
.scripture-content {
  -webkit-user-select: text !important;
  user-select: text !important;
  /* Ensure the browser knows this is the touch target */
  touch-action: auto !important;
}

/* Updating: https://gemini.google.com/share/da17a66620e0 */

/* Ensure the button is reachable */
.pencil-btn {
  pointer-events: auto !important;
  z-index: 2100; /* Higher than the glass */
}

/* Ensure the highlight box doesn't block the handles while selection is active */
.highlight-box {
  pointer-events: none !important;
}
</style>
