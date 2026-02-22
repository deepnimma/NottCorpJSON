<template>
  <div class="merger" :class="{ 'theme-light': isLight }">
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-grid"></div>
    </div>

    <header class="page-header">
      <div class="header-left">
        <RouterLink to="/" class="brand">
          <svg class="brand-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L25.26 8.5V21.5L14 28L2.74 21.5V8.5L14 2Z"
              stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M14 8L19.5 11.25V17.75L14 21L8.5 17.75V11.25L14 8Z"
              fill="currentColor" opacity="0.3"/>
          </svg>
          <span class="brand-name">NottA<strong>SchemaGen</strong></span>
        </RouterLink>
        <div class="page-title">Schema Merger</div>
      </div>
      <div class="header-actions">
        <button class="theme-toggle" @click="isLight = !isLight" :title="isLight ? 'Dark mode' : 'Light mode'">
          <svg v-if="isLight" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 9.5A6 6 0 016.5 2 6.002 6.002 0 0014 9.5z"
              stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="merger-layout">
      <!-- Top: two input panes -->
      <div class="inputs-row">
        <div class="input-col">
          <div class="panel-header">
            <span class="panel-label">Schema A</span>
            <button class="icon-btn" @click="formatPane('a')">
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
          </div>
          <div class="editor-wrap">
            <textarea v-model="schemaAText" class="code-editor" placeholder='{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}' spellcheck="false"></textarea>
            <p v-if="errorA" class="parse-error">{{ errorA }}</p>
          </div>
        </div>
        <div class="input-col border-left">
          <div class="panel-header">
            <span class="panel-label">Schema B</span>
            <button class="icon-btn" @click="formatPane('b')">
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
          </div>
          <div class="editor-wrap">
            <textarea v-model="schemaBText" class="code-editor" placeholder='{"type":"object","properties":{"age":{"type":"integer"}},"required":["age"]}' spellcheck="false"></textarea>
            <p v-if="errorB" class="parse-error">{{ errorB }}</p>
          </div>
        </div>
      </div>

      <!-- Strategy bar + merge button -->
      <div class="strategy-bar">
        <div class="strategy-group">
          <span class="strategy-label">Merge strategy</span>
          <div class="strategy-options">
            <button
              v-for="opt in strategies" :key="opt.value"
              class="strategy-btn" :class="{ active: strategy === opt.value }"
              @click="strategy = opt.value"
            >{{ opt.label }}</button>
          </div>
        </div>
        <button class="action-btn action-primary" @click="merge">
          <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
            <path d="M4 5l5 6-5 6M18 5l-5 6 5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 11h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          Merge
        </button>
      </div>

      <!-- Output pane -->
      <div class="output-pane">
        <div class="panel-header">
          <span class="panel-label">Merged Schema</span>
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
              <path d="M8 10l10 12-10 12M36 10l-10 12 10 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 22h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>Paste two schemas and click Merge</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const isLight = ref(false)
const schemaAText = ref('')
const schemaBText = ref('')
const errorA = ref('')
const errorB = ref('')
const outputText = ref('')
const copied = ref(false)
type Strategy = 'allOf' | 'merge' | 'anyOf'
const strategy = ref<Strategy>('merge')

const strategies = [
  { value: 'merge' as Strategy, label: 'Merge Properties' },
  { value: 'allOf' as Strategy, label: 'allOf' },
  { value: 'anyOf' as Strategy, label: 'anyOf' },
]

function tryParse(text: string, errRef: { value: string }): Record<string, unknown> | null {
  errRef.value = ''
  try {
    const v = JSON.parse(text || '{}')
    if (typeof v !== 'object' || Array.isArray(v) || v === null) throw new Error('Expected a JSON object')
    return v as Record<string, unknown>
  } catch (e: unknown) {
    errRef.value = (e as Error).message
    return null
  }
}

function formatPane(side: 'a' | 'b') {
  const ref = side === 'a' ? schemaAText : schemaBText
  const errRef = side === 'a' ? errorA : errorB
  errRef.value = ''
  try {
    ref.value = JSON.stringify(JSON.parse(ref.value), null, 2)
  } catch (e: unknown) {
    errRef.value = (e as Error).message
  }
}

