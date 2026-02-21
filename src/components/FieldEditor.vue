<template>
  <div class="field-card" :class="`type-${field.type}`">
    <!-- ── Collapsed header ───────────────────────────────────── -->
    <div class="field-header" @click="expanded = !expanded">
      <span class="type-dot"></span>
      <span class="type-badge">{{ field.type }}</span>

      <input
        class="name-input"
        :value="field.name"
        placeholder="field_name"
        @click.stop
        @input="field.name = ($event.target as HTMLInputElement).value"
      />

      <label class="req-toggle" @click.stop>
        <input
          type="checkbox"
          :checked="field.required"
          @change="field.required = ($event.target as HTMLInputElement).checked"
        />
        <span class="req-label">req</span>
      </label>

      <button class="remove-btn" @click.stop="$emit('remove', field.id)" title="Remove field">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>

      <button class="expand-btn" :class="{ rotated: expanded }">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- ── Expanded details ───────────────────────────────────── -->
    <Transition name="expand">
      <div v-if="expanded" class="field-details">
        <!-- Type + Description -->
        <div class="detail-row two-col">
          <div class="detail-group">
            <label class="detail-label">Type</label>
            <select
              class="detail-select"
              :value="field.type"
              @change="field.type = ($event.target as HTMLSelectElement).value as any"
            >
              <option v-for="t in FIELD_TYPES" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="detail-group flex-1">
            <label class="detail-label">Description</label>
            <input
              class="detail-input"
              :value="field.description ?? ''"
              placeholder="Optional description..."
              @input="field.description = ($event.target as HTMLInputElement).value || undefined"
            />
          </div>
        </div>

        <!-- ── String constraints ── -->
        <template v-if="field.type === 'string'">
          <div class="detail-row">
            <span class="constraints-label">String constraints</span>
          </div>
          <div class="detail-row four-col">
            <div class="detail-group">
              <label class="detail-label">Min length</label>
              <input class="detail-input num" type="number" min="0"
                :value="field.minLength ?? ''"
                @input="field.minLength = numOrUndef(($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="detail-group">
              <label class="detail-label">Max length</label>
              <input class="detail-input num" type="number" min="0"
                :value="field.maxLength ?? ''"
                @input="field.maxLength = numOrUndef(($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="detail-group flex-2">
              <label class="detail-label">Pattern (regex)</label>
              <input class="detail-input" placeholder="^[a-z]+$"
                :value="field.pattern ?? ''"
                @input="field.pattern = ($event.target as HTMLInputElement).value || undefined"
              />
            </div>
          </div>
          <div class="detail-row two-col">
            <div class="detail-group">
              <label class="detail-label">Format</label>
              <select class="detail-select"
                :value="field.format ?? ''"
                @change="field.format = ($event.target as HTMLSelectElement).value || undefined"
              >
                <option value="">— none —</option>
                <option v-for="f in STRING_FORMATS" :key="f" :value="f">{{ f }}</option>
              </select>
            </div>
            <div class="detail-group flex-1">
              <label class="detail-label">Enum values (comma-separated)</label>
              <input class="detail-input"
                placeholder="value1, value2, value3"
                :value="field.enum ? field.enum.join(', ') : ''"
                @input="field.enum = parseEnum(($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </template>

        <!-- ── Number / Integer constraints ── -->
        <template v-if="field.type === 'number' || field.type === 'integer'">
          <div class="detail-row">
            <span class="constraints-label">Numeric constraints</span>
          </div>
          <div class="detail-row four-col">
            <div class="detail-group">
              <label class="detail-label">Minimum</label>
              <input class="detail-input num" type="number"
                :value="field.minimum ?? ''"
                @input="field.minimum = numOrUndef(($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="detail-group">
              <label class="detail-label">Maximum</label>
              <input class="detail-input num" type="number"
                :value="field.maximum ?? ''"
                @input="field.maximum = numOrUndef(($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="detail-group">
              <label class="detail-label">Excl. min</label>
              <input class="detail-input num" type="number"
                :value="field.exclusiveMin ?? ''"
                @input="field.exclusiveMin = numOrUndef(($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="detail-group">
              <label class="detail-label">Excl. max</label>
              <input class="detail-input num" type="number"
                :value="field.exclusiveMax ?? ''"
                @input="field.exclusiveMax = numOrUndef(($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-group" style="max-width: 200px">
              <label class="detail-label">Multiple of</label>
              <input class="detail-input num" type="number" min="0"
                :value="field.multipleOf ?? ''"
                @input="field.multipleOf = numOrUndef(($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </template>

        <!-- ── Array constraints ── -->
        <template v-if="field.type === 'array'">
          <div class="detail-row">
            <span class="constraints-label">Array constraints</span>
          </div>
          <div class="detail-row four-col">
            <div class="detail-group">
              <label class="detail-label">Items type</label>
              <select class="detail-select"
                :value="field.itemType ?? ''"
                @change="field.itemType = (($event.target as HTMLSelectElement).value as any) || undefined"
              >
                <option value="">— any —</option>
                <option v-for="t in FIELD_TYPES" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="detail-group">
              <label class="detail-label">Min items</label>
              <input class="detail-input num" type="number" min="0"
                :value="field.minItems ?? ''"
                @input="field.minItems = numOrUndef(($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="detail-group">
              <label class="detail-label">Max items</label>
              <input class="detail-input num" type="number" min="0"
                :value="field.maxItems ?? ''"
                @input="field.maxItems = numOrUndef(($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="detail-group" style="justify-content: flex-end; padding-top: 22px">
              <label class="check-label">
                <input type="checkbox"
                  :checked="field.uniqueItems"
                  @change="field.uniqueItems = ($event.target as HTMLInputElement).checked || undefined"
                />
                unique items
              </label>
            </div>
          </div>
        </template>

        <!-- ── Object navigate ── -->
        <template v-if="field.type === 'object'">
          <div class="detail-row">
            <button class="nav-into-btn" @click="$emit('navigate-into', field)">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Edit nested properties
              <span class="prop-count">({{ field.properties?.length ?? 0 }})</span>
            </button>
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FIELD_TYPES, STRING_FORMATS } from '../types/schema'
import type { SchemaField } from '../types/schema'

