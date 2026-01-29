export default defineNuxtPlugin((nuxtApp) => {
  // Only run this if we are in a browser environment
  if (import.meta.client) {
    window.nuxt = nuxtApp
    // Optional: Log it so you know it's ready
    // console.log('Nuxt instance attached to window. Use "nuxt" to access.')
  }
  return {
    provide: {
      keyboardClickK() {
        const target = document
        const down = new KeyboardEvent('keydown', {
          key: 'k',
          code: 'KeyK',
          ctrlKey: true,
          bubbles: true,
          cancelable: true
        })
        const up = new KeyboardEvent('keyup', { key: 'k', ctrlKey: true, bubbles: true })

        target.dispatchEvent(down)
        setTimeout(() => target.dispatchEvent(up), 100) // Simulates the release
      },
      keyboardClickM() {
        const target = document
        const down = new KeyboardEvent('keydown', {
          key: 'm',
          code: 'KeyM',
          bubbles: true,
          cancelable: true
        })
        const up = new KeyboardEvent('keyup', { key: 'k', ctrlKey: true, bubbles: true })

        target.dispatchEvent(down)
        setTimeout(() => target.dispatchEvent(up), 100) // Simulates the release
      }
    }
  }
})
