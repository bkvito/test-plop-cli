# create-component-template-cli

一个用于快速创建 Vue 3 + TypeScript + Sass 组件骨架的 CLI 工具。

## 使用方式

```bash
# 通过包名直接执行（适合 npm / npx 用户）
npx create-component-template-cli --version
npx create-component-template-cli

# 通过短命令执行
npx cctc --version
npx cctc

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

## 本地验证模板改动

当你手动修改 `plop-templates/**/*.hbs` 后，推荐优先使用非交互命令验证，避免在交互模式下误选模板类型。

```bash
# 验证单个模板输出
npm run verify:template:general:setup
npm run verify:template:single-pick:normal

# 一次性验证全部模板组合，并自动检查生成的 index.vue 关键片段
npm run verify:template:all
```

验证命令的行为说明：

- 所有验证结果统一输出到 `tmp-output/template-verify/`
- 每次验证都会覆盖旧的测试产物，避免残留文件干扰判断
- `verify:template:check` 会自动断言生成的 `src/index.vue` 中是否包含关键片段，用于快速发现模板分流错误或变量替换错误

如果你只想确认某一个 `.hbs` 是否生效，优先执行对应的 `verify:template:*` 命令，再打开 `tmp-output/template-verify/<组件名>/src/index.vue` 查看最终结果。

## 自动化测试

项目已接入 Vitest，用于覆盖生成函数和 CLI 真实入口。

```bash
# 运行正式测试
npm run test

# 开发时监听测试
npm run test:watch
```

测试范围：

- `tests/generate.test.mjs`：覆盖 `generateComponent()` 的模板组合、文件生成、变量替换、冲突策略和非法参数
- `tests/cli.e2e.test.mjs`：通过 `node bin/cli.mjs` 覆盖版本输出、非交互生成和严格非交互失败路径

一般模板文案或结构小改动，优先跑 `npm run test`。如果需要人工查看最终生成内容，再补跑 `npm run verify:template:all`。