// field is a reactive proxy from parent — direct property mutations are intentional
defineProps<{ field: SchemaField }>()

defineEmits<{
  remove: [id: string]
  'navigate-into': [field: SchemaField]
}>()

const expanded = ref(false)

function numOrUndef(v: string): number | undefined {
  const n = Number(v)
  return v === '' || isNaN(n) ? undefined : n
}

function parseEnum(v: string): string[] | undefined {
  const parts = v.split(',').map(s => s.trim()).filter(Boolean)
  return parts.length ? parts : undefined
}
</script>

<style scoped>
/* ── Type color system ───────────────────────────────────────── */
.field-card { --type-color: #94a3b8; }
.field-card.type-string  { --type-color: #38bdf8; }
.field-card.type-number  { --type-color: #fb923c; }
.field-card.type-integer { --type-color: #f97316; }
.field-card.type-boolean { --type-color: #a78bfa; }
.field-card.type-array   { --type-color: #34d399; }
.field-card.type-object  { --type-color: #f472b6; }
.field-card.type-null    { --type-color: #6b7280; }

.field-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-left: 3px solid var(--type-color);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-card:hover {
  box-shadow: 0 0 0 1px var(--border-2);
}

/* ── Header ──────────────────────────────────────────────────── */
.field-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
}

.type-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--type-color);
  flex-shrink: 0;
}

.type-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  color: var(--type-color);
  background: color-mix(in srgb, var(--type-color) 12%, transparent);
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 56px;
  text-align: center;
}

.name-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid transparent;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  padding: 2px 4px;
  outline: none;
  transition: border-color 0.15s;
}
.name-input:focus {
  border-bottom-color: var(--accent);
}
.name-input::placeholder { color: var(--text-muted); }

.req-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  flex-shrink: 0;
}
.req-toggle input[type="checkbox"] { accent-color: var(--accent); cursor: pointer; }
.req-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.remove-btn:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.expand-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: transform 0.2s, color 0.15s;
  flex-shrink: 0;
}
.expand-btn.rotated { transform: rotate(180deg); }
.expand-btn:hover { color: var(--text); }

/* ── Details panel ───────────────────────────────────────────── */
.field-details {
  padding: 4px 14px 14px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.detail-row.two-col > * { flex: 1; min-width: 140px; }
.detail-row.four-col > * { flex: 1; min-width: 100px; }

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail-group.flex-1 { flex: 1; }
.detail-group.flex-2 { flex: 2; }

.detail-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.detail-input,
.detail-select {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  padding: 6px 10px;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}
.detail-input:focus,
.detail-select:focus { border-color: var(--accent); }
.detail-input::placeholder { color: var(--text-muted); }
.detail-input.num { width: 100%; }

.detail-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%235a6888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  cursor: pointer;
}
.detail-select option { background: var(--surface); }

.constraints-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--type-color);
  opacity: 0.8;
  padding-top: 4px;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
}
.check-label input { accent-color: var(--accent); cursor: pointer; }

.nav-into-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: color-mix(in srgb, var(--type-color) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--type-color) 30%, transparent);
  border-radius: 6px;
  color: var(--type-color);
  cursor: pointer;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 7px 14px;
  transition: background 0.15s, border-color 0.15s;
}
.nav-into-btn:hover {
  background: color-mix(in srgb, var(--type-color) 18%, transparent);
}
.prop-count {
  color: color-mix(in srgb, var(--type-color) 60%, transparent);
  font-size: 11px;
}

/* ── Expand transition ───────────────────────────────────────── */
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.22s ease, opacity 0.18s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 600px;
  opacity: 1;
}
</style>
