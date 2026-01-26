// server/api/test.ts
export default defineEventHandler((/* event */) => {
  const testData = [
    { id: 1, name: 'Root Test Data' },
    { id: 2, name: 'Vercel Deployment OK' }
  ]

  return testData
})
