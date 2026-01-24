export const useApiUrl = (path: string) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  // Remove leading slash from path to prevent double slashes //
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  // On the server, we MUST use the absolute URL
  // On the client, we can keep it relative for better proxy handling
  if (import.meta.server) {
    return `${apiBase}/${cleanPath}`
  }

  return `/${cleanPath}`
}
// Source: https://gemini.google.com/share/45a999326719
