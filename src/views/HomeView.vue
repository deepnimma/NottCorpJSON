<template>
  <div class="home">
    <div class="bg-layer" aria-hidden="true">
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
    </header>

    <main class="content">
      <div class="hero">
        <p class="hero-eyebrow">JSON Utilities</p>
        <h1 class="hero-title">The JSON Toolset</h1>
        <p class="hero-sub">Schema creation, inference, merging, validation, formatting, diffing, and conversion — all in one place.</p>
      </div>

      <div class="categories">

        <!-- Schema -->
        <section class="category">
          <div class="category-header">
            <span class="category-label">Schema</span>
            <span class="category-count">5 tools</span>
          </div>
          <div class="tool-grid">
            <RouterLink to="/creator" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 8h8M7 11h5M7 14h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="16" cy="14" r="3" fill="currentColor" opacity="0.3"/>
                  <path d="M15 14l1 1 2-2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">Creator</span>
                <p class="tool-desc">Build JSON Schema definitions visually, field-by-field, with full type support.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>

            <RouterLink to="/inferrer" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M3 19l9-9M14 3l5 5-9.5 9.5-5-5L14 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18 2l2 2M19 5l1-1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">Inferrer</span>
                <p class="tool-desc">Paste any JSON object and get an inferred JSON Schema with detected types instantly.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>

            <RouterLink to="/merger" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M4 5l5 6-5 6M18 5l-5 6 5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">Merger</span>
                <p class="tool-desc">Merge two JSON Schemas via allOf wrapping, deep property merge, or anyOf composition.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>

            <RouterLink to="/faker" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
                  <circle cx="15" cy="7" r="1.5" fill="currentColor"/>
                  <circle cx="7" cy="15" r="1.5" fill="currentColor"/>
                  <circle cx="15" cy="15" r="1.5" fill="currentColor"/>
                  <circle cx="11" cy="11" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">Faker</span>
                <p class="tool-desc">Generate realistic fake JSON data from any JSON Schema — strings, numbers, enums, formats.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>

            <RouterLink to="/validator" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 11.5l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">Validator</span>
                <p class="tool-desc">Validate any JSON document against a JSON Schema and see detailed error paths.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>
          </div>
        </section>

        <!-- Utilities -->
        <section class="category">
          <div class="category-header">
            <span class="category-label">Utilities</span>
            <span class="category-count">3 tools</span>
          </div>
          <div class="tool-grid">
            <RouterLink to="/formatter" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M4 6h14M4 11h9M4 16h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M17 15l2 2-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">Formatter</span>
                <p class="tool-desc">Prettify or minify JSON with configurable indentation. Instant syntax highlighting.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>

            <RouterLink to="/diff" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="4" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="12" y="4" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M5 9h2M5 12h4M14 9h4M14 12h2M14 15h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">Diff</span>
                <p class="tool-desc">Compare two JSON documents and see exactly what was added, removed, or changed.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>

            <RouterLink to="/jsonpath" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 11h8M12 8l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="7" cy="11" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">JSONPath</span>
                <p class="tool-desc">Query JSON with JSONPath expressions. Supports wildcards, recursive descent, and indexing.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>
          </div>
        </section>

        <!-- Analyze -->
        <section class="category">
          <div class="category-header">
            <span class="category-label">Analyze</span>
            <span class="category-count">2 tools</span>
          </div>
          <div class="tool-grid">
            <RouterLink to="/stats" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M4 18V12M8 18V8M12 18V10M16 18V5M20 18H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">Stats</span>
                <p class="tool-desc">Analyze JSON structure: key counts, depth, types breakdown, null rates, and size metrics.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>

            <RouterLink to="/flattener" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M4 6h14M4 11h14M4 16h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M8 3l-4 3 4 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">Flattener</span>
                <p class="tool-desc">Flatten nested JSON to dot-notation keys or unflatten dot-keys back to nested objects.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>
          </div>
        </section>

        <!-- Convert -->
        <section class="category">
          <div class="category-header">
            <span class="category-label">Convert</span>
            <span class="category-count">3 tools</span>
          </div>
          <div class="tool-grid">
            <RouterLink to="/csv" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="4" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 9h18M8 9v9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">CSV</span>
                <p class="tool-desc">Convert JSON arrays to CSV tables and back. Handles quoted fields and nested values.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>

            <RouterLink to="/yaml" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M4 6h14M6 10h10M4 14h8M6 18h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">YAML</span>
                <p class="tool-desc">Instantly convert between JSON and YAML in both directions with clean formatting.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>

            <RouterLink to="/typescript" class="tool-card">
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M6 9h5M8.5 9v7M13 9h4v2h-4v2h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="tool-body">
                <span class="tool-name">TypeScript</span>
                <p class="tool-desc">Generate TypeScript interfaces from JSON objects, or sample JSON from interface definitions.</p>
              </div>
              <svg class="tool-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.home {
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
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
}

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

/* Content */
.content {
  position: relative; z-index: 1;
  flex: 1;
  padding: 48px 40px 64px;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Hero */
.hero {
  margin-bottom: 48px;
}

.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--accent); margin: 0 0 10px;
}

.hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 800; letter-spacing: -0.02em;
  color: var(--text); margin: 0 0 10px;
}

.hero-sub {
  font-size: 14px; color: var(--text-muted);
  margin: 0; max-width: 520px; line-height: 1.6;
}

/* Categories */
.categories { display: flex; flex-direction: column; gap: 36px; }

.category-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 12px;
}

.category-label {
  font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-muted);
}

.category-count {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--text-muted); opacity: 0.5;
  background: var(--surface-2); border: 1px solid var(--border);
  border-radius: 4px; padding: 1px 6px;
}

/* Tool grid */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 8px;
}

.tool-card {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  text-decoration: none; color: var(--text);
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
  cursor: pointer;
}
.tool-card:hover { border-color: var(--accent); background: var(--surface-2); transform: translateY(-1px); }
.tool-card:hover .tool-arrow { color: var(--accent); transform: translateX(3px); }

.tool-icon {
  width: 38px; height: 38px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--accent-dim); border: 1px solid var(--accent-glow);
  border-radius: 8px; color: var(--accent);
}

.tool-body { flex: 1; min-width: 0; }
.tool-name {
  display: block;
  font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
  color: var(--text); letter-spacing: -0.01em; margin-bottom: 3px;
}
.tool-desc {
  font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-muted);
  margin: 0; line-height: 1.5;
}

.tool-arrow {
  color: var(--text-muted); flex-shrink: 0;
  transition: color 0.15s, transform 0.15s;
}
</style>
