<template>
  <div class="faker">
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-grid"></div>
    </div>


    <div class="faker-layout">
      <!-- Input pane -->
      <div class="input-pane">
        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">JSON Schema</span>
            <button class="icon-btn" @click="formatInput">
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
          </div>
          <div class="editor-wrap">
            <textarea
              v-model="schemaText"
              class="code-editor"
              placeholder='{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"integer","minimum":18,"maximum":80},"email":{"type":"string","format":"email"}},"required":["name","age","email"]}'
              spellcheck="false"
            ></textarea>
            <p v-if="parseError" class="parse-error">{{ parseError }}</p>
          </div>
        </section>
        <div class="controls">
          <div class="count-wrap">
            <span class="control-label">Generate</span>
            <input
              v-model.number="count"
              type="number"
              min="1"
              max="100"
              class="count-input"
            />
            <span class="control-label">item{{ count !== 1 ? 's' : '' }}</span>
          </div>
          <button class="action-btn action-primary" @click="generate">
            <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8"/>
              <circle cx="7" cy="7" r="1.8" fill="currentColor"/>
              <circle cx="15" cy="7" r="1.8" fill="currentColor"/>
              <circle cx="7" cy="15" r="1.8" fill="currentColor"/>
              <circle cx="15" cy="15" r="1.8" fill="currentColor"/>
              <circle cx="11" cy="11" r="1.8" fill="currentColor"/>
            </svg>
            Generate
          </button>
        </div>
      </div>

      <!-- Output pane -->
      <div class="output-pane">
        <div class="panel-header">
          <span class="panel-label">Fake Data Output</span>
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
              <rect x="4" y="4" width="36" height="36" rx="6" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="14" cy="14" r="3" fill="currentColor"/>
              <circle cx="30" cy="14" r="3" fill="currentColor"/>
              <circle cx="14" cy="30" r="3" fill="currentColor"/>
              <circle cx="30" cy="30" r="3" fill="currentColor"/>
              <circle cx="22" cy="22" r="3" fill="currentColor"/>
            </svg>
            <p>Paste a JSON Schema and click Generate</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const schemaText = ref('')
const parseError = ref('')
const outputText = ref('')
const count = ref(1)
const copied = ref(false)

// ── Fake data utilities ─────────────────────────────────────────
const WORDS = ['alpha','beta','delta','gamma','sigma','omega','nova','proto','meta','ultra','core','prime','axis','flux','zenith','apex']
const DOMAINS = ['example.com','test.io','mail.org','demo.net','sample.dev']
const NAMES_FIRST = ['Alice','Bob','Carol','Dave','Eve','Frank','Grace','Hank','Iris','Jack','Kate','Leo']
const NAMES_LAST = ['Smith','Jones','Williams','Brown','Taylor','Davis','Wilson','Moore','Anderson','Clark']

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}
function randPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
function randDate(): string {
  const d = new Date(Date.now() - Math.random() * 3e10)
  return d.toISOString().slice(0, 10)
}
function randDateTime(): string {
  return new Date(Date.now() - Math.random() * 3e10).toISOString()
}
function randEmail(): string {
  return `${randPick(NAMES_FIRST).toLowerCase()}.${randPick(NAMES_LAST).toLowerCase()}@${randPick(DOMAINS)}`
}
function randUri(): string {
  return `https://${randPick(DOMAINS)}/${randPick(WORDS)}/${randInt(1, 999)}`
}
function randHostname(): string {
  return `${randPick(WORDS)}.${randPick(DOMAINS)}`
}
function randIPv4(): string {
  return `${randInt(1,255)}.${randInt(0,255)}.${randInt(0,255)}.${randInt(0,255)}`
}

function randString(schema: Record<string, unknown>): string {
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return String(randPick(schema.enum as string[]))
  }
  const fmt = schema.format as string | undefined
  if (fmt === 'email') return randEmail()
  if (fmt === 'uuid') return randUUID()
  if (fmt === 'date') return randDate()
  if (fmt === 'date-time') return randDateTime()
  if (fmt === 'uri') return randUri()
  if (fmt === 'hostname') return randHostname()
  if (fmt === 'ipv4') return randIPv4()

  const min = (schema.minLength as number | undefined) ?? 4
  const max = (schema.maxLength as number | undefined) ?? 12
  const len = randInt(min, Math.max(min, max))
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let result = chars[randInt(0, chars.length - 1)]
  for (let i = 1; i < len; i++) result += chars[randInt(0, chars.length - 1)]
  return result
}

