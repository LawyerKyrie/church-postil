// provide function for click outside element

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useClickOutside(elementRef, callback) {
        const listener = (event) => {
          // Check if the clicked target is outside the elementRef and its children
          if (elementRef.value && !elementRef.value.contains(event.target)) {
            callback(event)
          }
        }

        onMounted(() => {
          window.addEventListener('click', listener)
        })

        onUnmounted(() => {
          window.removeEventListener('click', listener)
        })
      }
    }
  }
})
