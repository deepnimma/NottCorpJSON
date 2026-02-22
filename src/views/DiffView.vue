<template>
  <div class="diff-view" :class="{ 'theme-light': isLight }">
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
        <nav class="header-nav">
          <RouterLink to="/creator" class="nav-link">Creator</RouterLink>
          <RouterLink to="/validator" class="nav-link">Validator</RouterLink>
          <RouterLink to="/formatter" class="nav-link">Formatter</RouterLink>
          <RouterLink to="/diff" class="nav-link nav-link-active">Diff</RouterLink>
          <RouterLink to="/jsonpath" class="nav-link">JSONPath</RouterLink>
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

    <div class="diff-layout">
      <!-- Two input panes -->
      <div class="inputs-row">
        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">Original</span>
            <button class="icon-btn" @click="formatPane('a')" title="Format JSON">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
          </div>
          <div class="editor-wrap">
            <textarea v-model="textA" class="code-editor" placeholder='{ "name": "Alice", "age": 30 }' spellcheck="false" @input="clearResult"></textarea>
            <p v-if="errorA" class="parse-error">{{ errorA }}</p>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">Modified</span>
            <button class="icon-btn" @click="formatPane('b')" title="Format JSON">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
          </div>
          <div class="editor-wrap">
            <textarea v-model="textB" class="code-editor" placeholder='{ "name": "Alice", "age": 31, "city": "London" }' spellcheck="false" @input="clearResult"></textarea>
            <p v-if="errorB" class="parse-error">{{ errorB }}</p>
          </div>
        </section>
      </div>

      <!-- Compare button -->
      <div class="compare-bar">
        <button class="compare-btn" @click="compare">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3H2v10h3M11 3h3v10h-3M8 1v14M5 8l3-3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Compare
        </button>
        <span v-if="diffResult" class="diff-summary">
          <span class="summary-chip chip-added">+{{ added }} added</span>
          <span class="summary-chip chip-removed">-{{ removed }} removed</span>
          <span class="summary-chip chip-changed">~ {{ changed }} changed</span>
        </span>
      </div>

      <!-- Results -->
      <div class="result-pane">
        <!-- Identical -->
        <div v-if="diffResult && diffResult.length === 0" class="state-message state-ok">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6 10.5l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Documents are identical
        </div>

        <!-- Empty state -->
        <div v-else-if="!diffResult" class="state-message state-empty">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" opacity="0.2">
            <path d="M10 8h11l7 7v21H10z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M27 22h7l7 7v15H27z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M17 22h6M17 27h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p>Paste two JSON documents and click Compare</p>
        </div>

        <!-- Diff entries -->
        <div v-else class="diff-entries">
          <div
            v-for="(entry, i) in diffResult" :key="i"
            class="diff-entry" :class="`entry-${entry.type}`"
          >
            <div class="entry-top">
              <span class="entry-path">{{ entry.path }}</span>
              <span class="entry-badge" :class="`badge-${entry.type}`">{{ entry.type }}</span>
            </div>
            <div class="entry-values">
              <div v-if="entry.type !== 'added'" class="entry-val val-old">
                <span class="val-label">−</span>
                <span class="val-content">{{ formatVal(entry.oldVal) }}</span>
              </div>
              <div v-if="entry.type !== 'removed'" class="entry-val val-new">
                <span class="val-label">+</span>
                <span class="val-content">{{ formatVal(entry.newVal) }}</span>
              </div>
            </div>
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
const textA = ref('')
const textB = ref('')
const errorA = ref('')
const errorB = ref('')

interface DiffEntry {
  path: string
  type: 'added' | 'removed' | 'changed'
  oldVal?: unknown
  newVal?: unknown
}

const diffResult = ref<DiffEntry[] | null>(null)

const added = computed(() => diffResult.value?.filter(e => e.type === 'added').length ?? 0)
const removed = computed(() => diffResult.value?.filter(e => e.type === 'removed').length ?? 0)
const changed = computed(() => diffResult.value?.filter(e => e.type === 'changed').length ?? 0)

function tryParse(text: string, errRef: { value: string }): { ok: true; data: unknown } | { ok: false } {
  errRef.value = ''
  try {
    return { ok: true, data: JSON.parse(text) }
  } catch (e: unknown) {
    errRef.value = (e as Error).message
    return { ok: false }
  }
}

function formatPane(side: 'a' | 'b') {
  if (side === 'a') {
    const r = tryParse(textA.value, errorA)
    if (r.ok) textA.value = JSON.stringify(r.data, null, 2)
  } else {
    const r = tryParse(textB.value, errorB)
    if (r.ok) textB.value = JSON.stringify(r.data, null, 2)
  }
}

function clearResult() {
  diffResult.value = null
}

