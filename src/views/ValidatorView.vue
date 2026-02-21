<template>
  <div class="validator" :class="{ 'theme-light': isLight }">
    <!-- Ambient background -->
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- ══ Header ══════════════════════════════════════════════ -->
    <header class="val-header">
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
          <RouterLink to="/validator" class="nav-link nav-link-active">Validator</RouterLink>
          <RouterLink to="/formatter" class="nav-link">Formatter</RouterLink>
          <RouterLink to="/diff" class="nav-link">Diff</RouterLink>
          <RouterLink to="/jsonpath" class="nav-link">JSONPath</RouterLink>
        </nav>
      </div>

      <div class="header-actions">
        <button class="theme-toggle" @click="isLight = !isLight" :title="isLight ? 'Switch to dark mode' : 'Switch to light mode'">
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

    <!-- ══ Two-pane layout ═════════════════════════════════════ -->
    <div class="val-layout">

      <!-- ── Left: Inputs ───────────────────────────────────── -->
      <div class="input-pane">

        <!-- Schema input -->
        <section class="panel">
          <div class="panel-header">
            <div class="panel-label">JSON Schema</div>
            <button class="fmt-btn" @click="formatSchema" title="Format JSON">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
          </div>
          <div class="editor-wrap">
            <textarea
              v-model="schemaText"
              class="code-editor"
              placeholder='{ "$schema": "https://json-schema.org/draft/2020-12/schema", "type": "object", "properties": { ... } }'
              spellcheck="false"
              @input="clearResult"
            ></textarea>
            <p v-if="schemaError" class="parse-error">{{ schemaError }}</p>
          </div>
        </section>

        <!-- Document input -->
        <section class="panel">
          <div class="panel-header">
            <div class="panel-label">JSON Document</div>
            <button class="fmt-btn" @click="formatDocument" title="Format JSON">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
          </div>
          <div class="editor-wrap">
            <textarea
              v-model="documentText"
              class="code-editor"
              placeholder='{ "name": "Alice", "age": 30 }'
              spellcheck="false"
              @input="clearResult"
            ></textarea>
            <p v-if="documentError" class="parse-error">{{ documentError }}</p>
          </div>
        </section>

        <button class="validate-btn" @click="validate">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8.5l4 4L14 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Validate
        </button>
      </div>

      <!-- ── Right: Results ─────────────────────────────────── -->
      <div class="result-pane">
        <div class="result-header">
          <div class="result-title-group">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="color: var(--accent)">
              <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 4v3.5l2 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            <span class="result-title">Validation Result</span>
          </div>
        </div>

        <!-- Not yet validated -->
        <div v-if="result === null" class="result-empty">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.2">
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="1.5"/>
            <path d="M16 24h16M24 16v16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p>Enter a schema and document,<br>then click <strong>Validate</strong>.</p>
        </div>

        <!-- Valid -->
        <div v-else-if="result.valid" class="result-valid">
          <div class="result-badge result-badge-pass">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="currentColor" stroke-width="1.5"/>
              <path d="M5.5 11.5l4 4 7-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Valid
          </div>
          <p class="result-msg">The document conforms to the schema.</p>
        </div>

        <!-- Invalid -->
        <div v-else class="result-invalid">
          <div class="result-badge result-badge-fail">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 7l8 8M15 7l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Invalid
          </div>
          <p class="result-msg">{{ result.errors.length }} error{{ result.errors.length !== 1 ? 's' : '' }} found.</p>

          <div class="errors-list">
            <div v-for="(err, i) in result.errors" :key="i" class="error-item">
              <div class="error-path">{{ err.path || '(root)' }}</div>
              <div class="error-msg">{{ err.message }}</div>
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

// ─── Theme ───────────────────────────────────────────────────────────────────

const isLight = ref(false)

// ─── State ───────────────────────────────────────────────────────────────────

const schemaText = ref('')
const documentText = ref('')
const schemaError = ref('')
const documentError = ref('')

interface ValidationError {
  path: string
  message: string
}

interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

const result = ref<ValidationResult | null>(null)

function clearResult() {
  result.value = null
  schemaError.value = ''
  documentError.value = ''
}

function formatSchema() {
  try {
    schemaText.value = JSON.stringify(JSON.parse(schemaText.value), null, 2)
    schemaError.value = ''
  } catch (e: unknown) {
    schemaError.value = e instanceof Error ? e.message : 'Invalid JSON'
  }
}

function formatDocument() {
  try {
    documentText.value = JSON.stringify(JSON.parse(documentText.value), null, 2)
    documentError.value = ''
  } catch (e: unknown) {
    documentError.value = e instanceof Error ? e.message : 'Invalid JSON'
  }
}

// ─── Validator ───────────────────────────────────────────────────────────────

