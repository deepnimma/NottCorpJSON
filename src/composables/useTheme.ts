import { ref, watch } from 'vue'

const isLight = ref(localStorage.getItem('theme') === 'light')

function applyTheme(light: boolean) {
  document.documentElement.classList.toggle('light', light)
}

applyTheme(isLight.value)

watch(isLight, (v) => {
  applyTheme(v)
  localStorage.setItem('theme', v ? 'light' : 'dark')
})

export function useTheme() {
  return { isLight }
}
