<template>
  <div class="formatter">
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-grid"></div>
    </div>


    <div class="fmt-layout">
      <!-- Input pane -->
      <div class="input-pane">
        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">Input JSON</span>
            <button class="icon-btn" @click="clearAll" title="Clear">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Clear
            </button>
          </div>
          <div class="editor-wrap">
            <textarea
              v-model="inputText"
              class="code-editor"
              placeholder="Paste any JSON here — minified or formatted..."
              spellcheck="false"
            ></textarea>
            <p v-if="parseError" class="parse-error">{{ parseError }}</p>
          </div>
        </section>

        <div class="controls">
          <div class="indent-group">
            <span class="control-label">Indent</span>
            <div class="indent-options">
              <button
                v-for="opt in indentOptions" :key="String(opt.value)"
                class="indent-btn" :class="{ active: indent === opt.value }"
                @click="indent = opt.value"
              >{{ opt.label }}</button>
            </div>
          </div>
          <div class="action-row">
            <button class="action-btn action-primary" @click="format">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3h10M2 7h7M2 11h8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Format
            </button>
            <button class="action-btn" @click="minify">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M5 4l-3 3 3 3M9 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Minify
            </button>
          </div>
        </div>
      </div>

      <!-- Output pane -->
      <div class="output-pane">
        <div class="panel-header">
          <div class="panel-label-group">
            <span class="panel-label">Output</span>
            <span v-if="mode" class="mode-badge" :class="`mode-${mode}`">
              {{ mode === 'format' ? 'Formatted' : 'Minified' }}
            </span>
          </div>
          <div class="output-meta">
            <span v-if="outputStats" class="stats-chip">{{ outputStats }}</span>
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
          <pre v-if="outputText" class="output-pre" v-html="highlighted"></pre>
          <div v-else class="output-empty">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" opacity="0.2">
              <rect x="6" y="4" width="32" height="36" rx="3" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 14h20M12 20h14M12 26h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>Paste JSON and click Format or Minify</p>
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
const mode = ref<'format' | 'minify' | ''>('')
const copied = ref(false)
const indent = ref<number | string>(2)

const indentOptions = [
  { label: '2 sp', value: 2 },
  { label: '4 sp', value: 4 },
  { label: 'Tab', value: '\t' },
]

const outputStats = computed(() => {
  if (!outputText.value) return ''
  const bytes = new Blob([outputText.value]).size
  const lines = outputText.value.split('\n').length
  if (bytes < 1024) return `${bytes} B · ${lines} lines`
  return `${(bytes / 1024).toFixed(1)} KB · ${lines} lines`
})

const highlighted = computed(() => syntaxHighlight(outputText.value))

function tryParse(): { ok: true; data: unknown } | { ok: false } {
  parseError.value = ''
  try {
    return { ok: true, data: JSON.parse(inputText.value) }
  } catch (e: unknown) {
    parseError.value = (e as Error).message
    return { ok: false }
  }
}

function format() {
  const r = tryParse()
  if (!r.ok) return
  outputText.value = JSON.stringify(r.data, null, indent.value as number)
  mode.value = 'format'
}

function minify() {
  const r = tryParse()
  if (!r.ok) return
  outputText.value = JSON.stringify(r.data)
  mode.value = 'minify'
}

function clearAll() {
  inputText.value = ''
  outputText.value = ''
  parseError.value = ''
  mode.value = ''
}

async function copyOutput() {
  await navigator.clipboard.writeText(outputText.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

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
</script>

<style scoped>
.formatter {
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

/* Layout */
.fmt-layout {
  position: relative; z-index: 1;
  flex: 1; display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  min-height: 0;
  overflow: hidden;
}

.input-pane {
  display: flex; flex-direction: column;
  border-right: 1px solid var(--border);
  min-height: 0;
}

.output-pane {
  display: flex; flex-direction: column;
  min-height: 0;
}

/* Panel */
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
.panel-label-group { display: flex; align-items: center; gap: 8px; }

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
  padding: 14px 16px;
  tab-size: 2;
}
.parse-error {
  margin: 0; padding: 8px 16px;
  background: rgba(220, 38, 38, 0.08);
  border-top: 1px solid rgba(220, 38, 38, 0.2);
  color: #f87171; font-family: 'JetBrains Mono', monospace; font-size: 12px;
  flex-shrink: 0;
}

/* Controls */
.controls {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
  gap: 12px;
  flex-wrap: wrap;
}
.indent-group { display: flex; align-items: center; gap: 8px; }
.control-label { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-muted); }
.indent-options { display: flex; gap: 4px; }
.indent-btn {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 5px;
  color: var(--text-muted); font-family: 'DM Sans', sans-serif; font-size: 12px;
  padding: 3px 10px; cursor: pointer;
  transition: all 0.15s;
}
.indent-btn:hover { color: var(--text); border-color: var(--border-2); }
.indent-btn.active { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }

.action-row { display: flex; gap: 6px; }
.action-btn {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--surface-2); border: 1px solid var(--border-2); border-radius: 7px;
  color: var(--text); font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
  padding: 7px 14px; cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.action-btn:hover { border-color: var(--accent); background: var(--accent-dim); }
.action-primary {
  background: var(--accent); border-color: var(--accent); color: #fff;
}
.action-primary:hover { opacity: 0.88; background: var(--accent); }

/* Output */
.output-body {
  flex: 1; overflow: auto; min-height: 0;
  position: relative;
}
.output-pre {
  margin: 0; padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7;
  color: var(--text);
  white-space: pre; overflow: visible;
}
.output-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; height: 100%;
  color: var(--text-muted);
  font-family: 'DM Sans', sans-serif; font-size: 13px;
}
.output-meta { display: flex; align-items: center; gap: 8px; }
.stats-chip {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--text-muted); padding: 3px 7px;
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 4px;
}
.mode-badge {
  font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
  padding: 2px 7px; border-radius: 4px;
}
.mode-format { background: rgba(34, 197, 94, 0.12); color: #4ade80; }
.mode-minify { background: rgba(251, 191, 36, 0.12); color: #fbbf24; }
</style>
