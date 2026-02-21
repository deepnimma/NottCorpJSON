<template>
  <div class="home" :class="{ 'theme-light': isLight }">
    <div class="bg-layer" aria-hidden="true">
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
      <div class="bg-grid"></div>
    </div>

    <header class="home-header">
      <div class="brand">
        <svg class="brand-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L25.26 8.5V21.5L14 28L2.74 21.5V8.5L14 2Z"
            stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path d="M14 8L19.5 11.25V17.75L14 21L8.5 17.75V11.25L14 8Z"
            fill="currentColor" opacity="0.3"/>
        </svg>
        <span class="brand-name">NottA<strong>SchemaGen</strong></span>
      </div>
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
    </header>

    <main class="hero">
      <p class="hero-eyebrow">JSON Utilities</p>
      <h1 class="hero-title">The JSON Toolset</h1>
      <p class="hero-sub">Schema creation, inference, merging, validation, formatting, diffing, and conversion — all in one place.</p>

      <div class="tool-grid">
        <RouterLink to="/creator" class="tool-card tool-schema">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 8h8M7 11h5M7 14h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="16" cy="14" r="3" fill="currentColor" opacity="0.3"/>
              <path d="M15 14l1 1 2-2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">Creator</span>
              <span class="tool-tag">Schema</span>
            </div>
            <p class="tool-desc">Build JSON Schema definitions visually, field-by-field, with full type support.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/validator" class="tool-card tool-validate">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 11.5l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">Validator</span>
              <span class="tool-tag">Schema</span>
            </div>
            <p class="tool-desc">Validate any JSON document against a JSON Schema and see detailed error paths.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/formatter" class="tool-card tool-format">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 6h14M4 11h9M4 16h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M17 15l2 2-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">Formatter</span>
              <span class="tool-tag">Format</span>
            </div>
            <p class="tool-desc">Prettify or minify JSON with configurable indentation. Instant syntax highlighting.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/diff" class="tool-card tool-diff">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="4" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <rect x="12" y="4" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M5 9h2M5 12h4M14 9h4M14 12h2M14 15h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">Diff</span>
              <span class="tool-tag">Compare</span>
            </div>
            <p class="tool-desc">Compare two JSON documents and see exactly what was added, removed, or changed.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/jsonpath" class="tool-card tool-path">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 11h8M12 8l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="7" cy="11" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">JSONPath</span>
              <span class="tool-tag">Query</span>
            </div>
            <p class="tool-desc">Query JSON with JSONPath expressions. Supports wildcards, recursive descent, and indexing.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/inferrer" class="tool-card tool-infer">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 19l9-9M14 3l5 5-9.5 9.5-5-5L14 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 2l2 2M19 5l1-1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">Inferrer</span>
              <span class="tool-tag">Schema</span>
            </div>
            <p class="tool-desc">Paste any JSON object and get an inferred JSON Schema with detected types instantly.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/merger" class="tool-card tool-merge">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 5l5 6-5 6M18 5l-5 6 5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">Merger</span>
              <span class="tool-tag">Schema</span>
            </div>
            <p class="tool-desc">Merge two JSON Schemas via allOf wrapping, deep property merge, or anyOf composition.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/faker" class="tool-card tool-fake">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="7" r="1.5" fill="currentColor"/>
              <circle cx="7" cy="15" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="15" r="1.5" fill="currentColor"/>
              <circle cx="11" cy="11" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">Faker</span>
              <span class="tool-tag">Schema</span>
            </div>
            <p class="tool-desc">Generate realistic fake JSON data from any JSON Schema — strings, numbers, enums, formats.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/csv" class="tool-card tool-csv">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="4" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M2 9h18M8 9v9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">CSV</span>
              <span class="tool-tag">Convert</span>
            </div>
            <p class="tool-desc">Convert JSON arrays to CSV tables and back. Handles quoted fields and nested values.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/yaml" class="tool-card tool-yaml">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 6h14M6 10h10M4 14h8M6 18h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">YAML</span>
              <span class="tool-tag">Convert</span>
            </div>
            <p class="tool-desc">Instantly convert between JSON and YAML in both directions with clean formatting.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <RouterLink to="/typescript" class="tool-card tool-ts">
          <div class="tool-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
              <path d="M6 9h5M8.5 9v7M13 9h4v2h-4v2h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="tool-body">
            <div class="tool-top">
              <span class="tool-name">TypeScript</span>
              <span class="tool-tag">Convert</span>
            </div>
            <p class="tool-desc">Generate TypeScript interfaces from JSON objects, or sample JSON from interface definitions.</p>
          </div>
          <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isLight = ref(false)
</script>

<style scoped>
.home {
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
.home.theme-light {
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
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
}
.theme-light .bg-grid { opacity: 0.4; }

.home-header {
  position: relative; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; height: 60px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(20px);
  flex-shrink: 0;
}
.brand { display: flex; align-items: center; gap: 10px; }
.brand-icon { color: var(--accent); }
.brand-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 400; color: var(--text); letter-spacing: -0.01em; }
.brand-name strong { font-weight: 800; color: var(--accent); }

.theme-toggle {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 7px;
  color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 34px;
  transition: color 0.15s, border-color 0.15s;
}
.theme-toggle:hover { color: var(--accent); border-color: var(--accent); }

/* Hero */
.hero {
  position: relative; z-index: 1;
  flex: 1; display: flex; flex-direction: column;
  align-items: center;
  padding: 52px 32px 48px;
  gap: 0;
}

.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--accent); margin: 0 0 14px;
}

.hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 800; letter-spacing: -0.02em;
  color: var(--text); margin: 0 0 12px;
  text-align: center;
}

.hero-sub {
  font-size: 15px; color: var(--text-muted);
  margin: 0 0 40px; text-align: center;
  max-width: 500px; line-height: 1.6;
}

/* Tool grid */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  width: 100%; max-width: 920px;
}

.tool-card {
  display: flex; align-items: center; gap: 16px;
  padding: 18px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none; color: var(--text);
  transition: border-color 0.18s, background 0.18s, transform 0.18s;
  position: relative; overflow: hidden;
  cursor: pointer;
}
.tool-card::before {
  content: '';
  position: absolute; inset: 0;
  opacity: 0; transition: opacity 0.18s;
  border-radius: 12px;
}
.tool-card:hover { border-color: var(--accent); background: var(--surface-2); transform: translateY(-1px); }
.tool-card:hover::before { opacity: 1; }
.tool-card:hover .tool-arrow { color: var(--accent); transform: translateX(3px); }

.tool-icon {
  width: 44px; height: 44px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--accent-dim); border: 1px solid var(--accent-glow);
  border-radius: 10px; color: var(--accent);
}

.tool-body { flex: 1; min-width: 0; }
.tool-top { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.tool-name {
  font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
  color: var(--text); letter-spacing: -0.01em;
}
.tool-tag {
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: var(--text-muted); background: var(--surface-2);
  border: 1px solid var(--border); border-radius: 4px;
  padding: 2px 6px;
}
.tool-desc {
  font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-muted);
  margin: 0; line-height: 1.5;
}

.tool-arrow {
  color: var(--text-muted); flex-shrink: 0;
  transition: color 0.18s, transform 0.18s;
}
</style>