function generateValue(schema: Record<string, unknown>): unknown {
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return randPick(schema.enum as unknown[])
  }

  const type = schema.type as string | undefined

  if (type === 'string') return randString(schema)

  if (type === 'number') {
    const min = (schema.minimum as number | undefined) ?? 0
    const max = (schema.maximum as number | undefined) ?? 1000
    const mOf = schema.multipleOf as number | undefined
    let v = Math.round(randFloat(min, max) * 100) / 100
    if (mOf) v = Math.round(v / mOf) * mOf
    return v
  }

  if (type === 'integer') {
    const min = (schema.minimum as number | undefined) ?? 0
    const max = (schema.maximum as number | undefined) ?? 1000
    const mOf = schema.multipleOf as number | undefined
    let v = randInt(min, max)
    if (mOf) v = Math.round(v / mOf) * mOf
    return v
  }

  if (type === 'boolean') return Math.random() < 0.5

  if (type === 'null') return null

  if (type === 'array') {
    const minItems = (schema.minItems as number | undefined) ?? 1
    const maxItems = (schema.maxItems as number | undefined) ?? 3
    const len = randInt(minItems, Math.max(minItems, maxItems))
    const itemSchema = (schema.items as Record<string, unknown> | undefined) ?? { type: 'string' }
    return Array.from({ length: len }, () => generateValue(itemSchema))
  }

  if (type === 'object') {
    const props = (schema.properties as Record<string, Record<string, unknown>> | undefined) ?? {}
    const required = (schema.required as string[] | undefined) ?? Object.keys(props)
    const out: Record<string, unknown> = {}
    for (const key of required) {
      if (key in props) out[key] = generateValue(props[key])
    }
    // 50% chance for optional props
    for (const [key, propSchema] of Object.entries(props)) {
      if (!(key in out) && Math.random() > 0.5) {
        out[key] = generateValue(propSchema)
      }
    }
    return out
  }

  // Fallback: treat as string
  return randString({})
}

function generate() {
  parseError.value = ''
  outputText.value = ''
  if (!schemaText.value.trim()) {
    parseError.value = 'Please enter a JSON Schema.'
    return
  }
  try {
    const schema = JSON.parse(schemaText.value) as Record<string, unknown>
    const n = Math.min(100, Math.max(1, count.value || 1))
    const results = Array.from({ length: n }, () => generateValue(schema))
    outputText.value = JSON.stringify(n === 1 ? results[0] : results, null, 2)
  } catch (e: unknown) {
    parseError.value = (e as Error).message
  }
}

function formatInput() {
  parseError.value = ''
  try {
    schemaText.value = JSON.stringify(JSON.parse(schemaText.value), null, 2)
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
  a.download = 'fake-data.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.faker {
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
  background-size: 40px 40px; opacity: 0.3;
}

.page-title {
  font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
  color: var(--text-muted); letter-spacing: 0.02em;
  padding: 4px 10px; background: var(--surface-2);
  border: 1px solid var(--border); border-radius: 6px;
}
.faker-layout {
  position: relative; z-index: 1;
  flex: 1; display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0; min-height: 0; overflow: hidden;
}

.input-pane { display: flex; flex-direction: column; border-right: 1px solid var(--border); min-height: 0; }
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
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0; gap: 12px;
}
.count-wrap { display: flex; align-items: center; gap: 8px; }
.control-label { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-muted); }
.count-input {
  width: 64px;
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px;
  color: var(--text); font-family: 'JetBrains Mono', monospace; font-size: 13px;
  padding: 4px 8px; outline: none; text-align: center;
  transition: border-color 0.15s;
}
.count-input:focus { border-color: var(--accent); }

.action-btn {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--surface-2); border: 1px solid var(--border-2); border-radius: 7px;
  color: var(--text); font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
  padding: 7px 16px; cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.action-btn:hover { border-color: var(--accent); background: var(--accent-dim); }
.action-primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.action-primary:hover { opacity: 0.88; background: var(--accent); }

.output-body { flex: 1; overflow: auto; min-height: 0; }
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
