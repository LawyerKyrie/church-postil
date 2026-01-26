<script setup>
const route = useRoute()

// const config = useRuntimeConfig()
const { data } = await useAsyncData('test-fetch', () => {
  // Use $fetch with the full URL to bypass any path resolution issues
  const baseUrl = import.meta.dev ? '' : `https://${process.env.VERCEL_URL}`
  return $fetch(`${baseUrl}/api/test3`)
})
</script>

<template>
  <div style="border: 3px solid blue; padding: 15px;">
    <h3>Connection Diagnostics</h3>

    <p><strong>Data Type:</strong> {{ Array.isArray(data) ? 'Array' : typeof data }}</p>

    <div
      v-if="error"
      style="color: red;"
    >
      <p><strong>Error Detected:</strong> {{ error.statusCode }}</p>
      <pre>{{ error.message }}</pre>
    </div>

    <div v-else>
      <p v-if="Array.isArray(data)">
        <strong>Row Count:</strong> {{ data.length }}
      </p>
      <div v-else-if="typeof data === 'string'">
        <p style="color: orange;">
          <strong>Warning:</strong> Received HTML instead of JSON!
        </p>
        <pre style="background: #eee; font-size: 10px;">{{ data.substring(0, 200) }}...</pre>

        <br>
        <h3>The URL path?</h3>
        <p>Current Path: {{ route.path }}</p>
        <p>Attempted API URL: /api/test3</p>
      </div>
    </div>
  </div>
</template>
