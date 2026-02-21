<template>
  <div class="jsonpath-view" :class="{ 'theme-light': isLight }">
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
        <nav class="header-nav">
          <RouterLink to="/creator" class="nav-link">Creator</RouterLink>
          <RouterLink to="/validator" class="nav-link">Validator</RouterLink>
          <RouterLink to="/formatter" class="nav-link">Formatter</RouterLink>
          <RouterLink to="/diff" class="nav-link">Diff</RouterLink>
          <RouterLink to="/jsonpath" class="nav-link nav-link-active">JSONPath</RouterLink>
        </nav>
      </div>
      <div class="header-actions">
        <button class="theme-toggle" @click="isLight = !isLight">
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

    <div class="jp-layout">
      <!-- Left: JSON input + query bar -->
      <div class="left-pane">
        <section class="panel json-panel">
          <div class="panel-header">
            <span class="panel-label">JSON Document</span>
            <button class="icon-btn" @click="formatJson">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
          </div>
          <div class="editor-wrap">
            <textarea
              v-model="jsonText"
              class="code-editor"
              placeholder='{"store":{"books":[{"title":"Moby Dick","price":8.95},{"title":"1984","price":7.99}]}}'
              spellcheck="false"
              @input="clearResults"
            ></textarea>
            <p v-if="jsonError" class="parse-error">{{ jsonError }}</p>
          </div>
        </section>

        <!-- Query bar -->
        <div class="query-bar">
          <div class="query-input-wrap">
            <span class="query-prefix">$</span>
            <input
              v-model="queryTail"
              class="query-input"
              placeholder='.store.books[*].title'
              spellcheck="false"
              @keydown.enter="runQuery"
              @input="clearResults"
            />
          </div>
          <button class="run-btn" @click="runQuery">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 2l9 5-9 5V2z" fill="currentColor"/>
            </svg>
            Run
          </button>
        </div>

        <!-- Syntax reference -->
        <div class="syntax-ref">
          <span class="ref-label">Syntax:</span>
          <code class="ref-item" @click="insertExample('$.prop')">.prop</code>
          <code class="ref-item" @click="insertExample('$[0]')">[0]</code>
          <code class="ref-item" @click="insertExample('$[*]')">[*]</code>
          <code class="ref-item" @click="insertExample('$..prop')">..</code>
          <code class="ref-item" @click="insertExample('$.a.b.c')">chaining</code>
        </div>
      </div>

      <!-- Right: Results -->
      <div class="result-pane">
        <div class="panel-header">
          <div class="panel-label-group">
            <span class="panel-label">Results</span>
            <span v-if="results !== null" class="match-count">{{ results.length }} match{{ results.length !== 1 ? 'es' : '' }}</span>
          </div>
          <button v-if="results && results.length > 0" class="icon-btn" @click="copyResults">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
              <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.3"/>
            </svg>
            {{ copied ? 'Copied!' : 'Copy all' }}
          </button>
        </div>

        <div class="result-body">
          <!-- Query error -->
          <div v-if="queryError" class="qerror">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.3"/>
              <path d="M7 4v4M7 9.5v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            {{ queryError }}
          </div>

          <!-- No matches -->
          <div v-else-if="results !== null && results.length === 0" class="state-empty">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity="0.2">
              <circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="1.5"/>
              <path d="M25 25l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 16h8M16 12v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>No matches found</p>
          </div>

          <!-- Empty initial state -->
          <div v-else-if="results === null" class="state-empty">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" opacity="0.2">
              <circle cx="20" cy="20" r="14" stroke="currentColor" stroke-width="1.5"/>
              <path d="M30 30l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>Paste JSON and enter a JSONPath expression</p>
          </div>

          <!-- Results list -->
          <div v-else class="results-list">
            <div v-for="(r, i) in results" :key="i" class="result-item">
              <div class="result-path">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M6 2l3 3-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ r.path }}
              </div>
              <pre class="result-value" v-html="highlightVal(r.value)"></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isLight = ref(false)
const jsonText = ref('')
const queryTail = ref('')
const jsonError = ref('')
const queryError = ref('')
const copied = ref(false)

interface PathResult { path: string; value: unknown }
const results = ref<PathResult[] | null>(null)

// ── JSONPath engine ─────────────────────────────────────────────

