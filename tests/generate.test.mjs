import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateComponent } from '../src/generate.mjs';

let originalCwd;
let tempRoot;

function createTempWorkspace() {
  // tempRoot 表示本轮测试专属工作目录，用来隔离生成产物，避免污染仓库目录。
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cctc-generate-'));
  originalCwd = process.cwd();
  process.chdir(tempRoot);
}

function cleanupTempWorkspace() {
  process.chdir(originalCwd);
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function readGeneratedFile(componentName, relativeFilePath) {
  return fs.readFileSync(path.join(tempRoot, 'output', componentName, ...relativeFilePath.split('/')), 'utf-8');
}

function expectNoTemplatePlaceholders(content) {
  // 这里只检查脚手架占位符是否残留；Vue 自身的 mustache 插值如 {{ item }} 是合法模板语法。
  expect(content).not.toMatch(/{{\s*(componentName|class|interfaceName)\s*}}/);
}

const templateCases = [
  ['general', 'setup', 'GeneralSetupCase'],
  ['general', 'normal', 'GeneralNormalCase'],
  ['single-pick', 'setup', 'SinglePickSetupCase'],
  ['single-pick', 'normal', 'SinglePickNormalCase'],
  ['multiple-pick', 'setup', 'MultiplePickSetupCase'],
  ['multiple-pick', 'normal', 'MultiplePickNormalCase'],
];

describe('generateComponent', () => {
  beforeEach(() => {
    createTempWorkspace();
  });

  afterEach(() => {
    cleanupTempWorkspace();
  });

  it.each(templateCases)('generates required files for %s/%s', (templateType, vueTemplateType, name) => {
    const result = generateComponent({
      name,
      rootPath: 'output',
      templateType,
      vueTemplateType,
      collisionStrategy: 'skip',
    });

    expect(result.success).toBe(true);
    expect(result.componentName).toBe(name);
    expect(result.templateType).toBe(templateType);
    expect(result.vueTemplateType).toBe(vueTemplateType);
    expect(result.files).toEqual([
      `output/${name}/src/index.scss`,
      `output/${name}/src/index.vue`,
      `output/${name}/src/typing.ts`,
      `output/${name}/src/hook.ts`,
      `output/${name}/src/data.ts`,
      `output/${name}/index.ts`,
    ]);

    for (const file of result.files) {
      expect(fs.existsSync(path.join(tempRoot, file))).toBe(true);
    }

    const indexVue = readGeneratedFile(name, 'src/index.vue');
    const typing = readGeneratedFile(name, 'src/typing.ts');
    const hook = readGeneratedFile(name, 'src/hook.ts');
    const entry = readGeneratedFile(name, 'index.ts');

    expect(indexVue).toContain(`name: '${name}'`);
    expect(indexVue).toContain(`use${name}`);
    expectNoTemplatePlaceholders(indexVue);
    expect(typing).toContain(`export interface ${name}Props`);
    expect(hook).toContain(`use${name}`);
    expect(entry).toContain(`import ${name} from './src/index.vue'`);
  });

  it('returns an error when target exists and collision strategy is skip', () => {
    const firstResult = generateComponent({
      name: 'CollisionCase',
      rootPath: 'output',
      collisionStrategy: 'skip',
    });
    const secondResult = generateComponent({
      name: 'CollisionCase',
      rootPath: 'output',
      collisionStrategy: 'skip',
    });

    expect(firstResult.success).toBe(true);
    expect(secondResult.success).toBe(false);
    expect(secondResult.error).toContain('CollisionCase');
  });

  it('overwrites an existing target directory when collision strategy is overwrite', () => {
    const targetDir = path.join(tempRoot, 'output', 'OverwriteCase');
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'old-file.txt'), 'old content', 'utf-8');

    const result = generateComponent({
      name: 'OverwriteCase',
      rootPath: 'output',
      collisionStrategy: 'overwrite',
    });

    expect(result.success).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'old-file.txt'))).toBe(false);
    expect(fs.existsSync(path.join(targetDir, 'src', 'index.vue'))).toBe(true);
  });

  it('rejects invalid template options', () => {
    const invalidTemplateType = generateComponent({
      name: 'InvalidCase',
      rootPath: 'output',
      templateType: 'unknown',
    });
    const invalidVueTemplateType = generateComponent({
      name: 'InvalidCase',
      rootPath: 'output',
      vueTemplateType: 'unknown',
    });

    expect(invalidTemplateType.success).toBe(false);
    expect(invalidTemplateType.error).toContain('templateType');
    expect(invalidVueTemplateType.success).toBe(false);
    expect(invalidVueTemplateType.error).toContain('vueTemplateType');
  });
});
