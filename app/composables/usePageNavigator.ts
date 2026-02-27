import pageMapData from '../assets/json//file-list.json'

export const usePageNavigator = () => {
  // This is your lookup table - pageMapData
  // const pageMap: Record<string, { da: string; en: string }> = { 1011: { /* See json file */
  const pageMap = pageMapData

  /**
   * Returns the path for the selected language
   * @param id - The page ID (e.g., "1011")
   * @param currentLocale - The current language (locale.value)
   */
  const getPagePath = (id: string | number, currentLocale: string): string => {
    const entry = pageMap[id.toString()]

    if (!entry) {
      console.warn(`ID ${id} not found in pageMap`)
      return '/' // Fallback to home if ID is missing
    }

    // If current is 'en', return 'da', and vice versa
    return currentLocale === 'en' ? entry.en : entry.da
  }

  const getIdByPath = (fullPath: string): string | null => {
    // 1. Remove query params (anything after ?) but keep the hash
    // Example: /en/advent#epistle01?id=5 -> /en/advent#epistle01
    const cleanTarget = fullPath.split('?')[0]?.toLowerCase().replace(/\/$/, '')

    const entry = Object.entries(pageMap).find(([_, paths]) => {
      // Clean the map paths similarly to ensure a match
      const cleanDa = paths.da.toLowerCase().replace(/\/$/, '')
      const cleanEn = paths.en.toLowerCase().replace(/\/$/, '')

      return cleanDa === cleanTarget || cleanEn === cleanTarget
    })

    return entry ? entry[0] : null
  }

  return {
    getPagePath, getIdByPath
  }
}

// source: https://gemini.google.com/share/continue/1f70050d441f
