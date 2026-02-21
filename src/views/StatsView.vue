<template>
  <div class="stats-view" :class="{ 'theme-light': isLight }">
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
      <div class="bg-grid"></div>
    </div>

    <header class="page-header">
      <div class="header-left">
        <RouterLink to="/" class="brand">
          <svg class="brand-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L25.26 8.5V21.5L14 28L2.74 21.5V8.5L14 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M14 8L19.5 11.25V17.75L14 21L8.5 17.75V11.25L14 8Z" fill="currentColor" opacity="0.3"/>
          </svg>
          <span class="brand-name">NottA<strong>SchemaGen</strong></span>
        </RouterLink>
        <div class="page-title">JSON Stats / Analyzer</div>
      </div>
      <div class="header-actions">
        <button class="theme-toggle" @click="isLight = !isLight" :title="isLight ? 'Dark mode' : 'Light mode'">
          <svg v-if="isLight" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 9.5A6 6 0 016.5 2 6.002 6.002 0 0014 9.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="stats-layout">
      <!-- Input pane -->
      <div class="input-pane">
        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">JSON Input</span>
            <div class="header-btns">
              <button class="icon-btn" @click="formatInput">
                <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                  <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
                Format
              </button>
              <button class="icon-btn" @click="clear">
                <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                  <path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Clear
              </button>
            </div>
          </div>
          <div class="editor-wrap">
            <textarea
              v-model="inputText"
              class="code-editor"
              placeholder='{"name":"Alice","age":30,"address":{"city":"London","zip":"SW1A"},"tags":["admin","user"],"active":true}'
              spellcheck="false"
              @input="analyze"
            ></textarea>
            <p v-if="parseError" class="parse-error">{{ parseError }}</p>
          </div>
        </section>
      </div>

      <!-- Stats pane -->
      <div class="output-pane">
        <div class="panel-header">
          <span class="panel-label">Analysis Report</span>
          <button v-if="stats" class="icon-btn" @click="copyReport">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
              <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.3"/>
            </svg>
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <div class="output-body">
          <div v-if="stats" class="report">

            <!-- Size section -->
            <div class="report-section">
              <div class="section-title">Size</div>
              <div class="stat-grid">
                <div class="stat-card">
                  <div class="stat-value">{{ stats.bytes }}</div>
                  <div class="stat-label">Bytes</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.lines }}</div>
                  <div class="stat-label">Lines (formatted)</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.chars }}</div>
                  <div class="stat-label">Characters</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.minifiedBytes }}</div>
                  <div class="stat-label">Minified bytes</div>
                </div>
              </div>
            </div>

            <!-- Structure section -->
            <div class="report-section">
              <div class="section-title">Structure</div>
              <div class="stat-grid">
                <div class="stat-card">
                  <div class="stat-value">{{ stats.depth }}</div>
                  <div class="stat-label">Max depth</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.totalKeys }}</div>
                  <div class="stat-label">Total keys</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.uniqueKeys }}</div>
                  <div class="stat-label">Unique key names</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.totalValues }}</div>
                  <div class="stat-label">Total values</div>
                </div>
              </div>
            </div>

            <!-- Types section -->
            <div class="report-section">
              <div class="section-title">Type Breakdown</div>
              <div class="types-list">
                <div
                  v-for="(count, type) in stats.typeCounts"
                  :key="type"
                  class="type-row"
                  v-show="count > 0"
                >
                  <div class="type-dot" :class="`type-${type}`"></div>
                  <span class="type-name">{{ type }}</span>
                  <div class="type-bar-wrap">
                    <div class="type-bar" :style="{ width: barWidth(count, stats.totalValues) + '%' }"></div>
                  </div>
                  <span class="type-count">{{ count }}</span>
                  <span class="type-pct">{{ pct(count, stats.totalValues) }}%</span>
                </div>
              </div>
            </div>

            <!-- Arrays section -->
            <div class="report-section" v-if="stats.arrayCount > 0">
              <div class="section-title">Arrays</div>
              <div class="stat-grid">
                <div class="stat-card">
                  <div class="stat-value">{{ stats.arrayCount }}</div>
                  <div class="stat-label">Array nodes</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.totalArrayItems }}</div>
                  <div class="stat-label">Total items</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.maxArrayLen }}</div>
                  <div class="stat-label">Longest array</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.avgArrayLen }}</div>
                  <div class="stat-label">Avg length</div>
                </div>
              </div>
            </div>

            <!-- Strings section -->
            <div class="report-section" v-if="stats.typeCounts.string > 0">
              <div class="section-title">Strings</div>
              <div class="stat-grid">
                <div class="stat-card">
                  <div class="stat-value">{{ stats.avgStrLen }}</div>
                  <div class="stat-label">Avg length</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.maxStrLen }}</div>
                  <div class="stat-label">Max length</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.emptyStrings }}</div>
                  <div class="stat-label">Empty strings</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ stats.nullCount }}</div>
                  <div class="stat-label">Null values</div>
                </div>
              </div>
            </div>

            <!-- Top keys -->
            <div class="report-section" v-if="stats.topKeys.length > 0">
              <div class="section-title">Most Frequent Keys</div>
              <div class="top-keys">
                <div v-for="kv in stats.topKeys" :key="kv.key" class="key-row">
                  <code class="key-name">{{ kv.key }}</code>
                  <div class="key-bar-wrap">
                    <div class="key-bar" :style="{ width: barWidth(kv.count, stats.topKeys[0].count) + '%' }"></div>
                  </div>
                  <span class="key-count">{{ kv.count }}</span>
                </div>
              </div>
            </div>

          </div>
          <div v-else class="output-empty">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" opacity="0.2">
              <path d="M4 38V24M12 38V16M20 38V20M28 38V10M36 38H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Paste JSON to see analysis</p>
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
const inputText = ref('')
const parseError = ref('')
const copied = ref(false)

