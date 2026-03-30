/* eslint-disable @typescript-eslint/no-explicit-any */
export const useImageState = () => {
  // Your Global "Source of Truth"
  const imageData = useState('og-image-data', () => ({
    text: '',
    headline: 'Church Postil',
    layout: 'Mobile',
    isLoaded: false
  }))

  const route = useRoute()

  // THE BRAIN: Sync URL -> Global State
  const syncFromUrl = (pageData: any) => {
    const { s, q, layout } = route.query

    // 1. Handle Layout preference if it exists in URL
    if (layout) imageData.value.layout = layout as string

    // 2. Handle Header Reference (?s=h31)
    if (s && pageData?.body?.toc?.links) {
      const found = pageData.body.toc.links.find((l: any) => l.id === s)
      if (found) {
        imageData.value.text = found.text
        imageData.value.isLoaded = true
        return
      }
    }

    // 3. Handle Zipped Quote (?q=...)
    if (q) {
      // Assuming you have your unzip function ready
      imageData.value.text = decodeURIComponent(q as string) // Simplified for now
      imageData.value.isLoaded = true
      return
    }

    // 4. Default if nothing is found
    imageData.value.text = pageData?.title || 'Luther Quote'
    imageData.value.isLoaded = true
  }

  return { imageData, syncFromUrl }
}