function computeDiff(a: unknown, b: unknown, path: string): DiffEntry[] {
  const entries: DiffEntry[] = []

  // Same value — no diff
  if (JSON.stringify(a) === JSON.stringify(b)) return entries

  // Different types or one is null
  const typeA = getKind(a)
  const typeB = getKind(b)
  if (typeA !== typeB) {
    entries.push({ path, type: 'changed', oldVal: a, newVal: b })
    return entries
  }

  if (typeA === 'array' && typeB === 'array') {
    const arrA = a as unknown[]
    const arrB = b as unknown[]
    const max = Math.max(arrA.length, arrB.length)
    for (let i = 0; i < max; i++) {
      const p = `${path}[${i}]`
      if (i >= arrA.length) entries.push({ path: p, type: 'added', newVal: arrB[i] })
      else if (i >= arrB.length) entries.push({ path: p, type: 'removed', oldVal: arrA[i] })
      else entries.push(...computeDiff(arrA[i], arrB[i], p))
    }
    return entries
  }

  if (typeA === 'object' && typeB === 'object') {
    const objA = a as Record<string, unknown>
    const objB = b as Record<string, unknown>
    const keys = new Set([...Object.keys(objA), ...Object.keys(objB)])
    for (const key of keys) {
      const p = `${path}.${key}`
      if (!(key in objA)) entries.push({ path: p, type: 'added', newVal: objB[key] })
      else if (!(key in objB)) entries.push({ path: p, type: 'removed', oldVal: objA[key] })
      else entries.push(...computeDiff(objA[key], objB[key], p))
    }
    return entries
  }

  // Primitives that differ
  entries.push({ path, type: 'changed', oldVal: a, newVal: b })
  return entries
}

function getKind(v: unknown): string {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

function compare() {
  const rA = tryParse(textA.value, errorA)
  const rB = tryParse(textB.value, errorB)
  if (!rA.ok || !rB.ok) return
  diffResult.value = computeDiff(rA.data, rB.data, '$')
}

function formatVal(val: unknown): string {
  if (val === undefined) return ''
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}
</script>

<style scoped>
.diff-view {
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
.diff-view.theme-light {
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
  background-size: 40px 40px;
  opacity: 0.3;
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
.diff-layout {
  position: relative; z-index: 1;
  flex: 1; display: flex; flex-direction: column;
  min-height: 0; overflow: hidden;
}

.inputs-row {
  display: grid; grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--border);
  height: 240px; flex-shrink: 0;
}
.inputs-row .panel:first-child { border-right: 1px solid var(--border); }

.panel { display: flex; flex-direction: column; min-height: 0; }
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

.editor-wrap { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.code-editor {
  flex: 1; width: 100%; min-height: 0; resize: none;
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

/* Compare bar */
.compare-bar {
  display: flex; align-items: center; gap: 14px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}
.compare-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--accent); border: 1px solid var(--accent); border-radius: 8px;
  color: #fff; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
  padding: 7px 18px; cursor: pointer;
  transition: opacity 0.15s;
}
.compare-btn:hover { opacity: 0.88; }
.diff-summary { display: flex; align-items: center; gap: 6px; }
.summary-chip {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
  padding: 3px 8px; border-radius: 4px;
}
.chip-added   { background: rgba(34, 197, 94, 0.12); color: #4ade80; }
.chip-removed { background: rgba(248, 113, 113, 0.12); color: #f87171; }
.chip-changed { background: rgba(251, 191, 36, 0.12); color: #fbbf24; }

/* Result pane */
.result-pane {
  flex: 1; overflow-y: auto; min-height: 0;
  padding: 16px 20px;
}

.state-message {
  display: flex; align-items: center; gap: 10px;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
}
.state-ok { color: #4ade80; padding: 12px 0; }
.state-empty {
  flex-direction: column; justify-content: center;
  height: 100%; color: var(--text-muted);
  font-size: 13px; gap: 12px;
}

/* Diff entries */
.diff-entries { display: flex; flex-direction: column; gap: 8px; }
.diff-entry {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; overflow: hidden;
}
.entry-added   { border-left: 3px solid #4ade80; }
.entry-removed { border-left: 3px solid #f87171; }
.entry-changed { border-left: 3px solid #fbbf24; }

.entry-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}
.entry-path {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted);
}
.entry-badge {
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  padding: 2px 7px; border-radius: 4px;
}
.badge-added   { background: rgba(34, 197, 94, 0.12); color: #4ade80; }
.badge-removed { background: rgba(248, 113, 113, 0.12); color: #f87171; }
.badge-changed { background: rgba(251, 191, 36, 0.12); color: #fbbf24; }

.entry-values { padding: 8px 12px; display: flex; flex-direction: column; gap: 4px; }
.entry-val {
  display: flex; align-items: flex-start; gap: 8px;
  font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6;
}
.val-old { color: #f87171; }
.val-new { color: #4ade80; }
.val-label { font-weight: 700; flex-shrink: 0; width: 12px; }
.val-content { word-break: break-all; }
</style>
