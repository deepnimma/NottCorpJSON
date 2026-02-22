<template>
  <div class="creator">
    <!-- Ambient background -->
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-grid"></div>
    </div>

    <!-- ══ Header ══════════════════════════════════════════════ -->

    <!-- ══ Two-pane layout ═════════════════════════════════════ -->
    <div class="gen-layout">

      <!-- ── Left: Builder ──────────────────────────────────── -->
      <div class="builder-pane">

        <!-- Schema metadata -->
        <section class="panel meta-panel">
          <div class="panel-label">Schema metadata</div>
          <div class="meta-inputs">
            <div class="meta-field">
              <label class="meta-label">Title</label>
              <input
                v-model="state.title"
                class="meta-input"
                placeholder="MySchema"
              />
            </div>
            <div class="meta-field flex-1">
              <label class="meta-label">Description</label>
              <input
                v-model="state.description"
                class="meta-input"
                placeholder="Optional schema description..."
              />
            </div>
          </div>
        </section>

        <!-- Fields section -->
        <section class="panel fields-panel">
          <div class="fields-panel-header">
            <BreadcrumbNav :crumbs="breadcrumbs" @navigate="navigateTo" />
            <span class="field-count">{{ currentFields.length }} field{{ currentFields.length !== 1 ? 's' : '' }}</span>
          </div>

          <!-- Field list -->
          <TransitionGroup name="field-list" tag="div" class="fields-list">
            <FieldEditor
              v-for="field in currentFields"
              :key="field.id"
              :field="field"
              @remove="removeField"
              @navigate-into="navigateInto"
            />
          </TransitionGroup>

          <div v-if="currentFields.length === 0" class="empty-state">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.3">
              <rect x="6" y="6" width="28" height="28" rx="4" stroke="currentColor" stroke-width="1.5"/>
              <path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>No fields yet. Add your first field below.</p>
          </div>

          <button class="add-field-btn" @click="addField">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Add Field
          </button>
        </section>
      </div>

      <!-- ── Right: Preview ─────────────────────────────────── -->
      <div class="preview-pane">
        <div class="preview-header">
          <div class="preview-title-group">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="color: var(--accent)">
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M4 5h6M4 7.5h4M4 10h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            <span class="preview-title">JSON Schema Output</span>
          </div>
          <div class="preview-actions">
            <button
              class="action-btn"
              :class="{ 'copied': wasCopied }"
              @click="copySchema"
            >
              <svg v-if="!wasCopied" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                <path d="M4 4V2.5A1.5 1.5 0 012.5 1H1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                <path d="M1 1H9.5A1.5 1.5 0 0111 2.5V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
              <svg v-else width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 7l3.5 3.5L11 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ wasCopied ? 'Copied!' : 'Copy' }}
            </button>
            <button class="action-btn" @click="exportSchema">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v8M4 6.5L6.5 9 9 6.5M1 10v1.5A1.5 1.5 0 002.5 13h8a1.5 1.5 0 001.5-1.5V10"
                  stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Export .json
            </button>
          </div>
        </div>

        <JsonPreview :schema="computedSchema" />
      </div>
    </div>

    <!-- ══ Import Modal ════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showImport" class="modal-overlay" @click.self="showImport = false">
        <div class="modal">
          <div class="modal-hdr">
            <h3 class="modal-title">Import Schema</h3>
            <button class="modal-close" @click="showImport = false">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <p class="modal-hint">Paste a JSON Schema or plain JSON object. Existing fields will be replaced.</p>
          <textarea
            v-model="importText"
            class="import-ta"
            placeholder='{ "$schema": "...", "title": "...", "properties": { ... } }'
            rows="10"
            spellcheck="false"
          ></textarea>
          <p v-if="importError" class="import-error">{{ importError }}</p>
          <div class="modal-footer">
            <button class="btn-ghost" @click="showImport = false">Cancel</button>
            <button class="btn-ghost" @click="formatImport">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              Format
            </button>
            <button class="btn-primary" @click="performImport">Import</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import FieldEditor from '../components/FieldEditor.vue'
