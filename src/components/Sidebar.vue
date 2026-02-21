<template>
  <aside class="sidebar" :class="{ 'is-expanded': !collapsed }">

    <!-- Toggle button -->
    <button class="toggle-btn" @click="$emit('update:collapsed', !collapsed)" :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'">
      <svg v-if="collapsed" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Brand -->
    <RouterLink to="/" class="sidebar-brand" :title="collapsed ? 'Home' : ''">
      <span class="sidebar-logo">N</span>
      <span class="brand-text">NottA<strong>Schema</strong></span>
    </RouterLink>

    <div class="sidebar-divider"></div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-group">
        <span class="group-label">Schema</span>

        <RouterLink to="/creator" class="nav-item" :title="collapsed ? 'Creator' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 8h8M7 11h5M7 14h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="16" cy="14" r="3" fill="currentColor" opacity="0.25"/>
              <path d="M15 14l1 1 2-2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label">Creator</span>
        </RouterLink>

        <RouterLink to="/inferrer" class="nav-item" :title="collapsed ? 'Inferrer' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <path d="M3 19l9-9M14 3l5 5-9.5 9.5-5-5L14 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 2l2 2M19 5l1-1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="nav-label">Inferrer</span>
        </RouterLink>

        <RouterLink to="/merger" class="nav-item" :title="collapsed ? 'Merger' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <path d="M4 5l5 6-5 6M18 5l-5 6 5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="nav-label">Merger</span>
        </RouterLink>

        <RouterLink to="/faker" class="nav-item" :title="collapsed ? 'Faker' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="7" r="1.5" fill="currentColor"/>
              <circle cx="7" cy="15" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="15" r="1.5" fill="currentColor"/>
              <circle cx="11" cy="11" r="1.5" fill="currentColor"/>
            </svg>
          </span>
          <span class="nav-label">Faker</span>
        </RouterLink>

        <RouterLink to="/validator" class="nav-item" :title="collapsed ? 'Validator' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 11.5l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label">Validator</span>
        </RouterLink>
      </div>

      <div class="nav-group">
        <span class="group-label">Utilities</span>
        <RouterLink to="/formatter" class="nav-item" :title="collapsed ? 'Formatter' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <path d="M4 6h14M4 11h9M4 16h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M17 15l2 2-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label">Formatter</span>
        </RouterLink>

        <RouterLink to="/diff" class="nav-item" :title="collapsed ? 'Diff' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="4" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <rect x="12" y="4" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M5 9h2M5 12h4M14 9h4M14 12h2M14 15h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="nav-label">Diff</span>
        </RouterLink>

        <RouterLink to="/jsonpath" class="nav-item" :title="collapsed ? 'JSONPath' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 11h8M13 8l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="7" cy="11" r="1.5" fill="currentColor"/>
            </svg>
          </span>
          <span class="nav-label">JSONPath</span>
        </RouterLink>
      </div>

      <div class="nav-group">
        <span class="group-label">Analyze</span>

        <RouterLink to="/stats" class="nav-item" :title="collapsed ? 'Stats' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <path d="M4 18V12M8 18V8M12 18V10M16 18V5M20 18H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label">Stats</span>
        </RouterLink>

        <RouterLink to="/flattener" class="nav-item" :title="collapsed ? 'Flattener' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <path d="M4 6h14M4 11h14M4 16h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M8 3l-4 3 4 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label">Flattener</span>
        </RouterLink>
      </div>

      <div class="nav-group">
        <span class="group-label">Convert</span>

        <RouterLink to="/csv" class="nav-item" :title="collapsed ? 'CSV' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="4" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M2 9h18M8 9v9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="nav-label">CSV</span>
        </RouterLink>

        <RouterLink to="/yaml" class="nav-item" :title="collapsed ? 'YAML' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <path d="M4 6h14M6 10h10M4 14h8M6 18h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="nav-label">YAML</span>
        </RouterLink>

        <RouterLink to="/typescript" class="nav-item" :title="collapsed ? 'TypeScript' : ''">
          <span class="nav-icon">
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
              <path d="M6 9h5M8.5 9v7M13 9h4v2h-4v2h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label">TypeScript</span>
        </RouterLink>
      </div>
    </nav>

  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{ collapsed: boolean }>()
defineEmits<{ (e: 'update:collapsed', v: boolean): void }>()
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0; top: 0; bottom: 0;
  z-index: 200;
  width: 52px;
  background: #141414;
  border-right: 1px solid #2e2e2e;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  transition: width 0.24s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}
.sidebar.is-expanded { width: 220px; }

/* Toggle button */
.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  min-height: 52px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #2e2e2e;
  color: #6a6060;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.toggle-btn:hover { color: #e8e2e2; background: #1c1c1c; }

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 15px;
  text-decoration: none;
  overflow: hidden;
  flex-shrink: 0;
}
.sidebar-logo {
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: #dc2626;
  width: 24px;
  height: 24px;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(220, 38, 38, 0.35);
  border-radius: 5px;
  background: rgba(220, 38, 38, 0.10);
  letter-spacing: -0.01em;
  line-height: 1;
  flex-shrink: 0;
  transition: border-color 0.15s, background 0.15s;
}
.sidebar-brand:hover .sidebar-logo {
  border-color: rgba(220, 38, 38, 0.6);
  background: rgba(220, 38, 38, 0.18);
}
.brand-text {
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #e8e2e2;
  letter-spacing: -0.01em;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.18s 0.04s, transform 0.18s 0.04s;
}
.sidebar.is-expanded .brand-text {
  opacity: 1;
  transform: translateX(0);
}
.brand-text strong { font-weight: 800; color: #dc2626; }

.sidebar-divider {
  height: 1px;
  background: #2e2e2e;
  margin: 0;
  flex-shrink: 0;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  gap: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-group {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  gap: 2px;
}
.nav-group + .nav-group {
  border-top: 1px solid #2e2e2e;
  margin-top: 4px;
}

.group-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #6a6060;
  white-space: nowrap;
  pointer-events: none;
  overflow: hidden;
  max-height: 0;
  padding: 0 15px;
  opacity: 0;
  transition: opacity 0.15s 0.05s, max-height 0.22s, padding 0.22s;
}
.sidebar.is-expanded .group-label {
  opacity: 1;
  max-height: 28px;
  padding: 4px 15px 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  height: 38px;
  text-decoration: none;
  color: #6a6060;
  border-radius: 7px;
  margin: 0 6px;
  transition: color 0.15s, background 0.15s;
  overflow: hidden;
  flex-shrink: 0;
}
.nav-item:hover { color: #e8e2e2; background: #1c1c1c; }
.nav-item.router-link-active {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.10);
}
.nav-item.router-link-active .nav-icon svg { stroke: #dc2626; }

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  flex-shrink: 0;
}

.nav-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.16s 0.05s, transform 0.16s 0.05s;
}
.sidebar.is-expanded .nav-label {
  opacity: 1;
  transform: translateX(0);
}
</style>
