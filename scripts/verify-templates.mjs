import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const VERIFY_OUTPUT_ROOT = path.join(ROOT_DIR, 'tmp-output', 'template-verify');

const TEMPLATE_CASES = [
  {
    componentName: 'VerifyGeneralSetup',
    templateType: 'general',
    vueTemplateType: 'setup',
    expectedFiles: {
      'src/index.vue': [
        "name: 'VerifyGeneralSetup'",
        'script setup',
        'useVerifyGeneralSetup',
        'SinglePickButtonGroup',
      ],
      'src/typing.ts': [
        'export interface VerifyGeneralSetupProps',
        'productGroupIdentify: string;',
        'viewType: keyof typeof ViewEnum;',
      ],
      'src/hook.ts': [
        'export const useVerifyGeneralSetup',
        "const model = ref<string>('')",
        'const buttons: ButtonGroupItem[] = [',
      ],
      'src/data.ts': [
        '样例数据',
      ],
      'index.ts': [
        "import VerifyGeneralSetup from './src/index.vue'",
        'export * from \'./src/typing\'',
      ],
    },
  },
  {
    componentName: 'VerifyGeneralNormal',
    templateType: 'general',
    vueTemplateType: 'normal',
    expectedFiles: {
      'src/index.vue': [
        "name: 'VerifyGeneralNormal'",
        'defineComponent',
        'useVerifyGeneralNormal',
        'class="verify-general-normal"',
      ],
      'src/typing.ts': [
        'export interface VerifyGeneralNormalProps',
        'productGroupIdentify: string;',
        'viewType: keyof typeof ViewEnum;',
      ],
      'src/hook.ts': [
        'export const useVerifyGeneralNormal',
        "const model = ref<string>('')",
        'const buttons: ButtonGroupItem[] = [',
      ],
      'src/data.ts': [
        '样例数据',
      ],
      'index.ts': [
        "import VerifyGeneralNormal from './src/index.vue'",
        'export * from \'./src/typing\'',
      ],
    },
  },
  {
    componentName: 'VerifySinglePickSetup',
    templateType: 'single-pick',
    vueTemplateType: 'setup',
    expectedFiles: {
      'src/index.vue': [
        "name: 'VerifySinglePickSetup'",
        'script setup',
        'useVerifySinglePickSetup',
        '<SinglePickButtonGroup />',
        'data-template-type="single-pick"',
      ],
      'src/typing.ts': [
        'export interface VerifySinglePickSetupProps',
        'modelValue?: string',
        'export interface DataType',
      ],
      'src/hook.ts': [
        'export const useVerifySinglePickSetup',
        'const selectedValue = ref(props.modelValue ?? data[0]?.value ?? \'\')',
      ],
      'src/data.ts': [
        'const data: Array<DataType> = [',
        'export {',
        'data,',
      ],
      'index.ts': [
        "import VerifySinglePickSetup from './src/index.vue'",
        'export * from \'./src/typing\'',
      ],
    },
  },
  {
    componentName: 'VerifySinglePickNormal',
    templateType: 'single-pick',
    vueTemplateType: 'normal',
    expectedFiles: {
      'src/index.vue': [
        "name: 'VerifySinglePickNormal'",
        'defineComponent',
        'useVerifySinglePickNormal',
        'SinglePickButtonGroup,',
        'data-template-type="single-pick"',
      ],
      'src/typing.ts': [
        'export interface VerifySinglePickNormalProps',
        'modelValue?: string',
        'export interface DataType',
      ],
      'src/hook.ts': [
        'export const useVerifySinglePickNormal',
        'const selectedValue = ref(props.modelValue ?? data[0]?.value ?? \'\')',
      ],
      'src/data.ts': [
        'const data: Array<DataType> = [',
        'export {',
        'data,',
      ],
      'index.ts': [
        "import VerifySinglePickNormal from './src/index.vue'",
        'export * from \'./src/typing\'',
      ],
    },
  },
  {
    componentName: 'VerifyMultiplePickSetup',
    templateType: 'multiple-pick',
    vueTemplateType: 'setup',
    expectedFiles: {
      'src/index.vue': [
        "name: 'VerifyMultiplePickSetup'",
        'script setup',
        'useVerifyMultiplePickSetup',
        'v-for="item in selectedValues"',
      ],
      'src/typing.ts': [
        'export interface VerifyMultiplePickSetupProps',
        'modelValue?: string[]',
        'export interface DataType',
      ],
      'src/hook.ts': [
        'export const useVerifyMultiplePickSetup',
        'const selectedValues = ref(props.modelValue ?? data.slice(0, 2).map((item) => item.value))',
      ],
      'src/data.ts': [
        'const data: Array<DataType> = [',
        'export {',
        'data,',
      ],
      'index.ts': [
        "import VerifyMultiplePickSetup from './src/index.vue'",
        'export * from \'./src/typing\'',
      ],
    },
  },
  {
    componentName: 'VerifyMultiplePickNormal',
    templateType: 'multiple-pick',
    vueTemplateType: 'normal',
    expectedFiles: {
      'src/index.vue': [
        "name: 'VerifyMultiplePickNormal'",
        'defineComponent',
        'useVerifyMultiplePickNormal',
        'modelValue: {',
      ],
      'src/typing.ts': [
        'export interface VerifyMultiplePickNormalProps',
        'modelValue?: string[]',
        'export interface DataType',
      ],
      'src/hook.ts': [
        'export const useVerifyMultiplePickNormal',
        'const selectedValues = ref(props.modelValue ?? data.slice(0, 2).map((item) => item.value))',
      ],
      'src/data.ts': [
        'const data: Array<DataType> = [',
        'export {',
        'data,',
      ],
      'index.ts': [
        "import VerifyMultiplePickNormal from './src/index.vue'",
        'export * from \'./src/typing\'',
      ],
    },
  },
];

