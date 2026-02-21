<template>
  <div class="preview-block">
    <pre class="json-output" v-html="highlighted"></pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  schema: object
}>()

function syntaxHighlight(json: string): string {
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        return /:$/.test(match)
          ? `<span class="tk-key">${match}</span>`
          : `<span class="tk-str">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span class="tk-bool">${match}</span>`
      if (/null/.test(match)) return `<span class="tk-null">${match}</span>`
      return `<span class="tk-num">${match}</span>`
    },
  )
}

const highlighted = computed(() =>
  syntaxHighlight(JSON.stringify(props.schema, null, 2))
)
</script>

<style scoped>
.preview-block {
  flex: 1;
  overflow: auto;
  background: var(--surface);
  border-radius: 0 0 12px 12px;
}

.json-output {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text);
  padding: 20px 24px;
  white-space: pre;
  tab-size: 2;
}

:deep(.tk-key)  { color: #7dd3fc; }
:deep(.tk-str)  { color: #86efac; }
:deep(.tk-num)  { color: #fbbf24; }
:deep(.tk-bool) { color: #c084fc; }
:deep(.tk-null) { color: #94a3b8; }
</style>