function deepMergeProps(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): Record<string, unknown> {
  const aProps = (a.properties as Record<string, unknown>) ?? {}
  const bProps = (b.properties as Record<string, unknown>) ?? {}
  const merged: Record<string, unknown> = { ...aProps }
  for (const [key, val] of Object.entries(bProps)) {
    if (key in merged) {
      const existing = merged[key]
      if (typeof existing === 'object' && typeof val === 'object' && existing !== null && val !== null) {
        merged[key] = { ...(existing as object), ...(val as object) }
      } else {
        merged[key] = val
      }
    } else {
      merged[key] = val
    }
  }
  const aReq = (a.required as string[]) ?? []
  const bReq = (b.required as string[]) ?? []
  const mergedReq = [...new Set([...aReq, ...bReq])]
  const result: Record<string, unknown> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties: merged,
  }
  if (mergedReq.length) result.required = mergedReq
  const titles = [a.title, b.title].filter(Boolean)
  if (titles.length) result.title = titles.join(' + ')
  const descs = [a.description, b.description].filter(Boolean)
  if (descs.length) result.description = descs.join(' ')
  return result
}

function merge() {
  outputText.value = ''
  const a = tryParse(schemaAText.value, errorA)
  const b = tryParse(schemaBText.value, errorB)
  if (!a || !b) return

  let result: Record<string, unknown>
  if (strategy.value === 'allOf') {
    result = { $schema: 'https://json-schema.org/draft/2020-12/schema', allOf: [a, b] }
  } else if (strategy.value === 'anyOf') {
    result = { $schema: 'https://json-schema.org/draft/2020-12/schema', anyOf: [a, b] }
  } else {
    result = deepMergeProps(a, b)
  }
  outputText.value = JSON.stringify(result, null, 2)
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
  a.download = 'merged-schema.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.merger {
  --bg:          #141414;
  --surface:     #1c1c1c;
  --surface-2:   #222222;
  --border:      #2e2e2e;
  --border-2:    #3a3a3a;
  --text:        #e8e2e2;
  --text-muted:  #6a6060;
  --accent:      #dc2626;
  --accent-dim:  rgba(220, 38, 38, 0.10);
  --accent-glow: rgba(220, 38, 38, 0.20);

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.merger.theme-light {
  --bg:         #f2f0f0;
  --surface:    #ffffff;
  --surface-2:  #f7f5f5;
  --border:     #e0d8d8;
  --border-2:   #cfc6c6;
  --text:       #1f1414;
  --text-muted: #8a7070;
  --accent:     #b91c1c;
  --accent-dim: rgba(185, 28, 28, 0.08);
  --accent-glow:rgba(185, 28, 28, 0.15);
}

.bg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.bg-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px; opacity: 0.3;
}
.theme-light .bg-grid { opacity: 0.4; }

.page-header {
  position: relative; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 56px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(20px);
  flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 20px; }
.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.brand-icon { color: var(--accent); flex-shrink: 0; }
.brand-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 400; color: var(--text); letter-spacing: -0.01em; }
.brand-name strong { font-weight: 800; color: var(--accent); }
.page-title {
  font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
  color: var(--text-muted); letter-spacing: 0.02em;
  padding: 4px 10px; background: var(--surface-2);
  border: 1px solid var(--border); border-radius: 6px;
}
.header-actions { display: flex; align-items: center; gap: 8px; }
.theme-toggle {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 7px;
  color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 32px;
  transition: color 0.15s, border-color 0.15s;
}
.theme-toggle:hover { color: var(--accent); border-color: var(--accent); }

.merger-layout {
  position: relative; z-index: 1;
  flex: 1; display: flex; flex-direction: column;
  min-height: 0; overflow: hidden;
}

.inputs-row {
  display: grid; grid-template-columns: 1fr 1fr;
  flex: 0 0 260px; min-height: 0;
  border-bottom: 1px solid var(--border);
}
.input-col { display: flex; flex-direction: column; min-height: 0; }
.border-left { border-left: 1px solid var(--border); }

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

.editor-wrap { flex: 1; display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
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

.strategy-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0; gap: 12px; flex-wrap: wrap;
}
.strategy-group { display: flex; align-items: center; gap: 10px; }
.strategy-label { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-muted); }
.strategy-options { display: flex; gap: 4px; }
.strategy-btn {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 5px;
  color: var(--text-muted); font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
  padding: 4px 12px; cursor: pointer;
  transition: all 0.15s;
}
.strategy-btn:hover { color: var(--text); border-color: var(--border-2); }
.strategy-btn.active { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }

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

.output-pane { flex: 1; display: flex; flex-direction: column; min-height: 0; }
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