function cleanVerifyOutputRoot() {
  fs.rmSync(VERIFY_OUTPUT_ROOT, { recursive: true, force: true });
  fs.mkdirSync(VERIFY_OUTPUT_ROOT, { recursive: true });
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

function assertFileContainsSnippets(templateCase, relativeFilePath, expectedSnippets) {
  const componentDir = path.join(VERIFY_OUTPUT_ROOT, templateCase.componentName);
  const filePath = path.join(componentDir, ...relativeFilePath.split('/'));

  if (!fs.existsSync(filePath)) {
    throw new Error(
      [
        `模板校验失败: ${templateCase.templateType}/${templateCase.vueTemplateType}`,
        `缺少文件: ${relativeFilePath}`,
        `实际路径: ${filePath}`,
      ].join('\n'),
    );
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  for (const expectedSnippet of expectedSnippets) {
    // 这里校验“文件存在 + 关键片段存在”两层信息。
    // 这样设计的原因是：模板回归时既可能是文件没生成，也可能是变量替换或模板分流出错。
    if (!fileContent.includes(expectedSnippet)) {
      throw new Error(
        [
          `模板校验失败: ${templateCase.templateType}/${templateCase.vueTemplateType}`,
          `校验文件: ${relativeFilePath}`,
          `缺少关键片段: ${expectedSnippet}`,
          `实际路径: ${filePath}`,
        ].join('\n'),
      );
    }
  }
}

function assertGeneratedFiles(templateCase) {
  for (const [relativeFilePath, expectedSnippets] of Object.entries(templateCase.expectedFiles)) {
    assertFileContainsSnippets(templateCase, relativeFilePath, expectedSnippets);
  }
}

function main() {
  cleanVerifyOutputRoot();

  for (const templateCase of TEMPLATE_CASES) {
    generateTemplate(templateCase);
    assertGeneratedFiles(templateCase);
  }

  console.log('✓ 所有模板生成、文件存在性与关键片段校验通过');
}

main();
