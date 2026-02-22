<template>
  <div class="yaml-view">
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-grid"></div>
    </div>


    <div class="yaml-layout">
      <!-- Input pane -->
      <div class="input-pane">
        <section class="panel">
          <div class="panel-header">
            <span class="panel-label">{{ direction === 'json-to-yaml' ? 'JSON Input' : 'YAML Input' }}</span>
            <button v-if="direction === 'json-to-yaml'" class="icon-btn" @click="formatJson">
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
              class="dir-btn" :class="{ active: direction === 'json-to-yaml' }"
              @click="direction = 'json-to-yaml'; outputText = ''; parseError = ''"
            >JSON → YAML</button>
            <button
              class="dir-btn" :class="{ active: direction === 'yaml-to-json' }"
              @click="direction = 'yaml-to-json'; outputText = ''; parseError = ''"
            >YAML → JSON</button>
          </div>
          <button class="action-btn action-primary" @click="convert">
            <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
              <path d="M4 11h14M13 6l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Convert
          </button>
        </div>
      </div>

      <!-- Output pane -->
      <div class="output-pane">
        <div class="panel-header">
          <span class="panel-label">{{ direction === 'json-to-yaml' ? 'YAML Output' : 'JSON Output' }}</span>
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
          <pre v-if="outputText && direction === 'yaml-to-json'" class="output-pre" v-html="highlightedOutput"></pre>
          <pre v-else-if="outputText" class="output-pre yaml-out">{{ outputText }}</pre>
          <div v-else class="output-empty">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" opacity="0.2">
              <path d="M8 12h28M12 20h20M8 28h16M12 36h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>Paste {{ direction === 'json-to-yaml' ? 'JSON' : 'YAML' }} and click Convert</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import * as yaml from 'js-yaml'

const inputText = ref('')
const outputText = ref('')
const parseError = ref('')
const copied = ref(false)
type Direction = 'json-to-yaml' | 'yaml-to-json'
const direction = ref<Direction>('json-to-yaml')

const inputPlaceholder = computed(() =>
  direction.value === 'json-to-yaml'
    ? '{"name":"Alice","age":30,"address":{"city":"London","zip":"SW1A"}}'
    : 'name: Alice\nage: 30\naddress:\n  city: London\n  zip: SW1A'
)

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
    if (direction.value === 'json-to-yaml') {
      const data = JSON.parse(inputText.value)
      outputText.value = yaml.dump(data, { indent: 2, lineWidth: 80, noRefs: true })
    } else {
      const data = yaml.load(inputText.value)
      outputText.value = JSON.stringify(data, null, 2)
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
.yaml-view {
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
.yaml-layout {
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
.yaml-out { color: #a5f3fc; }
.output-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; height: 100%;
  color: var(--text-muted);
  font-family: 'DM Sans', sans-serif; font-size: 13px;
}
</style>
