// provide global helpers (functions)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      created(timeStamp) {
        const dateObj = new Date(timeStamp)
        const date = dateObj.getDate().toString()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let month = dateObj.getMonth() + 1 as any
        month = month.toString()
        const year = dateObj.getFullYear().toString()
        const time = dateObj.toLocaleString().slice(11, 17)
        return date + '/' + month + '/' + year.slice(2) + ' ' + time
      },

      localeDate(timeStamp) {
        const dateObj = new Date(timeStamp)
        return dateObj.toLocaleString()
      },

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