function validateValue(
  data: unknown,
  schema: Record<string, unknown>,
  path: string,
  errors: ValidationError[],
): void {
  const type = schema.type as string | undefined

  // type check
  if (type) {
    const ok = checkType(data, type)
    if (!ok) {
      errors.push({ path, message: `Expected type "${type}", got "${getType(data)}"` })
      return // further checks make no sense
    }
  }

  // enum
  if (Array.isArray(schema.enum)) {
    const match = (schema.enum as unknown[]).some(v => JSON.stringify(v) === JSON.stringify(data))
    if (!match) {
      errors.push({ path, message: `Value must be one of: ${(schema.enum as unknown[]).map(v => JSON.stringify(v)).join(', ')}` })
    }
  }

  if (typeof data === 'string') {
    const minLen = schema.minLength as number | undefined
    const maxLen = schema.maxLength as number | undefined
    const pattern = schema.pattern as string | undefined
    if (minLen != null && data.length < minLen)
      errors.push({ path, message: `String length ${data.length} is less than minLength ${minLen}` })
    if (maxLen != null && data.length > maxLen)
      errors.push({ path, message: `String length ${data.length} exceeds maxLength ${maxLen}` })
    if (pattern) {
      try {
        if (!new RegExp(pattern).test(data))
          errors.push({ path, message: `Value does not match pattern /${pattern}/` })
      } catch {
        errors.push({ path, message: `Invalid pattern: ${pattern}` })
      }
    }
  }

  if (typeof data === 'number') {
    const min = schema.minimum as number | undefined
    const max = schema.maximum as number | undefined
    const exMin = schema.exclusiveMinimum as number | undefined
    const exMax = schema.exclusiveMaximum as number | undefined
    const multipleOf = schema.multipleOf as number | undefined
    if (min != null && data < min)
      errors.push({ path, message: `Value ${data} is less than minimum ${min}` })
    if (max != null && data > max)
      errors.push({ path, message: `Value ${data} exceeds maximum ${max}` })
    if (exMin != null && data <= exMin)
      errors.push({ path, message: `Value ${data} must be greater than ${exMin}` })
    if (exMax != null && data >= exMax)
      errors.push({ path, message: `Value ${data} must be less than ${exMax}` })
    if (multipleOf != null && data % multipleOf !== 0)
      errors.push({ path, message: `Value ${data} is not a multiple of ${multipleOf}` })
    if (type === 'integer' && !Number.isInteger(data))
      errors.push({ path, message: `Value ${data} is not an integer` })
  }

  if (Array.isArray(data)) {
    const minItems = schema.minItems as number | undefined
    const maxItems = schema.maxItems as number | undefined
    const uniqueItems = schema.uniqueItems as boolean | undefined
    const items = schema.items as Record<string, unknown> | undefined

    if (minItems != null && data.length < minItems)
      errors.push({ path, message: `Array length ${data.length} is less than minItems ${minItems}` })
    if (maxItems != null && data.length > maxItems)
      errors.push({ path, message: `Array length ${data.length} exceeds maxItems ${maxItems}` })
    if (uniqueItems) {
      const seen = new Set<string>()
      for (const item of data) {
        const key = JSON.stringify(item)
        if (seen.has(key)) {
          errors.push({ path, message: `Array items must be unique` })
          break
        }
        seen.add(key)
      }
    }
    if (items) {
      data.forEach((item, idx) => {
        validateValue(item, items, `${path}[${idx}]`, errors)
      })
    }
  }

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>
    const properties = schema.properties as Record<string, Record<string, unknown>> | undefined
    const required = schema.required as string[] | undefined

    if (required) {
      for (const key of required) {
        if (!(key in obj)) {
          errors.push({ path: path ? `${path}.${key}` : key, message: `Required property "${key}" is missing` })
        }
      }
    }

    if (properties) {
      for (const [key, subSchema] of Object.entries(properties)) {
        if (key in obj) {
          validateValue(obj[key], subSchema, path ? `${path}.${key}` : key, errors)
        }
      }
    }
  }
}

function checkType(data: unknown, type: string): boolean {
  if (type === 'null') return data === null
  if (type === 'boolean') return typeof data === 'boolean'
  if (type === 'integer') return typeof data === 'number' // full integer check done later
  if (type === 'number') return typeof data === 'number'
  if (type === 'string') return typeof data === 'string'
  if (type === 'array') return Array.isArray(data)
  if (type === 'object') return typeof data === 'object' && data !== null && !Array.isArray(data)
  return true
}

function getType(data: unknown): string {
  if (data === null) return 'null'
  if (Array.isArray(data)) return 'array'
  return typeof data
}

// ─── Run ─────────────────────────────────────────────────────────────────────

