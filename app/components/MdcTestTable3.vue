<script setup>
const route = useRoute()
const { data, error } = await useAsyncData(
  `truth-fetch-${route.path}`,
  () => $fetch('/api/test3')
)
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
      </div>
    </div>
  </div>
</template>