type Token =
  | { type: 'root' }
  | { type: 'child'; key: string }
  | { type: 'index'; idx: number }
  | { type: 'wildcard' }
  | { type: 'recursive'; key: string | null }

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  if (!expr.startsWith('$')) throw new Error('Expression must start with $')
  tokens.push({ type: 'root' })
  let i = 1

  while (i < expr.length) {
    if (expr[i] === '.') {
      if (expr[i + 1] === '.') {
        // Recursive descent
        i += 2
        if (i < expr.length && expr[i] === '[') {
          tokens.push({ type: 'recursive', key: null })
        } else {
          const start = i
          while (i < expr.length && /[\w_$-]/.test(expr[i])) i++
          const key = expr.slice(start, i)
          if (!key) throw new Error('Expected identifier after ..')
          tokens.push({ type: 'recursive', key })
        }
      } else {
        i++
        if (expr[i] === '*') { tokens.push({ type: 'wildcard' }); i++; continue }
        const start = i
        while (i < expr.length && /[\w_$-]/.test(expr[i])) i++
        const key = expr.slice(start, i)
        if (!key) throw new Error('Expected identifier after .')
        tokens.push({ type: 'child', key })
      }
    } else if (expr[i] === '[') {
      i++
      if (expr[i] === '*') {
        tokens.push({ type: 'wildcard' }); i++
        if (expr[i] === ']') i++
      } else if (expr[i] === '"' || expr[i] === "'") {
        const q = expr[i]; i++
        const start = i
        while (i < expr.length && expr[i] !== q) i++
        const key = expr.slice(start, i); i++ // skip closing quote
        if (expr[i] === ']') i++
        tokens.push({ type: 'child', key })
      } else {
        const start = i
        while (i < expr.length && expr[i] !== ']') i++
        const raw = expr.slice(start, i)
        if (expr[i] === ']') i++
        const idx = parseInt(raw, 10)
        if (isNaN(idx)) throw new Error(`Invalid index: ${raw}`)
        tokens.push({ type: 'index', idx })
      }
    } else {
      throw new Error(`Unexpected character: ${expr[i]}`)
    }
  }
  return tokens
}

function execute(value: unknown, tokens: Token[], ti: number, path: string): PathResult[] {
  if (ti >= tokens.length) return [{ path, value }]
  const tok = tokens[ti]
  const out: PathResult[] = []

  if (tok.type === 'root') return execute(value, tokens, ti + 1, '$')

  if (tok.type === 'child') {
    if (isObj(value) && tok.key in (value as Record<string, unknown>)) {
      const v = (value as Record<string, unknown>)[tok.key]
      out.push(...execute(v, tokens, ti + 1, `${path}.${tok.key}`))
    }
  } else if (tok.type === 'index') {
    if (Array.isArray(value)) {
      const idx = tok.idx < 0 ? value.length + tok.idx : tok.idx
      if (idx >= 0 && idx < value.length)
        out.push(...execute(value[idx], tokens, ti + 1, `${path}[${tok.idx}]`))
    }
  } else if (tok.type === 'wildcard') {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++)
        out.push(...execute(value[i], tokens, ti + 1, `${path}[${i}]`))
    } else if (isObj(value)) {
      for (const k of Object.keys(value as object))
        out.push(...execute((value as Record<string, unknown>)[k], tokens, ti + 1, `${path}.${k}`))
    }
  } else if (tok.type === 'recursive') {
    // Match current node
    if (tok.key !== null && isObj(value) && tok.key in (value as Record<string, unknown>)) {
      out.push(...execute((value as Record<string, unknown>)[tok.key], tokens, ti + 1, `${path}.${tok.key}`))
    } else if (tok.key === null) {
      out.push(...execute(value, tokens, ti + 1, path))
    }
    // Recurse into children
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++)
        out.push(...execute(value[i], tokens, ti, `${path}[${i}]`))
    } else if (isObj(value)) {
      for (const k of Object.keys(value as object))
        out.push(...execute((value as Record<string, unknown>)[k], tokens, ti, `${path}.${k}`))
    }
  }

  return out
}

