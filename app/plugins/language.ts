// provide global function for toggle language

export default defineNuxtPlugin(() => {
  return {
    provide: {
      updateThePageOnLanguageChange(newLocale /* , oldLocale */) { // inside closeMenuAndUpdate
        const router = useRouter()
        // let localeBefore
        // localeBefore = oldLocale // updating localeBefore to the last changed language
        const oldPath = ref<string>(window.location.pathname)
        let restPath = oldPath.value?.slice(3)
        if (restPath.startsWith('/')) restPath = restPath.slice(1)

        const newPath = `../${newLocale}/${restPath}`

        const endings = ['advent', 'christmas', 'lent', 'easter', 'trinity1', 'trinity2']
        function endsWithAny(str, suffixes) {
          return suffixes.some(function (suffix) {
            return str.endsWith(suffix)
          })
        }
        if (endsWithAny(newPath, endings)) {
          router.push(`${newPath}`)
        } else { // if not a folder
          console.log('The path is not one of the six postil folders.')
          // Checking if the old route exists in the new language code
          const index2LastSlash = newPath.lastIndexOf('/')
          let resultUrl
          if (!router.hasRoute(newPath)) {
            if (index2LastSlash !== -1) {
              // removing /filename and returning to the folders index-file
              resultUrl = newPath.slice(0, index2LastSlash)
              console.log('resultUrl is')
              console.log(resultUrl)
              router.push(`../${resultUrl}`)
              // removing the old locale value with ../
            }
            return
          }
        }
      } // End of function updateThePageOnLanguageChange()
    }
  }
})
