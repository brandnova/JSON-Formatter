<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-center">
      <h1 class="text-2xl font-bold mb-4">JSON Formatter and Validator</h1>
    </div>
    <div class="mb-4">
      <div class="flex items-center justify-center w-full mb-4">
        <label class="flex flex-col items-center px-4 py-3 bg-white text-blue-600 rounded-lg shadow-md tracking-wide uppercase border border-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="opacity-75">
            <g fill="currentColor">
              <path d="M4 2H6V4H4V2Z"/>
              <path d="M6 2H18V4H6V2Z"/>
              <path d="M6 6H18V8H6V6Z"/>
              <path d="M6 10H18V12H6V10Z"/>
              <path d="M6 14H18V16H6V14Z"/>
              <path d="M6 18H18V20H6V18Z"/>
              <path d="M4 20H6V22H4V20Z"/>
              <path d="M6 20H18V22H6V20Z"/>
              <path d="M18 2H20V4H18V2Z"/>
              <path d="M18 20H20V22H18V20Z"/>
              <path d="M20 2H22V4H20V2Z"/>
              <path d="M20 20H22V22H20V20Z"/>
              <path d="M2 4H4V20H2V4Z"/>
              <path d="M20 4H22V20H20V4Z"/>
            </g>
          </svg>
          <span class="mb-2 text-base leading-normal">Select a JSON file</span>
          <input type="file" class="hidden" @change="handleFileUpload" accept=".json,application/json" />
        </label>
      </div>

      <div ref="editorContainer" class="w-full h-96 border rounded resize-y mb-2"></div>
    </div>
    <div class="flex flex-wrap gap-2 mb-4">
      <button @click="formatAndValidate" class="btn bg-blue-500 hover:bg-blue-700">
        Format and Validate
      </button>
      <button @click="prettifyJson" class="btn bg-green-500 hover:bg-green-700">
        Prettify JSON
      </button>
      <button @click="minifyJson" class="btn bg-yellow-500 hover:bg-yellow-700">
        Minify JSON
      </button>
      <button @click="saveJson" class="btn bg-purple-500 hover:bg-purple-700">
        Save/Download
      </button>
      <button @click="copyToClipboard" class="btn bg-gray-500 hover:bg-gray-700">
        Copy to Clipboard
      </button>
      <button @click="toggleView" class="btn bg-indigo-500 hover:bg-indigo-700">
        {{ showRaw ? 'Show Formatted' : 'Show Raw' }}
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

    <!-- Custom JSON Viewer -->
    <div v-if="parsedJson" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">{{ showRaw ? 'Raw JSON:' : 'Formatted JSON:' }}</h2>
      <div v-if="!showRaw" class="bg-gray-100 p-4 rounded overflow-x-auto max-h-96">
        <div class="json-viewer">
          <json-viewer-node :node="parsedJson" :initial-depth="1"></json-viewer-node>
        </div>
      </div>
      <pre v-else class="bg-gray-100 p-4 rounded overflow-x-auto max-h-96"><code>{{ rawJson }}</code></pre>
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
import { ref, onMounted, computed } from 'vue'
import * as monaco from 'monaco-editor'

const editorContainer = ref(null)
const message = ref('')
const isError = ref(false)
const indentSize = ref('2')
const showPopup = ref(false)
const showRaw = ref(false)
const parsedJson = ref(null)
const rawJson = ref('')

let monacoEditor

onMounted(() => {
  initializeMonacoEditor()
})

function initializeMonacoEditor() {
  if (editorContainer.value) {
    monacoEditor = monaco.editor.create(editorContainer.value, {
      language: 'json',
      theme: 'vs-light',
      automaticLayout: true,
    })
  }
}

function showMessage(msg, error = false) {
  message.value = msg
  isError.value = error
  showPopup.value = true
}

function formatAndValidate() {
  try {
    const jsonValue = monacoEditor.getValue()
    const parsed = JSON.parse(jsonValue)
    parsedJson.value = parsed
    const indent = indentSize.value === 'tab' ? '\t' : Number(indentSize.value)
    rawJson.value = JSON.stringify(parsed, null, indent)
    monacoEditor.setValue(rawJson.value)
    showMessage('JSON is valid and formatted!')
  } catch (error) {
    parsedJson.value = null
    rawJson.value = ''
    showMessage(`Invalid JSON: ${error.message}`, true)
  }
}