interface Stats {
  bytes: number
  minifiedBytes: number
  chars: number
  lines: number
  depth: number
  totalKeys: number
  uniqueKeys: number
  totalValues: number
  nullCount: number
  arrayCount: number
  totalArrayItems: number
  maxArrayLen: number
  avgArrayLen: string
  avgStrLen: string
  maxStrLen: number
  emptyStrings: number
  typeCounts: Record<string, number>
  topKeys: { key: string; count: number }[]
}

const stats = ref<Stats | null>(null)

function getDepth(val: unknown): number {
  if (val === null || typeof val !== 'object') return 0
  if (Array.isArray(val)) {
    if (val.length === 0) return 1
    return 1 + Math.max(...val.map(getDepth))
  }
  const obj = val as Record<string, unknown>
  const keys = Object.keys(obj)
  if (keys.length === 0) return 1
  return 1 + Math.max(...keys.map(k => getDepth(obj[k])))
}

function walk(
  val: unknown,
  keyFreq: Map<string, number>,
  tc: Record<string, number>,
  strLens: number[],
  arrayLens: number[],
) {
  if (val === null) { tc.null = (tc.null || 0) + 1; return }
  const t = typeof val
  if (t === 'boolean') { tc.boolean = (tc.boolean || 0) + 1; return }
  if (t === 'number') {
    const k = Number.isInteger(val as number) ? 'integer' : 'number'
    tc[k] = (tc[k] || 0) + 1
    return
  }
  if (t === 'string') {
    tc.string = (tc.string || 0) + 1
    strLens.push((val as string).length)
    return
  }
  if (Array.isArray(val)) {
    tc.array = (tc.array || 0) + 1
    arrayLens.push(val.length)
    for (const item of val) walk(item, keyFreq, tc, strLens, arrayLens)
    return
  }
  if (t === 'object') {
    tc.object = (tc.object || 0) + 1
    const obj = val as Record<string, unknown>
    for (const [k, v] of Object.entries(obj)) {
      keyFreq.set(k, (keyFreq.get(k) ?? 0) + 1)
      walk(v, keyFreq, tc, strLens, arrayLens)
    }
  }
}

function countTotalKeys(val: unknown): number {
  if (val === null || typeof val !== 'object') return 0
  if (Array.isArray(val)) return val.reduce((s, i) => s + countTotalKeys(i), 0)
  const obj = val as Record<string, unknown>
  return Object.keys(obj).length + Object.values(obj).reduce((s: number, v) => s + countTotalKeys(v), 0)
}

function analyze() {
  parseError.value = ''
  stats.value = null
  if (!inputText.value.trim()) return
  try {
    const data = JSON.parse(inputText.value)
    const minified = JSON.stringify(data)
    const formatted = JSON.stringify(data, null, 2)

    const keyFreq = new Map<string, number>()
    const typeCounts: Record<string, number> = {}
    const strLens: number[] = []
    const arrayLens: number[] = []

    walk(data, keyFreq, typeCounts, strLens, arrayLens)

    const totalValues = Object.values(typeCounts).reduce((a, b) => a + b, 0)
    const totalKeys = countTotalKeys(data)

    const sortedKeys = [...keyFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([key, count]) => ({ key, count }))

    const avgStr = strLens.length
      ? (strLens.reduce((a, b) => a + b, 0) / strLens.length).toFixed(1)
      : '—'
    const avgArr = arrayLens.length
      ? (arrayLens.reduce((a, b) => a + b, 0) / arrayLens.length).toFixed(1)
      : '—'

    stats.value = {
      bytes: new Blob([inputText.value]).size,
      minifiedBytes: new Blob([minified]).size,
      chars: inputText.value.length,
      lines: formatted.split('\n').length,
      depth: getDepth(data),
      totalKeys,
      uniqueKeys: keyFreq.size,
      totalValues,
      nullCount: typeCounts.null ?? 0,
      arrayCount: typeCounts.array ?? 0,
      totalArrayItems: arrayLens.reduce((a, b) => a + b, 0),
      maxArrayLen: arrayLens.length ? Math.max(...arrayLens) : 0,
      avgArrayLen: avgArr,
      avgStrLen: avgStr,
      maxStrLen: strLens.length ? Math.max(...strLens) : 0,
      emptyStrings: strLens.filter(l => l === 0).length,
      typeCounts,
      topKeys: sortedKeys,
    }
  } catch (e: unknown) {
    parseError.value = (e as Error).message
  }
}