import JsonPreview from '../components/JsonPreview.vue'
import type { SchemaField, FieldType } from '../types/schema'

// ─── Theme ───────────────────────────────────────────────────────────────────


// ─── State ───────────────────────────────────────────────────────────────────

const state = reactive<{
  title: string
  description: string
  fields: SchemaField[]
}>({
  title: '',
  description: '',
  fields: [],
})

const navPath = ref<string[]>([]) // array of field IDs navigated into

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _counter = 0
function uid() {
  return `f${++_counter}_${Math.random().toString(36).slice(2, 6)}`
}

function makeField(): SchemaField {
  return { id: uid(), name: '', type: 'string', required: false }
}

function fieldsAtPath(root: SchemaField[], path: string[]): SchemaField[] {
  let arr = root
  for (const id of path) {
    const f = arr.find(x => x.id === id)
    if (f?.properties) arr = f.properties
    else break
  }
  return arr
}

// ─── Computed ────────────────────────────────────────────────────────────────

const currentFields = computed<SchemaField[]>(() =>
  fieldsAtPath(state.fields, navPath.value)
)

const breadcrumbs = computed(() => {
  const crumbs: Array<{ label: string; index: number }> = [{ label: 'Root', index: 0 }]
  let arr = state.fields
  for (let i = 0; i < navPath.value.length; i++) {
    const f = arr.find(x => x.id === navPath.value[i])
    if (f) {
      crumbs.push({ label: f.name || 'unnamed', index: i + 1 })
      if (f.properties) arr = f.properties
    }
  }
  return crumbs
})

// ─── Schema builder ──────────────────────────────────────────────────────────

function buildFieldProps(fields: SchemaField[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const f of fields) {
    if (!f.name) continue
    out[f.name] = buildFieldDef(f)
  }
  return out
}

function buildFieldDef(f: SchemaField): Record<string, unknown> {
  const s: Record<string, unknown> = { type: f.type }
  if (f.description) s.description = f.description

  if (f.type === 'string') {
    if (f.minLength != null) s.minLength = f.minLength
    if (f.maxLength != null) s.maxLength = f.maxLength
    if (f.pattern) s.pattern = f.pattern
    if (f.format) s.format = f.format
    if (f.enum?.length) s.enum = f.enum
  } else if (f.type === 'number' || f.type === 'integer') {
    if (f.minimum != null) s.minimum = f.minimum
    if (f.maximum != null) s.maximum = f.maximum
    if (f.exclusiveMin != null) s.exclusiveMinimum = f.exclusiveMin
    if (f.exclusiveMax != null) s.exclusiveMaximum = f.exclusiveMax
    if (f.multipleOf != null) s.multipleOf = f.multipleOf
  } else if (f.type === 'array') {
    if (f.itemType) s.items = { type: f.itemType }
    if (f.minItems != null) s.minItems = f.minItems
    if (f.maxItems != null) s.maxItems = f.maxItems
    if (f.uniqueItems) s.uniqueItems = true
  } else if (f.type === 'object' && f.properties?.length) {
    s.properties = buildFieldProps(f.properties)
    const req = f.properties.filter(p => p.required && p.name).map(p => p.name)
    if (req.length) s.required = req
  }
  return s
}

const computedSchema = computed(() => {
  const schema: Record<string, unknown> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
  }
  if (state.title) schema.title = state.title
  if (state.description) schema.description = state.description

  const named = state.fields.filter(f => f.name)
  if (named.length) {
    schema.properties = buildFieldProps(state.fields)
    const req = state.fields.filter(f => f.required && f.name).map(f => f.name)
    if (req.length) schema.required = req
  }
  return schema
})

// ─── Field operations ────────────────────────────────────────────────────────

function addField() {
  currentFields.value.push(makeField())
}

