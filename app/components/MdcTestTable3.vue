<script setup>
const route = useRoute()

// We use useAsyncData but we tell it to fetch from the server context
const { data, error } = await useAsyncData(`nitro-fix-${route.path}`, () => {
  // On the server, this calls the function directly.
  // On the client, it makes a clean absolute request.
  return $fetch('/api/test3', {
    headers: useRequestHeaders(['cookie']) // Passes auth if needed
  })
})
</script>

<template>
  <div style="border: 2px solid magenta; padding: 10px;">
    <h4>Nitro Direct Proxy</h4>
    <p>Status: {{ error ? '❌' : (data ? '✅' : '⏳') }}</p>

    <div v-if="data">
      <p>Data Check: {{ Array.isArray(data) ? 'Array Found!' : 'Still String/HTML' }}</p>
      <pre v-if="Array.isArray(data)">{{ data }}</pre>
      <div v-else class="html-debug">
        <p>Preview of returned text:</p>
        <code>{{ String(data).substring(0, 50) }}</code>
      </div>
    </div>
  </div>
</template>
