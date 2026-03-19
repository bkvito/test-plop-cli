# create-vue-component-template

A CLI tool for creating standardized Vue 3 + TypeScript + Sass public component templates.

# USEAGE

```bash
# 此处以npm为例，yarn、pnpm同理
npm create-vue-component-template --rootPath src/components/platform

# or
npx create-vue-component-template --rootPath src/components/platform

```

directory tree like this：

.
└── Demo/
    ├── src/
    │   ├── components/
    │   │   ├── aaa/
    │   │   ├── bbb/
    │   │   └── .../
    │   ├── data.ts
    │   ├── typing.ts
    │   ├── hooks.ts
    │   └── index.scss
    └── index.ts