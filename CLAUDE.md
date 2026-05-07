# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**create-vue-component-template** (CLI command: `cvct`) — a CLI scaffolding tool that generates Vue component directory structures with predefined templates. Published to npm as a global CLI utility.

## Commands

### Non-Interactive Mode (for agents/CI)

```bash
# Generate a setup-syntax component
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform

# Generate a normal (defineComponent) component
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform --templateType=normal

# Overwrite existing directory
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform --collisionStrategy=overwrite

# Strict non-interactive (error if missing required args)
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform --nonInteractive

# Help & version
node bin/cli.mjs --help
node bin/cli.mjs --version
```

### Interactive Mode (for humans)

```bash
# Run without args to enter plop interactive prompts
node bin/cli.mjs
```

### Version bump via changesets

```bash
npx changeset          # create a changeset
npx changeset version  # consume changesets, bump package.json
```

## CLI Flags Reference

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--name` | Yes (non-interactive) | — | Component name, PascalCase (e.g. `MyTest`) |
| `--rootPath` | Yes (non-interactive) | — | Target directory (e.g. `src/components/platform`) |
| `--templateType` | No | `setup` | `setup` = `<script setup>` + defineProps; `normal` = defineComponent + PropType |
| `--collisionStrategy` | No | `skip` | `skip` = error if exists; `overwrite` = delete & regenerate |
| `--nonInteractive` | No | false | Fail on missing args instead of prompting |
| `--help` / `-h` | No | — | Print help text |
| `--version` / `-v` | No | — | Print version |

## Architecture

**Entry point:** `bin/cli.mjs` — dispatches to non-interactive mode (`src/generate.mjs`) when all required CLI args are provided, otherwise falls back to plop interactive mode.

**Core generation:** `src/generate.mjs` — `generateComponent({ name, rootPath, templateType, collisionStrategy })` — pure function that:
1. Validates inputs
2. Converts case (PascalCase, kebab-case via `change-case`)
3. Detects directory collisions (skip or overwrite)
4. Renders `plop-templates/*.hbs` templates and writes files
5. Returns `{ success, files, componentName, targetFolder }` or `{ success: false, error }`

**Interactive mode:** `plopfile.mjs` — plop generator for human interactive use.

**Templates:** `plop-templates/*.hbs` — Handlebars-style template files.

### Two Template Modes

- **setup** (`index.setup.vue.hbs`): `<script setup>` + `defineProps<>()` + `defineOptions()`
- **normal** (`index.vue.hbs`): `defineComponent` + `PropType` + `setup()` function

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
