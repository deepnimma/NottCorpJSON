# NottCorpJSON

## Skills

This project uses Claude Code skills for context-aware assistance:

- `.claude/skills/base/skill.md` — Core conventions, tech stack, commands (always loaded)
- `.claude/skills/json-creator/skill.md` — JSON Schema builder: field model, recursive navigation, schema output
- `.claude/skills/theme/skill.md` — Light/dark theme singleton and CSS class toggle

## Architecture Summary

Pure client-side Vue 3 SPA. No backend, no shared store (no Pinia/Vuex), no tests.

- **14 tool routes** — each `src/views/*.vue` is self-contained with its own local state
- **No cross-view state** — add a composable or Pinia if needed
- **`src/types/schema.ts`** — canonical data model; do not duplicate type definitions elsewhere
- **`src/router/index.ts`** — full feature registry; add new routes here

## Critical Rules

1. `SchemaField.properties` and `SchemaField.itemProperties` are **recursive** — traversal code must handle arbitrary depth.
2. `useTheme` is a **module singleton** — do not add per-instance state or re-initialize inside the function.
3. `buildFieldDef`/`buildFieldProps` in `CreatorView.vue:236–279` are the **source of truth** for JSON Schema output format.
4. Fields with empty `name` are **silently skipped** in schema output — match this guard in any new schema logic.

## Commands

```
npm run dev       # vite dev server
npm run build     # vue-tsc + vite build
npm run preview   # preview production build
```
