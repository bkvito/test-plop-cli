import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const OUTPUT_ROOT = path.join(ROOT_DIR, 'tmp-output', 'template-verify');

const TEMPLATE_CASES = [
  {
    componentName: 'VerifyGeneralSetup',
    templateType: 'general',
    vueTemplateType: 'setup',
    expectedSnippets: [
      "name: 'VerifyGeneralSetup'",
      'script setup',
      'useVerifyGeneralSetup',
    ],
  },
  {
    componentName: 'VerifyGeneralNormal',
    templateType: 'general',
    vueTemplateType: 'normal',
    expectedSnippets: [
      "name: 'VerifyGeneralNormal'",
      'defineComponent',
      'useVerifyGeneralNormal',
    ],
  },
  {
    componentName: 'VerifySinglePickSetup',
    templateType: 'single-pick',
    vueTemplateType: 'setup',
    expectedSnippets: [
      "name: 'VerifySinglePickSetup'",
      'script setup',
      'useVerifySinglePickSetup',
    ],
  },
  {
    componentName: 'VerifySinglePickNormal',
    templateType: 'single-pick',
    vueTemplateType: 'normal',
    expectedSnippets: [
      "name: 'VerifySinglePickNormal'",
      'defineComponent',
      'useVerifySinglePickNormal',
    ],
  },
  {
    componentName: 'VerifyMultiplePickSetup',
    templateType: 'multiple-pick',
    vueTemplateType: 'setup',
    expectedSnippets: [
      "name: 'VerifyMultiplePickSetup'",
      'script setup',
      'useVerifyMultiplePickSetup',
    ],
  },
  {
    componentName: 'VerifyMultiplePickNormal',
    templateType: 'multiple-pick',
    vueTemplateType: 'normal',
    expectedSnippets: [
      "name: 'VerifyMultiplePickNormal'",
      'defineComponent',
      'useVerifyMultiplePickNormal',
    ],
  },
];

function cleanOutputRoot() {
  fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
}

function generateTemplate(templateCase) {
  execFileSync(
    process.execPath,
    [
      'bin/cli.mjs',
      `--name=${templateCase.componentName}`,
      '--rootPath=tmp-output/template-verify',
      `--templateType=${templateCase.templateType}`,
      `--vueTemplateType=${templateCase.vueTemplateType}`,
      '--collisionStrategy=overwrite',
    ],
    {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    },
  );
}

function assertGeneratedFiles(templateCase) {
  const componentDir = path.join(OUTPUT_ROOT, templateCase.componentName);
  const indexVuePath = path.join(componentDir, 'src', 'index.vue');
  const indexVueContent = fs.readFileSync(indexVuePath, 'utf-8');

  for (const expectedSnippet of templateCase.expectedSnippets) {
    // 这里校验“组件名 / Vue 写法 / hook 调用”三个关键片段，
    // 原因是这三个片段最能反映模板分流和变量替换是否正确。
    if (!indexVueContent.includes(expectedSnippet)) {
      throw new Error(
        [
          `模板校验失败: ${templateCase.templateType}/${templateCase.vueTemplateType}`,
          `缺少关键片段: ${expectedSnippet}`,
          `校验文件: ${indexVuePath}`,
        ].join('\n'),
      );
    }
  }
}

function main() {
  cleanOutputRoot();

  for (const templateCase of TEMPLATE_CASES) {
    generateTemplate(templateCase);
    assertGeneratedFiles(templateCase);
  }

  console.log('✓ 所有模板生成与关键片段校验通过');
}

main();
