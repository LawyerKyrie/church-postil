<script setup>
const route = useRoute()
// Use a STABLE key, not a random one.
// Adding the route path ensures it's unique per page but stays the same for SSR.
const uniqueKey = `test-table-${route.path.replace(/\//g, '-')}`

const { data /* , error */ } = await useFetch(
  '/api/test2',
  {
    key: uniqueKey,
    server: true
})

if (import.meta.server) {
  // This will show up in Vercel's "Functions" logs
  console.log(`[SERVER LOG] Path: ${route.path} | Data is Array: ${Array.isArray(data.value)}`)
  if (!Array.isArray(data.value)) {
    console.log('[SERVER LOG] Data is NOT an array. It is:', typeof data.value)
  }
}
</script>

<template>
  <div style="border: 2px solid green; padding: 10px; margin: 10px 0;">
    <h4>System Baseline Test</h4>
    <p v-if="status === 'pending'">
      📡 Fetching...
    </p>
    <p v-else-if="error">
      ❌ Error: {{ error.statusCode }} - {{ error.message }}
    </p>
    <div v-else>
      <p>✅ Rows found: {{ data?.length || 0 }}</p>
      <p>Type of data: {{ typeof data }}</p>
      <pre>{{ data }}</pre>
      <ul v-if="data?.length">
        <li
          v-for="item in data"
          :key="item.id"
        >
          {{ item.name }}
        </li>
      </ul>
      <p v-else>
        "⚠️ The API returned an empty array [ ]."
      </p>
    </div>
  </div>
</template>
