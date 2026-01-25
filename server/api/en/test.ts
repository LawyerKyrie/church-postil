// server/api/test.ts
export default defineEventHandler((/* event */) => {
  // This will show up in Vercel "Functions" logs
  console.log('--- TEST API CALLED from api/test.ts---')

  return [
    { id: 1, name: 'SSR Test Row 1', status: 'Success' },
    { id: 2, name: 'SSR Test Row 2', status: 'Working' }
  ]
})
