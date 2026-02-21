<template>
  <header class="app-header">
    <div class="header-left">
      <RouterLink to="/" class="brand">
        <span class="brand-n">N</span>
        <span class="brand-name">NottA<strong>SchemaGen</strong></span>
      </RouterLink>
      <nav class="header-nav">
        <RouterLink to="/generator" class="nav-link">Generator</RouterLink>
        <RouterLink to="/validator" class="nav-link">Validator</RouterLink>
        <RouterLink to="/formatter" class="nav-link">Formatter</RouterLink>
        <RouterLink to="/diff" class="nav-link">Diff</RouterLink>
        <RouterLink to="/jsonpath" class="nav-link">JSONPath</RouterLink>
      </nav>
    </div>
    <div class="header-right">
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.app-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(20px);
  flex-shrink: 0;
}

.header-left { display: flex; align-items: center; gap: 20px; }
.header-right { display: flex; align-items: center; gap: 8px; }

.brand {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; flex-shrink: 0;
}
.brand-name {
  font-family: 'Syne', sans-serif;
  font-size: 17px; font-weight: 400;
  color: var(--text); letter-spacing: -0.01em;
  white-space: nowrap;
}
.brand-name strong { font-weight: 800; color: var(--accent); }

.header-nav { display: flex; align-items: center; gap: 2px; }
.nav-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 500;
  color: var(--text-muted); text-decoration: none;
  padding: 5px 10px; border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.nav-link:hover { color: var(--text); background: var(--surface-2); }
.nav-link.router-link-active {
  color: var(--accent);
  background: var(--accent-dim);
}
</style>