function validate() {
  schemaError.value = ''
  documentError.value = ''

  let schema: Record<string, unknown>
  let doc: unknown

  try {
    schema = JSON.parse(schemaText.value || '{}')
  } catch (e: unknown) {
    schemaError.value = e instanceof Error ? e.message : 'Invalid JSON'
    return
  }

  try {
    doc = JSON.parse(documentText.value || 'null')
  } catch (e: unknown) {
    documentError.value = e instanceof Error ? e.message : 'Invalid JSON'
    return
  }

  const errors: ValidationError[] = []
  validateValue(doc, schema, '', errors)
  result.value = { valid: errors.length === 0, errors }
}
</script>

<style scoped>
/* ─── CSS variables ──────────────────────────────────────────── */
.validator {
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
  --valid:       #22c55e;
  --valid-dim:   rgba(34, 197, 94, 0.10);
  --invalid:     #ef4444;
  --invalid-dim: rgba(239, 68, 68, 0.10);

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.validator.theme-light {
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

/* ─── Background atmosphere ─────────────────────────────────── */
.bg-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}
.theme-light .bg-glow { opacity: 0.08; }
.bg-glow-1 {
  width: 500px; height: 500px;
  top: -150px; right: -100px;
  background: radial-gradient(circle, #7f1010, transparent 70%);
}
.bg-glow-2 {
  width: 400px; height: 400px;
  bottom: -100px; left: -50px;
  background: radial-gradient(circle, #5a0a0a, transparent 70%);
}
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
}
.theme-light .bg-grid { opacity: 0.4; }

/* ─── Header ─────────────────────────────────────────────────── */
.val-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 60px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(20px);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.brand-icon { color: var(--accent); }
.brand-name {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: var(--text);
  letter-spacing: -0.01em;
}
.brand-name strong { font-weight: 800; color: var(--accent); }

.header-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.nav-link:hover { color: var(--text); background: var(--surface-2); }
.nav-link-active { color: var(--accent) !important; background: var(--accent-dim) !important; }

.header-actions { display: flex; align-items: center; gap: 10px; }
.theme-toggle {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 34px;
  transition: color 0.15s, border-color 0.15s;
}
.theme-toggle:hover { color: var(--accent); border-color: var(--accent); }

/* ─── Layout ─────────────────────────────────────────────────── */
.val-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* ─── Input pane ─────────────────────────────────────────────── */
.input-pane {
  flex: 0 0 55%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding: 24px 24px 32px;
  border-right: 1px solid var(--border);
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 8px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.panel-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.fmt-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 5px;
  color: var(--text-muted);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  padding: 4px 9px;
  transition: color 0.15s, border-color 0.15s;
}
.fmt-btn:hover { color: var(--text); border-color: var(--border-2); }

.editor-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.code-editor {
  flex: 1;
  min-height: 160px;
  background: var(--surface-2);
  border: none;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  line-height: 1.65;
  padding: 14px 16px;
  outline: none;
  resize: vertical;
  width: 100%;
}
.code-editor::placeholder { color: var(--text-muted); }

.parse-error {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  color: var(--invalid);
  padding: 8px 16px;
  background: var(--invalid-dim);
  border-top: 1px solid rgba(239, 68, 68, 0.2);
}

.validate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 9px;
  color: #ffffff;
  cursor: pointer;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 12px;
  transition: opacity 0.15s, transform 0.1s;
  flex-shrink: 0;
}
.validate-btn:hover { opacity: 0.88; }
.validate-btn:active { transform: scale(0.98); }

/* ─── Result pane ────────────────────────────────────────────── */
.result-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.result-title-group { display: flex; align-items: center; gap: 8px; }
.result-title {
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Empty state */
.result-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-muted);
  font-size: 14px;
  text-align: center;
  padding: 40px;
  line-height: 1.6;
}

/* Valid */
.result-valid {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 40px;
}

/* Invalid */
.result-invalid {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 24px;
  overflow-y: auto;
}

.result-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.01em;
  padding: 14px 24px;
  border-radius: 12px;
  width: 100%;
  justify-content: center;
}
.result-badge-pass {
  color: var(--valid);
  background: var(--valid-dim);
  border: 1px solid rgba(34, 197, 94, 0.25);
}
.result-badge-fail {
  color: var(--invalid);
  background: var(--invalid-dim);
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.result-msg {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  width: 100%;
}
.result-invalid .result-msg { text-align: left; }

.errors-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.error-item {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-left: 3px solid var(--invalid);
  border-radius: 8px;
  padding: 10px 14px;
}

.error-path {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--accent);
  margin-bottom: 4px;
}

.error-msg {
  font-size: 13px;
  color: var(--text);
  line-height: 1.4;
}
</style>
