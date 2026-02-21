<template>
  <nav class="breadcrumb" v-if="crumbs.length > 0">
    <button
      v-for="(crumb, idx) in crumbs"
      :key="idx"
      class="crumb"
      :class="{ active: idx === crumbs.length - 1 }"
      @click="$emit('navigate', idx)"
    >
      <span v-if="idx > 0" class="crumb-sep">›</span>
      <span class="crumb-label">{{ crumb.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  crumbs: Array<{ label: string; index: number }>
}>()

defineEmits<{
  navigate: [index: number]
}>()
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 10px 0 14px;
  flex-wrap: wrap;
}

.crumb {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 4px 2px;
  transition: color 0.15s;
}

.crumb:hover {
  color: var(--accent);
}

.crumb.active {
  color: var(--text);
  cursor: default;
}

.crumb-sep {
  color: var(--border-2);
  font-size: 14px;
  margin-right: 4px;
}
</style>
