export default defineNuxtRouteMiddleware((/* to */) => {
// If the user hits the absolute root "/"
/*
  if (to.path === '/')
    return navigateTo('/en', { redirectCode: 302 })
  */
  console.log('No redirects from middleware.redirects.ts')
})
