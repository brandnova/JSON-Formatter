<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">JSON Formatter and Validator</h1>
    <textarea
      v-model="jsonInput"
      placeholder="Paste your JSON here"
      class="w-full h-48 p-2 mb-4 border rounded resize-y"
    ></textarea>
    <button
      @click="formatAndValidate"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Format and Validate
    </button>
    <div v-if="formattedJson" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Formatted JSON:</h2>
      <pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code v-html="formattedJson"></code></pre>
    </div>
    <p v-if="message" :class="[messageClass, 'mt-4']">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/default.css'

hljs.registerLanguage('json', json)

const jsonInput = ref('')
const formattedJson = ref('')
const message = ref('')
const isError = ref(false)

const messageClass = computed(() => 
  isError.value ? 'text-red-500' : 'text-green-500'
)

function formatAndValidate() {
  try {
    const parsedJson = JSON.parse(jsonInput.value)
    formattedJson.value = hljs.highlight(
      JSON.stringify(parsedJson, null, 2),
      { language: 'json' }
    ).value
    message.value = 'JSON is valid!'
    isError.value = false
  } catch (error) {
    formattedJson.value = ''
    message.value = `Invalid JSON: ${error.message}`
    isError.value = true
  }
}
</script>
