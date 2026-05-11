# create-component-template-cli

一个用于快速创建 Vue 3 + TypeScript + Sass 组件骨架的 CLI 工具。

## 使用方式

```bash
# 通过包名直接执行（适合 npm / npx 用户）
npx create-component-template-cli --version
npx create-component-template-cli

# 通过短命令执行
npx cvct --version
npx cvct

# 本地开发调试
node bin/cli.mjs

# 非交互模式
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform

# 指定业务模板类型
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform --templateType=single-pick

# 指定 index.vue 的 Vue 写法
node bin/cli.mjs --name=MyComponent --rootPath=src/components/platform --templateType=multiple-pick --vueTemplateType=normal
```

## 参数说明

| 参数 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `--name` | 是（非交互） | - | 组件名称，PascalCase |
| `--rootPath` | 是（非交互） | - | 输出目录 |
| `--templateType` | 否 | `general` | 业务模板类型：`general` / `single-pick` / `multiple-pick` |
| `--vueTemplateType` | 否 | `setup` | `index.vue` 的 Vue 风格：`setup` / `normal` |
| `--collisionStrategy` | 否 | `skip` | 目录冲突策略：`skip` / `overwrite` |
| `--nonInteractive` | 否 | `false` | 缺少必填参数时直接报错，不进入交互模式 |

## 模板规则

1. `templateType` 只控制业务模板类型。
2. `vueTemplateType` 只控制 `index.vue` 的 Vue 写法。
3. 无论选择哪种 Vue 风格，最终生成的文件名始终是 `src/index.vue`。

## 生成目录结构

```txt
{rootPath}/{ComponentName}/
├── index.ts
└── src/
    ├── index.vue
    ├── index.scss
    ├── typing.ts
    ├── hook.ts
    └── data.ts
```
