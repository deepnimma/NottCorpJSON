<template>
  <div class="flattener" :class="{ 'light-mode': lightMode }">
    <div class="bg-layer">
      <div class="bg-glow-1"></div>
      <div class="bg-glow-2"></div>
      <div class="bg-grid"></div>
    </div>

    <header class="page-header">
      <div class="header-left">
        <RouterLink to="/" class="header-brand">
          <span class="brand-logo">N</span>
          <span class="brand-name">NottA<strong>Schema</strong></span>
        </RouterLink>
        <span class="page-title-chip">Flattener</span>
      </div>
      <div class="header-right">
        <button class="icon-btn" @click="lightMode = !lightMode" :title="lightMode ? 'Dark mode' : 'Light mode'">
          <svg v-if="lightMode" width="16" height="16" viewBox="0 0 22 22" fill="none">
            <path d="M11 3v2M11 17v2M3 11H1M21 11h-2M5.22 5.22 3.8 3.8M18.2 18.2l-1.42-1.42M5.22 16.78 3.8 18.2M18.2 3.8l-1.42 1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="11" cy="11" r="4" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 22 22" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </header>

    <main class="main-content">
      <!-- Controls bar -->
      <div class="controls-bar">
        <div class="dir-group">
          <button class="dir-btn" :class="{ active: direction === 'flatten' }" @click="direction = 'flatten'; run()">
            Flatten
          </button>
          <button class="dir-btn" :class="{ active: direction === 'unflatten' }" @click="direction = 'unflatten'; run()">
            Unflatten
          </button>
        </div>
        <div class="sep-group">
          <span class="sep-label">Separator</span>
          <button class="sep-btn" :class="{ active: separator === '.' }" @click="separator = '.'; run()">.</button>
          <button class="sep-btn" :class="{ active: separator === '_' }" @click="separator = '_'; run()">_</button>
          <button class="sep-btn" :class="{ active: separator === '/' }" @click="separator = '/'">/</button>
        </div>
      </div>

      <div class="panels">
        <!-- Input -->
        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">{{ direction === 'flatten' ? 'Nested JSON' : 'Flat JSON' }}</span>
            <div class="panel-actions">
              <button class="icon-btn small" @click="formatInput" title="Format JSON">
                <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                  <path d="M4 6h14M4 11h9M4 16h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M17 15l2 2-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Format
              </button>
              <button class="icon-btn small" @click="clearAll" title="Clear">Clear</button>
            </div>
          </div>
          <textarea
            class="code-editor"
            v-model="input"
            :placeholder="direction === 'flatten' ? '{\n  &quot;user&quot;: {\n    &quot;name&quot;: &quot;Alice&quot;,\n    &quot;address&quot;: {\n      &quot;city&quot;: &quot;London&quot;\n    }\n  }\n}' : '{\n  &quot;user.name&quot;: &quot;Alice&quot;,\n  &quot;user.address.city&quot;: &quot;London&quot;\n}'"
            @input="run"
            spellcheck="false"
          ></textarea>
          <div v-if="error" class="parse-error">{{ error }}</div>
        </section>

        <!-- Output -->
        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">{{ direction === 'flatten' ? 'Flat JSON' : 'Nested JSON' }}</span>
            <div class="panel-actions">
              <button class="icon-btn small" @click="copyOutput" :title="copied ? 'Copied!' : 'Copy'">
                {{ copied ? '✓ Copied' : 'Copy' }}
              </button>
              <button class="icon-btn small" @click="exportOutput" title="Export">Export</button>
            </div>
          </div>
          <pre class="output-pre" v-html="highlighted"></pre>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const lightMode = ref(false)
const direction = ref<'flatten' | 'unflatten'>('flatten')
const separator = ref('.')
const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)

// ── Flatten ──────────────────────────────────────────────────────────────────
function flattenObj(obj: unknown, prefix = '', sep: string, result: Record<string, unknown> = {}): Record<string, unknown> {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    result[prefix] = obj
    return result
  }
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}${sep}${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length > 0) {
      flattenObj(v, key, sep, result)
    } else {
      result[key] = v
    }
  }
  return result
}

// ── Unflatten ─────────────────────────────────────────────────────────────────
function unflattenObj(flat: Record<string, unknown>, sep: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(sep)
    let cur: Record<string, unknown> = result
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (cur[part] === undefined || cur[part] === null || typeof cur[part] !== 'object') {
        cur[part] = {}
      }
      cur = cur[part] as Record<string, unknown>
    }
    cur[parts[parts.length - 1]] = value
  }
  return result
}

// ── Run ───────────────────────────────────────────────────────────────────────
function run() {
  error.value = ''
  output.value = ''
  if (!input.value.trim()) return
  try {
    const parsed = JSON.parse(input.value)
    let result: unknown
    if (direction.value === 'flatten') {
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        error.value = 'Input must be a JSON object'
        return
      }
      result = flattenObj(parsed, '', separator.value)
    } else {
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        error.value = 'Input must be a flat JSON object'
        return
      }
      result = unflattenObj(parsed as Record<string, unknown>, separator.value)
    }
    output.value = JSON.stringify(result, null, 2)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

