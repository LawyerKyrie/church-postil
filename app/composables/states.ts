export const useGlobalValue = () => {
  // Use useState for SSR-friendly shared state
  const globalValue = useState<boolean>('myGlobalKey', () => false)

  /*
  // 'Register' or watch for changes
  watch(globalValue, (newValue, oldValue) => {
    console.log(`Global value changed from "${oldValue}" to "${newValue}"`)
  })
  */

  return globalValue
}

export const useOpenMenu = () => useState<boolean>('openMenu', () => false)

// export const useCloseElement = () => useState<HTMLButtonElement>('closeElement', () => null)
