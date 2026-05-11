# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

**create-vue-component-template** (CLI command: `cvct`) — a CLI scaffolding tool that generates Vue component directory structures with predefined templates. Published to npm as a global CLI utility.

## Commands

### Non-Interactive Mode (for agents/CI)

```bash
# Generate a general business template with setup style
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform

# Generate a single-pick business template
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform --templateType=single-pick

# Generate a multiple-pick business template with defineComponent style
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform --templateType=multiple-pick --vueTemplateType=normal

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
| `--templateType` | No | `general` | `general` = 通用模板；`single-pick` = 产品组单选模板；`multiple-pick` = 产品组多选模板 |
| `--vueTemplateType` | No | `setup` | `setup` = `<script setup>`；`normal` = `defineComponent` |
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

### Business Template Types

- **general**: 通用业务模板
- **single-pick**: 产品组单选模板
- **multiple-pick**: 产品组多选模板

### Vue Template Styles

- **setup** (`index.setup.vue.hbs`): `<script setup>` 风格
- **normal** (`index.normal.vue.hbs`): `defineComponent` 风格

Regardless of Vue style, the generated file name remains `src/index.vue`.

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