// ── Syntax highlight ──────────────────────────────────────────────────────────
const highlighted = computed(() => {
  if (!output.value) return '<span style="color:var(--text-muted)">Output will appear here…</span>'
  return output.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^"\\])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g, (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="hl-key">${match}</span>`
        return `<span class="hl-str">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span class="hl-bool">${match}</span>`
      if (/null/.test(match)) return `<span class="hl-null">${match}</span>`
      return `<span class="hl-num">${match}</span>`
    })
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatInput() {
  try {
    input.value = JSON.stringify(JSON.parse(input.value), null, 2)
    error.value = ''
  } catch {
    error.value = 'Invalid JSON'
  }
}

function clearAll() {
  input.value = ''
  output.value = ''
  error.value = ''
}

function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  })
}

function exportOutput() {
  if (!output.value) return
  const blob = new Blob([output.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = direction.value === 'flatten' ? 'flattened.json' : 'unflattened.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.flattener {
  --bg: #141414; --surface: #1c1c1c; --surface-2: #222222;
  --border: #2e2e2e; --border-2: #3a3a3a;
  --text: #e8e2e2; --text-muted: #6a6060;
  --accent: #dc2626; --accent-dim: rgba(220,38,38,0.10); --accent-glow: rgba(220,38,38,0.20);
  min-height: 100vh; display: flex; flex-direction: column;
  background: var(--bg); color: var(--text); position: relative;
}
.flattener.light-mode {
  --bg: #f2f0f0; --surface: #ffffff; --surface-2: #f7f5f5;
  --border: #e0d8d8; --border-2: #cfc6c6;
  --text: #1f1414; --text-muted: #8a7070;
  --accent: #b91c1c; --accent-dim: rgba(185,28,28,0.08); --accent-glow: rgba(185,28,28,0.15);
}

/* Background */
.bg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.bg-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 40px 40px; opacity: 0.3; }

/* Header */
.page-header { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; height: 56px; border-bottom: 1px solid var(--border); background: rgba(20,20,20,0.7); backdrop-filter: blur(12px); flex-shrink: 0; }
.flattener.light-mode .page-header { background: rgba(242,240,240,0.8); }
.header-left { display: flex; align-items: center; gap: 14px; }
.header-right { display: flex; align-items: center; gap: 8px; }
.header-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.brand-logo { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: var(--accent); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(220,38,38,0.35); border-radius: 4px; background: var(--accent-dim); flex-shrink: 0; }
.brand-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 400; color: var(--text); }
.brand-name strong { font-weight: 800; color: var(--accent); }
.page-title-chip { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-muted); background: var(--surface); border: 1px solid var(--border); border-radius: 5px; padding: 3px 8px; }

/* Main */
.main-content { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; padding: 20px 24px 24px; gap: 16px; min-height: 0; }

/* Controls */
.controls-bar { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.dir-group { display: flex; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.dir-btn { padding: 6px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: var(--text-muted); background: var(--surface); border: none; cursor: pointer; transition: color 0.15s, background 0.15s; }
.dir-btn + .dir-btn { border-left: 1px solid var(--border); }
.dir-btn.active { color: var(--accent); background: var(--accent-dim); }

.sep-group { display: flex; align-items: center; gap: 6px; }
.sep-label { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-muted); }
.sep-btn { width: 30px; height: 28px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: var(--text-muted); background: var(--surface); border: 1px solid var(--border); border-radius: 5px; cursor: pointer; transition: color 0.15s, background 0.15s, border-color 0.15s; }
.sep-btn.active { color: var(--accent); background: var(--accent-dim); border-color: rgba(220,38,38,0.35); }

/* Panels */
.panels { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; min-height: 0; }
.panel { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; min-height: 0; }
.panel-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--border); flex-shrink: 0; background: var(--surface-2); }
.panel-label { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-muted); }
.panel-actions { display: flex; align-items: center; gap: 6px; }

.code-editor { flex: 1; width: 100%; border: none; resize: none; background: transparent; color: var(--text); font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; padding: 14px; outline: none; min-height: 0; }
.code-editor::placeholder { color: var(--text-muted); }

.output-pre { flex: 1; margin: 0; padding: 14px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; overflow: auto; white-space: pre; color: var(--text); min-height: 0; }

.parse-error { padding: 8px 14px; background: rgba(220,38,38,0.12); border-top: 1px solid rgba(220,38,38,0.25); color: #f87171; font-family: 'JetBrains Mono', monospace; font-size: 12px; flex-shrink: 0; }

/* Buttons */
.icon-btn { display: flex; align-items: center; gap: 5px; padding: 5px 11px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-muted); background: transparent; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: color 0.15s, background 0.15s, border-color 0.15s; white-space: nowrap; }
.icon-btn:hover { color: var(--text); background: var(--surface-2); border-color: var(--border-2); }
.icon-btn.small { padding: 4px 9px; font-size: 11px; }

/* Syntax highlight */
:deep(.hl-key)  { color: #60a5fa; }
:deep(.hl-str)  { color: #86efac; }
:deep(.hl-num)  { color: #fbbf24; }
:deep(.hl-bool) { color: #c084fc; }
:deep(.hl-null) { color: #94a3b8; }

@media (max-width: 700px) {
  .panels { grid-template-columns: 1fr; }
}
</style>
