<script setup>
const route = useRoute()

// 1. Manually determine the base URL
// On the server (Vercel), we use the system variable.
// On the client, we use an empty string (browser handles it).
const getBaseUrl = () => {
  if (import.meta.env.SSR) {
    return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  }
  return ''
}

const { data, error } = await useAsyncData(`fetch-${route.path}`, async () => {
  const baseUrl = getBaseUrl()
  const apiPath = '/api/test3' // Ensure the leading slash is here!

  console.log('Fetching from:', baseUrl + apiPath)

  return await $fetch(apiPath, {
    baseURL: baseUrl
  })
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
