<script setup lang="ts">
const showButton = ref(false)

// Show the button when the user scrolls down
const handleScroll = () => {
  showButton.value = window.scrollY > 300 // Adjust the value to control when the button appears
}

// Scroll to the top when the button is clicked
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Add and remove the event listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Source: Google AI: nuxt ui back to top buttons alternatives
</script>

<template>
  <ClientOnly>
    <Transition name="fade">
      <UButton
        v-if="showButton"
        icon="i-heroicons-arrow-up-20-solid"
        size="lg"
        color="primary"
        variant="solid"
        class="fixed bottom-1 right-1 z-50 rounded-full shadow-lg"
        aria-label="Back to top"
        @click="scrollToTop"
      />
    </Transition>
  </ClientOnly>
</template>

<style scoped>
/* Define transition for a smooth fade effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0
}
</style>
