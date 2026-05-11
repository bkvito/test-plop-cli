#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import minimist from 'minimist';
import { generateComponent } from '../src/generate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const argv = minimist(args);

function printVersion() {
  const pkg = JSON.parse(readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));
  console.log(`cvct v${pkg.version}`);
}

function printHelp() {
  console.log(`
cvct - Vue 组件模板生成器 (create-vue-component-template-cli)

用法:
  cvct [选项]

必填参数 (非交互模式):
  --name=<ComponentName>         组件名称，PascalCase 格式 (例: MyTest)
  --rootPath=<path>              组件生成路径 (例: src/components/platform)

可选参数:
  --templateType=<type>          业务模板类型: general (默认) | single-pick | multiple-pick
                                - general:        通用业务模板
                                - single-pick:    产品组单选模板
                                - multiple-pick:  产品组多选模板

  --vueTemplateType=<type>       index.vue 语法风格: setup (默认) | normal
                                - setup:   <script setup> 风格
                                - normal:  defineComponent 风格
                                - 注意: 最终生成文件名始终为 index.vue

  --collisionStrategy=<s>        目录冲突策略: skip (默认) | overwrite
                                - skip:       目录已存在时直接报错退出
                                - overwrite:  删除旧目录后重新生成

  --nonInteractive               强制非交互模式，缺少必填参数时直接报错

  -h, --help                     显示帮助信息
  -v, --version                  显示版本号

非交互模式示例:
  cvct --name=MyTest --rootPath=src/components/platform
  cvct --name=MyTest --rootPath=src/components/platform --templateType=single-pick
  cvct --name=MyTest --rootPath=src/components/platform --templateType=multiple-pick --vueTemplateType=normal
  cvct --name=MyTest --rootPath=src/components/platform --collisionStrategy=overwrite

生成的目录结构:
  {rootPath}/{ComponentName}/
  ├── index.ts
  └── src/
      ├── index.vue
      ├── index.scss
      ├── typing.ts
      ├── hook.ts
      └── data.ts

交互模式:
  不带参数运行 cvct 将进入 plop 交互提示界面
`);
}

if (argv.help || argv.h) {
  printHelp();
  process.exit(0);
}

if (argv.version || argv.v) {
  printVersion();
  process.exit(0);
}

const hasAllRequired = argv.name && argv.rootPath;
const nonInteractive = argv.nonInteractive;

if (nonInteractive && !hasAllRequired) {
  console.error('错误：非交互模式需要同时传入 --name 和 --rootPath');
  console.error('运行 cvct --help 查看帮助');
  process.exit(1);
}

if (hasAllRequired) {
  const result = generateComponent({
    name: argv.name,
    rootPath: argv.rootPath,
    templateType: argv.templateType || 'general',
    vueTemplateType: argv.vueTemplateType || 'setup',
    collisionStrategy: argv.collisionStrategy || 'skip',
  });

  if (!result.success) {
    console.error(`错误：${result.error}`);
    process.exit(1);
  }

  console.log(`✓ 已生成组件: ${result.componentName}`);
  console.log(`  路径: ${result.targetFolder}`);
  console.log(`  业务模板: ${result.templateType}`);
  console.log(`  Vue 风格: ${result.vueTemplateType}`);
  result.files.forEach((file) => console.log(`  - ${file}`));
  process.exit(0);
}

const { Plop, run } = await import('plop');

Plop.prepare({
  configPath: path.join(__dirname, '../plopfile.mjs'),
  import: [],
}, (env) => {
  Plop.execute(env, (executeEnv) => {
    const options = {
      ...executeEnv,
      dest: process.cwd(),
    };
    return run(options, undefined, true);
  });
});
