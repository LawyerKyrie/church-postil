<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()

const props = defineProps({
  xInit: String,
  yInit: String
})

const el = useTemplateRef('el')

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x, y, style } = useDraggable(el, {
  initialValue: { x: Number(props.xInit), y: Number(props.yInit) }
  // onStart: (pos, event) => { event.preventDefault() }
})

const isMobile = () => {
  if (navigator.userAgent.includes('Windows'))
    return false
  else if (width.value < 500)
    return true
}

watch([width, height], ([newWidth, newHeight]) => {
  // console.log('New width ', newWidth, ' and height ', newHeight)
  x.value = isMobile() ? newWidth - 35 : newWidth - 48
  y.value = newHeight - 33
})
</script>

<template>
  <div
    ref="el"
    title="Move me!"
    :style="style"
    style="position: fixed"
    class="fixed z-50 touch-none select-none"
  >
    <!--
    <UButton
      icon="i-lucide-menu"
      :title="`x=${x.toFixed(0)} & y=${y.toFixed(0)}`"
      color="primary"
      square
      variant="subtle"
    />
    -->
    <slot />
  </div>
</template>