function removeField(id: string) {
  const idx = currentFields.value.findIndex(f => f.id === id)
  if (idx !== -1) currentFields.value.splice(idx, 1)
}

// ─── Navigation ──────────────────────────────────────────────────────────────

function navigateInto(field: SchemaField) {
  if (!field.properties) field.properties = []
  navPath.value = [...navPath.value, field.id]
}

function navigateTo(index: number) {
  navPath.value = navPath.value.slice(0, index)
}

// ─── Import ──────────────────────────────────────────────────────────────────

const showImport = ref(false)
const importText = ref('')
const importError = ref('')

function openImport() {
  importText.value = ''
  importError.value = ''
  showImport.value = true
}

function parseProperties(
  props: Record<string, Record<string, unknown>>,
  required: string[],
): SchemaField[] {
  return Object.entries(props).map(([name, schema]) => {
    const f: SchemaField = {
      id: uid(),
      name,
      type: (schema.type as FieldType) || 'string',
      required: required.includes(name),
      description: schema.description as string | undefined,
      minLength: schema.minLength as number | undefined,
      maxLength: schema.maxLength as number | undefined,
      pattern: schema.pattern as string | undefined,
      format: schema.format as string | undefined,
      enum: schema.enum as string[] | undefined,
      minimum: schema.minimum as number | undefined,
      maximum: schema.maximum as number | undefined,
      exclusiveMin: schema.exclusiveMinimum as number | undefined,
      exclusiveMax: schema.exclusiveMaximum as number | undefined,
      multipleOf: schema.multipleOf as number | undefined,
      itemType: (schema.items as Record<string, unknown> | undefined)?.type as FieldType | undefined,
      minItems: schema.minItems as number | undefined,
      maxItems: schema.maxItems as number | undefined,
      uniqueItems: schema.uniqueItems as boolean | undefined,
      properties:
        schema.type === 'object' && schema.properties
          ? parseProperties(
              schema.properties as Record<string, Record<string, unknown>>,
              (schema.required as string[]) || [],
            )
          : undefined,
    }
    return f
  })
}

function inferFromJson(obj: Record<string, unknown>): SchemaField[] {
  return Object.entries(obj).map(([name, value]) => {
    let type: FieldType = 'string'
    if (value === null) type = 'null'
    else if (typeof value === 'boolean') type = 'boolean'
    else if (typeof value === 'number') type = Number.isInteger(value) ? 'integer' : 'number'
    else if (Array.isArray(value)) type = 'array'
    else if (typeof value === 'object') type = 'object'

    return {
      id: uid(),
      name,
      type,
      required: false,
      properties:
        type === 'object'
          ? inferFromJson(value as Record<string, unknown>)
          : undefined,
    }
  })
}

function formatImport() {
  importError.value = ''
  try {
    importText.value = JSON.stringify(JSON.parse(importText.value), null, 2)
  } catch (e: unknown) {
    importError.value = e instanceof Error ? e.message : 'Invalid JSON'
  }
}

function performImport() {
  importError.value = ''
  try {
    const parsed = JSON.parse(importText.value)
    if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
      throw new Error('Expected a JSON object')
    }

    navPath.value = []

    if (parsed.$schema || parsed.type === 'object' || parsed.properties) {
      state.title = (parsed.title as string) || ''
      state.description = (parsed.description as string) || ''
      state.fields = parsed.properties
        ? parseProperties(
            parsed.properties as Record<string, Record<string, unknown>>,
            (parsed.required as string[]) || [],
          )
        : []
    } else {
      state.title = ''
      state.description = ''
      state.fields = inferFromJson(parsed as Record<string, unknown>)
    }

    showImport.value = false
  } catch (e: unknown) {
    importError.value = e instanceof Error ? e.message : 'Invalid JSON'
  }
}

// ─── Copy / Export ───────────────────────────────────────────────────────────

const wasCopied = ref(false)

