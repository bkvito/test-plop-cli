import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateComponent } from '../src/generate.mjs';

let originalCwd;
let tempRoot;

function createTempWorkspace() {
  // tempRoot 表示快照测试的隔离目录，用来保证快照只记录生成结果，不受仓库内旧产物影响。
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cctc-snapshot-'));
  originalCwd = process.cwd();
  process.chdir(tempRoot);
}

function cleanupTempWorkspace() {
  process.chdir(originalCwd);
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function readOutputFiles(componentName) {
  const componentRoot = path.join(tempRoot, 'output', componentName);
  const outputFiles = [
    'index.ts',
    'src/data.ts',
    'src/hook.ts',
    'src/index.scss',
    'src/index.vue',
    'src/typing.ts',
  ];

  return Object.fromEntries(
    outputFiles.map((relativeFilePath) => {
      const filePath = path.join(componentRoot, ...relativeFilePath.split('/'));
      const content = fs.readFileSync(filePath, 'utf-8').replaceAll('\r\n', '\n');

      return [relativeFilePath, content];
    }),
  );
}

const templateCases = [
  ['general', 'setup', 'SnapshotGeneralSetup'],
  ['general', 'normal', 'SnapshotGeneralNormal'],
  ['single-pick', 'setup', 'SnapshotSinglePickSetup'],
  ['single-pick', 'normal', 'SnapshotSinglePickNormal'],
  ['multiple-pick', 'setup', 'SnapshotMultiplePickSetup'],
  ['multiple-pick', 'normal', 'SnapshotMultiplePickNormal'],
];

describe('template snapshots', () => {
  beforeEach(() => {
    createTempWorkspace();
  });

  afterEach(() => {
    cleanupTempWorkspace();
  });

  it.each(templateCases)('matches generated output for %s/%s', (templateType, vueTemplateType, name) => {
    const result = generateComponent({
      name,
      rootPath: 'output',
      templateType,
      vueTemplateType,
      collisionStrategy: 'overwrite',
    });

    expect(result.success).toBe(true);
    expect(readOutputFiles(name)).toMatchSnapshot();
  });
});
