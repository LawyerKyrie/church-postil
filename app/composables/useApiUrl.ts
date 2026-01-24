// composables/useApiUrl.ts
export const useApiUrl = (path: string) => {
  const config = useRuntimeConfig()

  // 1. Try to get the domain from the environment
  // 2. On Vercel, 'process.env.VERCEL_URL' is automatically available
  const apiBase = config.public.apiBase || `https://${process.env.VERCEL_URL}` || 'http://localhost:3000'

  const cleanPath = path.startsWith('/') ? path : `/${path}`

  // On the server, we need the full URL
  if (import.meta.server) {
    // If we are on Vercel, they prefer relative internal calls or the full VERCEL_URL
    return `${apiBase}${cleanPath}`
  }

  // On the client, always use relative
  return cleanPath
}

// Source: https://gemini.google.com/share/b1c4c41a85a8
