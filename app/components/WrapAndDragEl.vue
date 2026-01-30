<script setup lang="ts">
// source: https://gemini.google.com/share/a0587ef953ff
import { watch, onMounted, nextTick } from 'vue'
import { useDraggable, useWindowSize } from '@vueuse/core'

const props = defineProps({
  xInit: { type: Number, default: 0 },
  yInit: { type: Number, default: 0 },
  mobile: Boolean
})

const el = useTemplateRef<HTMLElement>('el')
const { width, height } = useWindowSize()

// 1. Setup draggable without strict initialValue reliance
const { x, y, style } = useDraggable(el, {
  initialValue: { x: props.xInit || 0, y: props.yInit || 0 },
  preventDefault: true
})

const syncAndClamp = () => {
  const element = el.value
  if (!element) return

  const btnWidth = element.clientWidth || 40
  const btnHeight = element.clientHeight || 50
  const margin = 16

  const safeBottom = typeof window !== 'undefined'
    ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0')
    : 0

  // Calculate boundaries
  const maxX = width.value - btnWidth - margin
  const maxY = height.value - btnHeight - margin - safeBottom

  // FORCE the values from props if we are just starting,
  // otherwise just clamp the existing values.
  // This fixes the "stuck in the middle" issue.
  x.value = Math.min(Math.max(margin, props.xInit), maxX)
  y.value = Math.min(Math.max(margin, props.yInit), maxY)
}

// 2. Watch for orientation changes to re-clamp
watch([width, height], () => {
  syncAndClamp()
})

onMounted(async () => {
  await nextTick()
  // This is the "Magic Fix":
  // Explicitly set the coordinates after the DOM is painted.
  syncAndClamp()
})
</script>

<template>
  <div
    ref="el"
    :style="style"
    class="movable-wrapper"
  >
    <slot />
  </div>
</template>

<style scoped>
.movable-wrapper {
  position: fixed;
  z-index: 9999;
  /* Ensure no other positioning properties exist */
  top: 0;
  left: 0;
  bottom: auto;
  right: auto;
  touch-action: none;
}
</style>
