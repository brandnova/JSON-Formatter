import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import MonacoEditorPlugin from 'monaco-editor-webpack-plugin'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'monaco-editor-webpack-plugin',
      config(config) {
        config.plugins.push(new MonacoEditorPlugin({
          languages: ['json']
        }))
      }
    }
  ],
  base: '/JSON-Formatter/',
})