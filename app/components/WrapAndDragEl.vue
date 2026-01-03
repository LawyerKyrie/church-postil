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
})

watch([width, height], ([newWidth, newHeight]) => {
  // console.log('New width ', newWidth, ' and height ', newHeight)
  x.value = newWidth - 50
  y.value = newHeight - 35
})
</script>

<template>
  <div
    ref="el"
    title="Move me!"
    :style="style"
    style="position: fixed"
    class="opacity-50 bg-transparent"
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
