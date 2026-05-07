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
cvct — Vue 组件模板生成器 (create-vue-component-template)

用法:
  cvct [选项]

必填参数 (非交互模式):
  --name=<ComponentName>     组件名称，PascalCase 格式 (例: MyTest)
  --rootPath=<path>          组件生成路径 (例: src/components/platform)

可选参数:
  --templateType=<type>      模板类型: setup (默认) | normal
                            - setup:   <script setup> + defineProps<> + defineOptions
                            - normal:  defineComponent + PropType + setup()

  --collisionStrategy=<s>    目录碰撞策略: skip (默认) | overwrite
                            - skip:       目录已存在时报错退出
                            - overwrite:  删除旧目录后重新生成

  --nonInteractive           强制非交互模式，缺少必填参数时报错而非提示

  -h, --help                 显示帮助信息
  -v, --version              显示版本号

非交互模式示例:
  cvct --name=MyTest --rootPath=src/components/platform
  cvct --name=MyTest --rootPath=src/components/platform --templateType=normal
  cvct --name=MyTest --rootPath=src/components/platform --collisionStrategy=overwrite

生成的目录结构:
  {rootPath}/{ComponentName}/
  ├── index.ts                # 导出组件和类型
  └── src/
      ├── index.vue           # 组件模板
      ├── index.scss           # 样式
      ├── typing.ts            # Props 接口 + 枚举
      ├── hook.ts              # use{ComponentName}() composable
      └── data.ts              # 数据数组

交互模式:
  不带参数运行 cvct 将进入交互式提示界面 (plop)
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
  console.error('错误：非交互模式需要 --name 和 --rootPath 参数');
  console.error('运行 cvct --help 查看帮助');
  process.exit(1);
}

if (hasAllRequired) {
  const result = generateComponent({
    name: argv.name,
    rootPath: argv.rootPath,
    templateType: argv.templateType || 'setup',
    collisionStrategy: argv.collisionStrategy || 'skip',
  });

  if (!result.success) {
    console.error(`错误：${result.error}`);
    process.exit(1);
  }

  console.log(`✓ 已生成组件: ${result.componentName}`);
  console.log(`  路径: ${result.targetFolder}`);
  result.files.forEach(f => console.log(`  - ${f}`));
  process.exit(0);
}

// Fallback: interactive mode via plop
const { Plop, run } = await import('plop');

Plop.prepare({
  configPath: path.join(__dirname, '../plopfile.mjs'),
  import: []
}, env => {
  Plop.execute(env, (env) => {
    const options = {
      ...env,
      dest: process.cwd()
    };
    return run(options, undefined, true);
  });
});
