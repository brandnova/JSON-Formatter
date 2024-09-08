<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">JSON Formatter and Validator</h1>
    <div class="mb-4">
      <input type="file" @change="handleFileUpload" class="mb-2" accept=".json,application/json" />
      <textarea
        v-model="jsonInput"
        placeholder="Paste your JSON here"
        class="w-full h-48 p-2 mb-2 border rounded resize-y"
      ></textarea>
    </div>
    <div class="flex flex-wrap gap-2 mb-4">
      <button @click="formatAndValidate" class="btn bg-blue-500 hover:bg-blue-700">
        Format and Validate
      </button>
      <button @click="minifyJson" class="btn bg-green-500 hover:bg-green-700">
        Minify JSON
      </button>
      <button @click="saveJson" class="btn bg-purple-500 hover:bg-purple-700">
        Save/Download
      </button>
    </div>
    <div class="mb-4">
      <label class="block mb-2">Indentation:</label>
      <select v-model="indentSize" class="p-2 border rounded">
        <option value="2">2 spaces</option>
        <option value="4">4 spaces</option>
        <option value="tab">Tab</option>
      </select>
    </div>
    <div v-if="formattedJson" class="mt-4">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold">Formatted JSON:</h2>
        <button @click="copyToClipboard" class="btn bg-gray-300 hover:bg-gray-400 text-gray-800">
          Copy to Clipboard
        </button>
      </div>
      <pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code v-html="formattedJson"></code></pre>
    </div>
    
    <!-- Popup Message -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded shadow-lg">
        <p :class="{ 'text-green-500': !isError, 'text-red-500': isError }">{{ message }}</p>
        <button @click="showPopup = false" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Close
        </button>
      </div>
    </div>
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
const indentSize = ref('2')
const showPopup = ref(false)

function showMessage(msg, error = false) {
  message.value = msg
  isError.value = error
  showPopup.value = true
}

function formatAndValidate() {
  try {
    const parsedJson = JSON.parse(jsonInput.value)
    const indent = indentSize.value === 'tab' ? '\t' : Number(indentSize.value)
    formattedJson.value = hljs.highlight(
      JSON.stringify(parsedJson, null, indent),
      { language: 'json' }
    ).value
    showMessage('JSON is valid!')
  } catch (error) {
    formattedJson.value = ''
    showMessage(`Invalid JSON: ${error.message}`, true)
  }
}

function minifyJson() {
  try {
    const parsedJson = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(parsedJson)
    formatAndValidate()
    showMessage('JSON minified successfully!')
  } catch (error) {
    showMessage(`Invalid JSON: ${error.message}`, true)
  }
}

function copyToClipboard() {
  try {
    const jsonToCopy = formattedJson.value ? JSON.parse(jsonInput.value) : jsonInput.value
    navigator.clipboard.writeText(JSON.stringify(jsonToCopy, null, Number(indentSize.value)))
      .then(() => {
        showMessage('Copied to clipboard!')
      })
      .catch(err => {
        showMessage(`Failed to copy: ${err}`, true)
      })
  } catch (error) {
    showMessage(`Error copying JSON: ${error.message}`, true)
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      jsonInput.value = e.target.result
      formatAndValidate()
    }
    reader.readAsText(file)
  }
}

function saveJson() {
  try {
    const parsedJson = JSON.parse(jsonInput.value)
    const blob = new Blob([JSON.stringify(parsedJson, null, Number(indentSize.value))], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'formatted_json.json'
    link.click()
    URL.revokeObjectURL(link.href)
    showMessage('JSON file saved successfully!')
  } catch (error) {
    showMessage(`Error saving JSON: ${error.message}`, true)
  }
}
</script>

<style scoped>
.btn {
  @apply text-white font-bold py-2 px-4 rounded;
}
</style>