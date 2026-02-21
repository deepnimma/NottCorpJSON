<template>
  <div class="ts-view" :class="{ 'theme-light': isLight }">
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
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
        <div class="page-title">JSON &#8596; TypeScript</div>
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

    <div class="ts-layout">
      <div class="input-pane">
        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">{{ direction === 'json-to-ts' ? 'JSON Input' : 'TypeScript Input' }}</span>
            <button v-if="direction === 'json-to-ts'" class="icon-btn" @click="formatJson">
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
              :placeholder="inputPlaceholder"
              spellcheck="false"
            ></textarea>
            <p v-if="parseError" class="parse-error">{{ parseError }}</p>
          </div>
        </section>
        <div class="controls">
          <div class="dir-bar">
            <button
              class="dir-btn" :class="{ active: direction === 'json-to-ts' }"
              @click="direction = 'json-to-ts'; outputText = ''; parseError = ''"
            >JSON to TS</button>
            <button
              class="dir-btn" :class="{ active: direction === 'ts-to-json' }"
              @click="direction = 'ts-to-json'; outputText = ''; parseError = ''"
            >TS to JSON</button>
          </div>
          <button class="action-btn action-primary" @click="convert">
            <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
              <path d="M4 11h14M13 6l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Convert
          </button>
        </div>
      </div>

      <div class="output-pane">
        <div class="panel-header">
          <span class="panel-label">{{ direction === 'json-to-ts' ? 'TypeScript Interfaces' : 'JSON Stub' }}</span>
          <div class="output-actions">
            <button v-if="outputText" class="icon-btn" @click="copyOutput">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.3"/>
              </svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
        <div class="output-body">
          <pre v-if="outputText && direction === 'ts-to-json'" class="output-pre" v-html="highlightedOutput"></pre>
          <pre v-else-if="outputText" class="output-pre ts-out">{{ outputText }}</pre>
          <div v-else class="output-empty">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" opacity="0.2">
              <rect x="4" y="4" width="36" height="36" rx="6" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 18h10M17 18v14M26 18h8v4h-8v4h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Paste {{ direction === 'json-to-ts' ? 'JSON' : 'TypeScript interfaces' }} and click Convert</p>
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
const inputText = ref('')
const outputText = ref('')
const parseError = ref('')
const copied = ref(false)
type Direction = 'json-to-ts' | 'ts-to-json'
const direction = ref<Direction>('json-to-ts')

const inputPlaceholder = computed(() =>
  direction.value === 'json-to-ts'
    ? '{"name":"Alice","age":30,"address":{"city":"London"},"tags":["admin","user"]}'
    : 'interface Root {\n  name: string;\n  age: number;\n  active: boolean;\n}'
)

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/(^_+|_+$)/g, '')
    .replace(/(^|_)([a-zA-Z])/g, (_: string, __: string, c: string) => c.toUpperCase()) || 'Unknown'
}

function jsTypeToTs(
  value: unknown,
  key: string,
  interfaces: Map<string, string>,
  depth: number,
): string {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string') return 'string'

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const itemType = jsTypeToTs(value[0], key, interfaces, depth)
    return `${itemType}[]`
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const interfaceName = depth === 0 ? 'Root' : toPascalCase(key)
    const lines = Object.entries(obj).map(([k, v]) => {
      const propType = jsTypeToTs(v, k, interfaces, depth + 1)
      return `  ${k}: ${propType};`
    })
    interfaces.set(interfaceName, `interface ${interfaceName} {\n${lines.join('\n')}\n}`)
    return interfaceName
  }

  return 'unknown'
}

function jsonToTs(data: unknown): string {
  const interfaces = new Map<string, string>()
  jsTypeToTs(data, 'Root', interfaces, 0)
  const decls = [...interfaces.values()].reverse()
  return decls.join('\n\n')
}

function tsToJsonStub(ts: string): unknown {
  const result: Record<string, unknown> = {}
  // Parse property declarations from TypeScript interface: propName?: type
  const propPattern = /^\s*(\w+)\s*\??\s*:\s*([^;]+)/gm
  const matches = [...ts.matchAll(propPattern)]
  for (const match of matches) {
    const propName = match[1]
    const rawType = match[2].trim()
    const baseType = rawType.replace(/\[\]$/, '').split('|')[0].trim().toLowerCase()
    if (baseType === 'string') result[propName] = 'example'
    else if (baseType === 'number') result[propName] = 0
    else if (baseType === 'boolean') result[propName] = true
    else if (baseType === 'null') result[propName] = null
    else if (rawType.endsWith('[]')) result[propName] = []
    else result[propName] = null
  }
  return result
}

function formatJson() {
  parseError.value = ''
  try {
    inputText.value = JSON.stringify(JSON.parse(inputText.value), null, 2)
  } catch (e: unknown) {
    parseError.value = (e as Error).message
  }
}

function convert() {
  parseError.value = ''
  outputText.value = ''
  if (!inputText.value.trim()) {
    parseError.value = 'Please enter some input to convert.'
    return
  }
  try {
    if (direction.value === 'json-to-ts') {
      const data = JSON.parse(inputText.value)
      outputText.value = jsonToTs(data)
    } else {
      const stub = tsToJsonStub(inputText.value)
      outputText.value = JSON.stringify(stub, null, 2)
    }
  } catch (e: unknown) {
    parseError.value = (e as Error).message
  }
}

const highlightedOutput = computed(() => syntaxHighlight(outputText.value))

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
</script>

<style scoped>
.ts-view {
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
.ts-view.theme-light {
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
.bg-glow { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.18; }
.theme-light .bg-glow { opacity: 0.09; }
.bg-glow-1 { width: 600px; height: 600px; top: -200px; left: -150px; background: radial-gradient(circle, #7f1010, transparent 70%); }
.bg-glow-2 { width: 400px; height: 400px; bottom: -100px; right: -80px; background: radial-gradient(circle, #5a0a0a, transparent 70%); }
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

.ts-layout {
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
  flex-shrink: 0; gap: 12px; flex-wrap: wrap;
}
.dir-bar { display: flex; gap: 4px; }
.dir-btn {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px;
  color: var(--text-muted); font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
  padding: 5px 12px; cursor: pointer;
  transition: all 0.15s;
}
.dir-btn:hover { color: var(--text); border-color: var(--border-2); }
.dir-btn.active { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }

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
.ts-out { color: #c084fc; }
.output-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; height: 100%;
  color: var(--text-muted);
  font-family: 'DM Sans', sans-serif; font-size: 13px;
}
</style>
