// provide global helpers (functions)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      keyboardClickO() {
        const targetElement = document
        const ctrlKEvent = new KeyboardEvent('keydown', {
          key: 'o',
          code: 'KeyO',
          bubbles: true,
          cancelable: true
        })
        targetElement.dispatchEvent(ctrlKEvent)
      }
    }
  }
})
