// provide global function for toggle language

export default defineNuxtPlugin(() => {
  return {
    provide: {
      updateThePageOnLanguageChange(newLocale) { // inside closeMenuAndUpdate
        const router = useRouter()
        const oldPath = ref<string>(window.location.pathname)
        let restPath = oldPath.value?.slice(3)
        if (restPath.startsWith('/')) restPath = restPath.slice(1)

        let newPath = `../${newLocale}/${restPath}`
        // correction for removing ex. advent/index.md to ex. ../advent-postil
        if (newPath.startsWith('../en') && newPath.endsWith('-postil')) {
          newPath = newPath.slice(0, -7)
        }
        // console.log('1.log newPath ', newPath)

        const endings = ['advent', 'christmas', 'lent', 'easter', 'trinity1', 'trinity2']
        function endsWith(str, suffixes) {
          return suffixes.some(function (suffix) {
            return str.endsWith(suffix)
          })
        }
        if (endsWith(newPath, endings)) {
          // console.log('2.log newPath', newPath)
          if (newPath.startsWith('../da'))
            router.push(`${newPath}-postil`)
          else router.push(`${newPath}`)
        } else { // if (!endings.some(folder => newPath.includes(folder))) // if path not ends with postil folder
          // console.log('3.log newPath', newPath)
          // Checking if the old route exists in the new language code
          const index2LastSlash = newPath.lastIndexOf('/')
          let resultUrl
          if (!router.hasRoute(newPath)) {
            if (index2LastSlash !== -1) {
              // removing /filename and returning to the folders index-file
              resultUrl = newPath.slice(0, index2LastSlash)
              router.push(`../${resultUrl}`)
              // removing the old locale value with ../
            }
            return
          }
        } // else console.log('4.log newPath', newPath)
      } // End of function updateThePageOnLanguageChange()
    }
  }
})
/*
PLAN: PATH TO SERMONS IN DANISH AND ENGLISH MUST BE COORDINATED
IF NOT: TOGGLE OF LANGUAGE DON'T LOAD THE SAME SERMON IN OPPOSITE LANGUAGE
THE PROBLEM IS THE NAME OF THE HEADERS LINKS...
*/