function prettifyJson() {
  try {
    const jsonValue = monacoEditor.getValue()
    const parsed = JSON.parse(jsonValue)
    parsedJson.value = parsed
    const indent = indentSize.value === 'tab' ? '\t' : Number(indentSize.value)
    const prettifiedJson = JSON.stringify(parsed, null, indent)
    rawJson.value = prettifiedJson
    monacoEditor.setValue(prettifiedJson)
    showMessage('JSON prettified successfully!')
  } catch (error) {
    showMessage(`Invalid JSON: ${error.message}`, true)
  }
}

function minifyJson() {
  try {
    const jsonValue = monacoEditor.getValue()
    const parsed = JSON.parse(jsonValue)
    parsedJson.value = parsed
    const minifiedJson = JSON.stringify(parsed)
    rawJson.value = minifiedJson
    monacoEditor.setValue(minifiedJson)
    showMessage('JSON minified successfully!')
  } catch (error) {
    showMessage(`Invalid JSON: ${error.message}`, true)
  }
}

function copyToClipboard() {
  const jsonValue = monacoEditor.getValue()
  navigator.clipboard.writeText(jsonValue)
    .then(() => {
      showMessage('Copied to clipboard!')
    })
    .catch(err => {
      showMessage(`Failed to copy: ${err}`, true)
    })
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      monacoEditor.setValue(e.target.result)
      formatAndValidate()
    }
    reader.readAsText(file)
  }
}

function saveJson() {
  try {
    const jsonValue = monacoEditor.getValue()
    const parsed = JSON.parse(jsonValue)
    const blob = new Blob([JSON.stringify(parsed, null, Number(indentSize.value))], { type: 'application/json' })
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

function toggleView() {
  showRaw.value = !showRaw.value
}
</script>

<script>
// Custom JSON Viewer component
const JsonViewerNode = {
  name: 'JsonViewerNode',
  props: {
    node: {
      type: [Object, Array, String, Number, Boolean],
      required: true
    },
    initialDepth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      expanded: this.initialDepth > 0
    }
  },
  computed: {
    isObject() {
      return typeof this.node === 'object' && this.node !== null
    },
    isArray() {
      return Array.isArray(this.node)
    },
    isPrimitive() {
      return !this.isObject
    },
    nodeType() {
      if (this.isArray) return 'array'
      if (this.isObject) return 'object'
      return typeof this.node
    }
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded
    },
    formatPrimitive(value) {
      if (typeof value === 'string') return `"${value}"`
      return value
    }
  },
  template: `
    <div class="json-viewer-node">
      <div @click="toggle" v-if="isObject" class="cursor-pointer">
        <span class="toggle-icon">{{ expanded ? '▼' : '▶' }}</span>
        <span class="key">{{ isArray ? 'Array' : 'Object' }}</span>
        <span class="syntax">{{ isArray ? '[' : '{' }}</span>
        <span v-if="!expanded">...</span>
        <span class="syntax">{{ isArray ? ']' : '}' }}</span>
      </div>
      <div v-if="isObject && expanded" class="ml-4">
        <div v-for="(value, key) in node" :key="key" class="json-viewer-node">
          <div>
            <span class="key">{{ key }}:</span>
            <json-viewer-node :node="value" :initial-depth="initialDepth - 1"></json-viewer-node>
          </div>
        </div>
      </div>
      <span v-if="isPrimitive" :class="nodeType">{{ formatPrimitive(node) }}</span>
    </div>
  `
}
</script>

<style scoped>
.btn {
  @apply text-white font-bold py-2 px-4 rounded;
}

.json-viewer {
  font-family: monospace;
  font-size: 14px;
}

.json-viewer-node {
  margin-left: 20px;
}

.toggle-icon {
  display: inline-block;
  width: 20px;
  cursor: pointer;
}

.key {
  color: #881391;
  margin-right: 5px;
}

.syntax {
  color: #999;
}

.string {
  color: #268bd2;
}

.number {
  color: #2aa198;
}

.boolean {
  color: #cb4b16;
}

.null {
  color: #999;
}
</style>