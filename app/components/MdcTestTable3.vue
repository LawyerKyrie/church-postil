<script setup>
const { data, error } = await useFetch('/api/test3', {
  // This unique key is vital to prevent it from grabbing the index page's cache
  key: 'table-final-validation',
  // Force the server to fetch this before sending the page to the browser
  server: true,
  // This tells Nuxt to ignore the current page's folder depth
  baseURL: '/'
})
</script>

<template>
  <div style="border: 2px solid green; padding: 10px;">
    <div v-if="data && Array.isArray(data)">
      <p>✅ Success! Data is here.</p>
      <pre>{{ data }}</pre>
    </div>
    <div v-else-if="typeof data === 'string'">
      <p>❌ Still getting HTML. Preview:</p>
      <code>{{ data.substring(0, 30) }}</code>
    </div>
    <div v-else-if="error">
      <p>❌ Error: {{ error.message }}</p>
    </div>
  </div>
</template>