async function copySchema() {
  const json = JSON.stringify(computedSchema.value, null, 2)
  await navigator.clipboard.writeText(json)
  wasCopied.value = true
  setTimeout(() => { wasCopied.value = false }, 2000)
}

function exportSchema() {
  const json = JSON.stringify(computedSchema.value, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${state.title || 'schema'}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* ─── Creator layout ─────────────────────────────────────────── */
.creator {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ─── Background atmosphere ─────────────────────────────────── */
.bg-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
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

/* ─── Header ─────────────────────────────────────────────────── */
.brand-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hdr-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  padding: 7px 14px;
  transition: border-color 0.15s, background 0.15s;
}
.hdr-btn:hover {
  border-color: var(--border-2);
  background: var(--surface);
}

/* ─── Layout ─────────────────────────────────────────────────── */
.gen-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* ─── Builder pane ───────────────────────────────────────────── */
.builder-pane {
  flex: 0 0 58%;
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
}

.panel-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 12px 16px 0;
}

/* Meta panel */
.meta-panel { padding: 14px 16px 16px; }
.meta-inputs {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.meta-field { display: flex; flex-direction: column; gap: 4px; min-width: 180px; }
.meta-field.flex-1 { flex: 1; }
.meta-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.meta-input {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}
.meta-input:focus { border-color: var(--accent); }
.meta-input::placeholder { color: var(--text-muted); }

/* Fields panel */
.fields-panel { padding: 0; }
.fields-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 0;
  border-bottom: 1px solid var(--border);
}
.field-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  padding-bottom: 14px;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 14px 0;
  min-height: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
}

.add-field-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: calc(100% - 28px);
  margin: 12px 14px 14px;
  background: var(--accent-dim);
  border: 1px dashed color-mix(in srgb, var(--accent) 40%, transparent);
  border-radius: 8px;
  color: var(--accent);
  cursor: pointer;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 10px;
  transition: background 0.15s, border-color 0.15s;
}
.add-field-btn:hover {
  background: var(--accent-glow);
  border-color: color-mix(in srgb, var(--accent) 60%, transparent);
}

/* ─── Preview pane ───────────────────────────────────────────── */
.preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.preview-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-title {
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  padding: 6px 12px;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.action-btn:hover { border-color: var(--border-2); }
.action-btn.copied {
  border-color: #22c55e;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.08);
}

/* ─── Import Modal ───────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border-2);
  border-radius: 14px;
  width: 100%;
  max-width: 580px;
  padding: 24px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}

.modal-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  transition: color 0.15s;
}
.modal-close:hover { color: var(--text); }

.modal-hint {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 14px;
  line-height: 1.5;
}

.import-ta {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  padding: 12px 14px;
  outline: none;
  resize: vertical;
  transition: border-color 0.15s;
}
.import-ta:focus { border-color: var(--accent); }
.import-ta::placeholder { color: var(--text-muted); }

.import-error {
  margin-top: 8px;
  font-size: 12px;
  color: #ef4444;
  font-family: 'JetBrains Mono', monospace;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn-ghost {
  background: none;
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text-muted);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  padding: 8px 18px;
  transition: border-color 0.15s, color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-ghost:hover { color: var(--text); border-color: var(--border-2); }

.btn-primary {
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 7px;
  color: #ffffff;
  cursor: pointer;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 22px;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.88; }

/* ─── Transitions ────────────────────────────────────────────── */
.field-list-enter-active { transition: all 0.22s ease; }
.field-list-leave-active { transition: all 0.18s ease; position: absolute; width: calc(100% - 28px); }
.field-list-enter-from { opacity: 0; transform: translateY(-8px); }
.field-list-leave-to  { opacity: 0; transform: translateX(20px); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform 0.22s ease, opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal { transform: scale(0.95) translateY(-10px); }
.modal-leave-to .modal { transform: scale(0.95) translateY(10px); }
</style>
