<template>
  <div class="inferrer">
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-grid"></div>
    </div>


    <div class="inf-layout">
      <!-- Input pane -->
      <div class="input-pane">
        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">Input JSON</span>
            <button class="icon-btn" @click="formatInput">
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
          </div>
          <div class="editor-wrap">
            <textarea
              v-model="inputText"
              class="code-editor"
              placeholder='{"name":"Alice","age":30,"email":"alice@example.com","address":{"city":"London","zip":"SW1A 1AA"}}'
              spellcheck="false"
            ></textarea>
            <p v-if="parseError" class="parse-error">{{ parseError }}</p>
          </div>
        </section>
        <div class="controls">
          <button class="action-btn action-primary" @click="infer">
            <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
              <path d="M3 19l9-9M14 3l5 5-9.5 9.5-5-5L14 3z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Infer Schema
          </button>
        </div>
      </div>

      <!-- Output pane -->
      <div class="output-pane">
        <div class="panel-header">
          <span class="panel-label">Inferred JSON Schema</span>
          <div class="output-actions">
            <button v-if="outputText" class="icon-btn" @click="copyOutput">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.3"/>
              </svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
            <button v-if="outputText" class="icon-btn" @click="exportOutput">
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v8M4 6.5L6.5 9 9 6.5M1 10v1.5A1.5 1.5 0 002.5 13h8a1.5 1.5 0 001.5-1.5V10"
                  stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Export
            </button>
          </div>
        </div>
        <div class="output-body">
          <pre v-if="outputText" class="output-pre" v-html="highlighted"></pre>
          <div v-else class="output-empty">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" opacity="0.2">
              <path d="M6 38l18-18M28 6l10 10-19 19-10-10L28 6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Paste JSON and click Infer Schema</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const inputText = ref('')
const outputText = ref('')
const parseError = ref('')
const copied = ref(false)

// ── Inference engine ────────────────────────────────────────────
function inferType(value: unknown): Record<string, unknown> {
  if (value === null) return { type: 'null' }
  if (typeof value === 'boolean') return { type: 'boolean' }
  if (typeof value === 'number') {
    return { type: Number.isInteger(value) ? 'integer' : 'number' }
  }
  if (typeof value === 'string') {
    const s: Record<string, unknown> = { type: 'string' }
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) s.format = 'date-time'
    else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) s.format = 'date'
    else if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value)) s.format = 'uuid'
    else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) s.format = 'email'
    else if (/^https?:\/\//.test(value)) s.format = 'uri'
    return s
  }
  if (Array.isArray(value)) {
    const schema: Record<string, unknown> = { type: 'array' }
    if (value.length > 0) {
      schema.items = inferType(value[0])
    }
    return schema
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const properties: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      properties[k] = inferType(v)
    }
    const schema: Record<string, unknown> = { type: 'object', properties }
    if (Object.keys(properties).length > 0) {
      schema.required = Object.keys(properties)
    }
    return schema
  }
  return { type: 'string' }
}

function infer() {
  parseError.value = ''
  outputText.value = ''
  if (!inputText.value.trim()) {
    parseError.value = 'Please enter a JSON value to infer schema from.'
    return
  }
  try {
    const data = JSON.parse(inputText.value)
    const inferred = inferType(data)
    const schema: Record<string, unknown> = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      ...inferred,
    }
    outputText.value = JSON.stringify(schema, null, 2)
  } catch (e: unknown) {
    parseError.value = (e as Error).message
  }
}

function formatInput() {
  parseError.value = ''
  try {
    inputText.value = JSON.stringify(JSON.parse(inputText.value), null, 2)
  } catch (e: unknown) {
    parseError.value = (e as Error).message
  }
}

const highlighted = computed(() => syntaxHighlight(outputText.value))

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) return `<span style="color:#7dd3fc">${match}</span>`
          return `<span style="color:#86efac">${match}</span>`
        }
        if (/true|false/.test(match)) return `<span style="color:#c084fc">${match}</span>`
        if (/null/.test(match)) return `<span style="color:#94a3b8">${match}</span>`
        return `<span style="color:#fbbf24">${match}</span>`
      }
    )
}

async function copyOutput() {
  await navigator.clipboard.writeText(outputText.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

function exportOutput() {
  const blob = new Blob([outputText.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'inferred-schema.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.inferrer {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.bg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.bg-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
}

.page-title {
  font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
  color: var(--text-muted); letter-spacing: 0.02em;
  padding: 4px 10px; background: var(--surface-2);
  border: 1px solid var(--border); border-radius: 6px;
}
.inf-layout {
  position: relative; z-index: 1;
  flex: 1; display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0; min-height: 0; overflow: hidden;
}

.input-pane {
  display: flex; flex-direction: column;
  border-right: 1px solid var(--border);
  min-height: 0;
}
.output-pane { display: flex; flex-direction: column; min-height: 0; }

.panel { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}
.panel-label {
  font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;
}
.icon-btn {
  display: inline-flex; align-items: center; gap: 5px;
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px;
  color: var(--text-muted); font-family: 'DM Sans', sans-serif; font-size: 12px;
  padding: 4px 9px; cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.icon-btn:hover { color: var(--text); border-color: var(--border-2); }
.output-actions { display: flex; gap: 6px; }

.editor-wrap { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.code-editor {
  flex: 1; width: 100%; min-height: 0;
  background: transparent; border: none; outline: none; resize: none;
  color: var(--text); caret-color: var(--accent);
  font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7;
  padding: 14px 16px; tab-size: 2;
}
.parse-error {
  margin: 0; padding: 8px 16px;
  background: rgba(220, 38, 38, 0.08);
  border-top: 1px solid rgba(220, 38, 38, 0.2);
  color: #f87171; font-family: 'JetBrains Mono', monospace; font-size: 12px;
  flex-shrink: 0;
}

.controls {
  display: flex; align-items: center; justify-content: flex-end;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}
.action-btn {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--surface-2); border: 1px solid var(--border-2); border-radius: 7px;
  color: var(--text); font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
  padding: 7px 16px; cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.action-btn:hover { border-color: var(--accent); background: var(--accent-dim); }
.action-primary {
  background: var(--accent); border-color: var(--accent); color: #fff;
}
.action-primary:hover { opacity: 0.88; background: var(--accent); }

.output-body { flex: 1; overflow: auto; min-height: 0; position: relative; }
.output-pre {
  margin: 0; padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7;
  color: var(--text); white-space: pre; overflow: visible;
}
.output-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; height: 100%;
  color: var(--text-muted);
  font-family: 'DM Sans', sans-serif; font-size: 13px;
}
</style>
