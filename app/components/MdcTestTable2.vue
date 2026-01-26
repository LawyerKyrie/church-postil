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

<script setup>
const { path } = useRoute()

// Using an absolute path starting with / ensures it works from any sub-page
const { data, status, error } = await useFetch(
  '/api/test2',
  {
    key: `baseline-key-fixed-${Math.random()}`, // Unique key prevents cache collisions
    server: true,
    lazy: false
})

// This log will appear in your Vercel 'Functions' logs
if (import.meta.server) {
  console.log('--- BASELINE CHECK ---')
  console.log('Path:', path)
  console.log('Data count:', data.value?.length)
}
</script>
