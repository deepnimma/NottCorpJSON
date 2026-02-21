<template>
  <div class="app-shell" :class="{ 'sidebar-open': !sidebarCollapsed }">
    <Sidebar v-model:collapsed="sidebarCollapsed" />
    <div class="app-content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const stored = localStorage.getItem('sidebar-collapsed')
const sidebarCollapsed = ref(stored === null ? true : stored === 'true')

watch(sidebarCollapsed, v => localStorage.setItem('sidebar-collapsed', String(v)))
</script>

<style>
.app-shell {
  display: flex;
  min-height: 100vh;
}

.app-content {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  margin-left: 52px;
  transition: margin-left 0.24s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-shell.sidebar-open .app-content {
  margin-left: 220px;
}
</style>
