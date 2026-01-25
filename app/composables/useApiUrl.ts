export const useApiUrl = (path: string) => {
  const config = useRuntimeConfig()

  let apiBase = config.public.apiBase // Your default from nuxt.config

  // If we are on the server (SSR) and on Vercel
  if (import.meta.server && process.env.VERCEL_URL) {
    // VERCEL_URL doesn't include 'https://', so we add it
    apiBase = `https://${process.env.VERCEL_URL}`
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`

  // Server needs absolute, Client stays relative
  return import.meta.server ? `${apiBase}${cleanPath}` : cleanPath
}