function isObj(v: unknown): boolean {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function runJsonPath(data: unknown, expr: string): PathResult[] {
  const tokens = tokenize(expr)
  return execute(data, tokens, 0, '')
}

// ── Actions ─────────────────────────────────────────────────────

function formatJson() {
  jsonError.value = ''
  try {
    const data = JSON.parse(jsonText.value)
    jsonText.value = JSON.stringify(data, null, 2)
  } catch (e: unknown) {
    jsonError.value = (e as Error).message
  }
}

function clearResults() {
  results.value = null
  queryError.value = ''
}

function runQuery() {
  jsonError.value = ''
  queryError.value = ''

  let data: unknown
  try {
    data = JSON.parse(jsonText.value)
  } catch (e: unknown) {
    jsonError.value = (e as Error).message
    return
  }

  const expr = '$' + queryTail.value.replace(/^\$/, '')
  try {
    results.value = runJsonPath(data, expr)
  } catch (e: unknown) {
    queryError.value = (e as Error).message
    results.value = null
  }
}

function insertExample(expr: string) {
  queryTail.value = expr.replace(/^\$/, '')
}

async function copyResults() {
  if (!results.value) return
  const text = JSON.stringify(results.value.map(r => r.value), null, 2)
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

function highlightVal(val: unknown): string {
  const json = typeof val === 'object' ? JSON.stringify(val, null, 2) : JSON.stringify(val)
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
</script>

<style scoped>
.jsonpath-view {
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
.jsonpath-view.theme-light {
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
.header-nav { display: flex; align-items: center; gap: 2px; }
.nav-link {
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
  color: var(--text-muted); text-decoration: none;
  padding: 5px 10px; border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.nav-link:hover { color: var(--text); background: var(--surface-2); }
.nav-link-active { color: var(--accent) !important; background: var(--accent-dim) !important; }
.header-actions { display: flex; align-items: center; }
.theme-toggle {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 7px;
  color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 32px;
  transition: color 0.15s, border-color 0.15s;
}
.theme-toggle:hover { color: var(--accent); border-color: var(--accent); }

/* Layout */
.jp-layout {
  position: relative; z-index: 1;
  flex: 1; display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 0; overflow: hidden;
}

.left-pane {
  display: flex; flex-direction: column;
  border-right: 1px solid var(--border);
  min-height: 0;
}

.result-pane {
  display: flex; flex-direction: column;
  min-height: 0;
}

.panel { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.json-panel { flex: 1; }

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
.panel-label-group { display: flex; align-items: center; gap: 8px; }
.match-count {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--accent); background: var(--accent-dim);
  padding: 2px 7px; border-radius: 4px;
}

.icon-btn {
  display: inline-flex; align-items: center; gap: 5px;
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px;
  color: var(--text-muted); font-family: 'DM Sans', sans-serif; font-size: 12px;
  padding: 4px 9px; cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.icon-btn:hover { color: var(--text); border-color: var(--border-2); }

.editor-wrap { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.code-editor {
  flex: 1; width: 100%; resize: none; min-height: 0;
  background: transparent; border: none; outline: none;
  color: var(--text); caret-color: var(--accent);
  font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7;
  padding: 12px 16px;
}
.parse-error {
  margin: 0; padding: 7px 16px;
  background: rgba(220, 38, 38, 0.08);
  border-top: 1px solid rgba(220, 38, 38, 0.2);
  color: #f87171; font-family: 'JetBrains Mono', monospace; font-size: 12px;
  flex-shrink: 0;
}

/* Query bar */
.query-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}
.query-input-wrap {
  flex: 1; display: flex; align-items: center;
  background: var(--surface-2); border: 1px solid var(--border-2); border-radius: 7px;
  padding: 0 10px;
  transition: border-color 0.15s;
}
.query-input-wrap:focus-within { border-color: var(--accent); }
.query-prefix {
  font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600;
  color: var(--accent); flex-shrink: 0; margin-right: 2px;
}
.query-input {
  flex: 1; background: transparent; border: none; outline: none;
  color: var(--text); caret-color: var(--accent);
  font-family: 'JetBrains Mono', monospace; font-size: 13px;
  padding: 7px 0;
}
.run-btn {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent); border: 1px solid var(--accent); border-radius: 7px;
  color: #fff; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
  padding: 7px 16px; cursor: pointer;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.run-btn:hover { opacity: 0.88; }

/* Syntax reference */
.syntax-ref {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  padding: 8px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}
.ref-label {
  font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--text-muted);
}
.ref-item {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 4px;
  color: var(--accent); padding: 2px 6px;
  cursor: pointer; transition: border-color 0.15s;
}
.ref-item:hover { border-color: var(--accent); }

/* Result body */
.result-body {
  flex: 1; overflow-y: auto; min-height: 0;
  padding: 12px 16px;
  display: flex; flex-direction: column;
}

.qerror {
  display: flex; align-items: center; gap: 8px;
  color: #f87171; font-family: 'JetBrains Mono', monospace; font-size: 12px;
  padding: 10px 12px;
  background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 7px;
}

.state-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; color: var(--text-muted);
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  text-align: center;
}

.results-list { display: flex; flex-direction: column; gap: 8px; }
.result-item {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; overflow: hidden;
}
.result-path {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 12px;
  border-bottom: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-muted);
}
.result-value {
  margin: 0; padding: 8px 12px;
  font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.65;
  color: var(--text); overflow-x: auto; white-space: pre;
}
</style>
