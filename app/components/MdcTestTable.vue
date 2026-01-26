<template>
  <div style="border: 2px solid red; padding: 10px;">
    <h3>SSR Connection Test</h3>
    <p v-if="pending">
      Loading from API...
    </p>
    <p v-else-if="error">
      Error: {{ error.message }}
    </p>
    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in data"
          :key="item.id"
        >
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// We use a RELATIVE path here.
// Nuxt Nitro should handle this internally on Vercel.
const { data, pending, error } = await useFetch('/api/en/test', {
  server: true,
  lazy: false
})

// Log to help us see where it's running
if (import.meta.server) {
  console.log('Test Component: Running on SERVER', data.value)
}
</script>