function formatInput() {
  parseError.value = ''
  try {
    inputText.value = JSON.stringify(JSON.parse(inputText.value), null, 2)
    analyze()
  } catch (e: unknown) {
    parseError.value = (e as Error).message
  }
}

function clear() {
  inputText.value = ''
  parseError.value = ''
  stats.value = null
}

function pct(n: number, total: number): string {
  if (!total) return '0'
  return ((n / total) * 100).toFixed(1)
}

function barWidth(n: number, max: number): number {
  if (!max) return 0
  return Math.max(2, (n / max) * 100)
}

function buildReport(): string {
  if (!stats.value) return ''
  const s = stats.value
  const lines = [
    '=== JSON Analysis Report ===',
    '',
    '── Size ──',
    `  Input bytes:     ${s.bytes}`,
    `  Minified bytes:  ${s.minifiedBytes}`,
    `  Characters:      ${s.chars}`,
    `  Lines (fmt):     ${s.lines}`,
    '',
    '── Structure ──',
    `  Max depth:       ${s.depth}`,
    `  Total keys:      ${s.totalKeys}`,
    `  Unique key names:${s.uniqueKeys}`,
    `  Total values:    ${s.totalValues}`,
    '',
    '── Type Breakdown ──',
    ...Object.entries(s.typeCounts)
      .filter(([, c]) => c > 0)
      .map(([t, c]) => `  ${t.padEnd(12)} ${c}  (${pct(c, s.totalValues)}%)`),
    '',
    '── Most Frequent Keys ──',
    ...s.topKeys.map(kv => `  ${kv.key.padEnd(20)} ${kv.count}`),
  ]
  return lines.join('\n')
}

async function copyReport() {
  await navigator.clipboard.writeText(buildReport())
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<style scoped>
.stats-view {
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
.stats-view.theme-light {
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

.stats-layout {
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
.header-btns { display: flex; gap: 6px; }
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

/* Report */
.output-body { flex: 1; overflow-y: auto; min-height: 0; }
.report { padding: 16px; display: flex; flex-direction: column; gap: 20px; }

.report-section {}
.section-title {
  font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 10px;
}

.stat-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
}
.stat-card {
  background: var(--surface-2); border: 1px solid var(--border);
  border-radius: 8px; padding: 10px 12px;
}
.stat-value {
  font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
  color: var(--text); line-height: 1.1;
}
.stat-label {
  font-family: 'DM Sans', sans-serif; font-size: 11px;
  color: var(--text-muted); margin-top: 3px;
}

/* Types */
.types-list { display: flex; flex-direction: column; gap: 6px; }
.type-row {
  display: flex; align-items: center; gap: 8px;
}
.type-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.type-dot.type-string  { background: #86efac; }
.type-dot.type-number  { background: #fbbf24; }
.type-dot.type-integer { background: #fb923c; }
.type-dot.type-boolean { background: #c084fc; }
.type-dot.type-null    { background: #94a3b8; }
.type-dot.type-object  { background: #7dd3fc; }
.type-dot.type-array   { background: #f472b6; }
.type-name {
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
  color: var(--text); width: 56px; flex-shrink: 0;
}
.type-bar-wrap {
  flex: 1; height: 6px; background: var(--surface-2);
  border-radius: 3px; overflow: hidden;
}
.type-bar { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.3s; }
.type-count {
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
  color: var(--text); width: 32px; text-align: right; flex-shrink: 0;
}
.type-pct {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--text-muted); width: 40px; text-align: right; flex-shrink: 0;
}

/* Top keys */
.top-keys { display: flex; flex-direction: column; gap: 5px; }
.key-row { display: flex; align-items: center; gap: 8px; }
.key-name {
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
  color: #7dd3fc; width: 120px; flex-shrink: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.key-bar-wrap {
  flex: 1; height: 5px; background: var(--surface-2);
  border-radius: 3px; overflow: hidden;
}
.key-bar { height: 100%; background: var(--accent-glow); border: 1px solid var(--accent); border-radius: 3px; transition: width 0.3s; }
.key-count {
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
  color: var(--text-muted); flex-shrink: 0;
}

.output-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; height: 100%;
  color: var(--text-muted);
  font-family: 'DM Sans', sans-serif; font-size: 13px;
}
</style>
