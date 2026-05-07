# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**create-vue-component-template** (CLI command: `cvct`) — a plop-based CLI scaffolding tool that generates Vue component directory structures with predefined templates. Published to npm as a global CLI utility.

## Commands

```bash
# Run the CLI locally (generates component templates interactively)
node bin/cli.mjs

# Run with CLI arguments to skip prompts
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform --templateType=normal

# Version bump via changesets
npx changeset          # create a changeset
npx changeset version  # consume changesets, bump package.json
```

## Architecture

**Entry point:** `bin/cli.mjs` — bootstraps plop, loads `plopfile.mjs`, passes CLI args via minimist.

**Core logic:** `plopfile.mjs` — defines a single plop generator (`create-component-template`) that:
1. Prompts for: root path, template type (normal/setup), component name (PascalCase)
2. Detects directory collisions and offers overwrite or retry
3. Generates 6 files per component using Handlebars templates

**Templates:** `plop-templates/*.hbs` — Handlebars files that produce the component output.

### Two Template Modes

- **normal** (`index.vue.hbs`): Options API with `defineComponent`, explicit props, and `setup()` function
- **setup** (`index.setup.vue.hbs`): Composition API with `<script setup>`, `defineProps<>()`, and `defineOptions()`

### Generated Component Structure

```
{rootPath}/{ComponentName}/
├── index.ts              # Re-exports component and types
└── src/
    ├── index.vue         # Component template
    ├── index.scss        # Scoped styles
    ├── typing.ts         # Props interface + enums
    ├── hook.ts           # use{ComponentName}() composable
    └── data.ts           # Data arrays
```

### Template Variables

| Variable | Source | Example |
|----------|--------|---------|
| `{{componentName}}` | PascalCase of input name | `MyTest` |
| `{{class}}` | kebab-case of input name | `my-test` |
| `{{interfaceName}}` | Same as componentName | `MyTest` |

The `change-case` library handles all case conversions.

## Versioning

Uses `@changesets/cli` for version management. Changeset access is `restricted` (private by default). Base branch is `master`.
