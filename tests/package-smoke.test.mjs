import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const repoRoot = path.resolve(import.meta.dirname, '..');
let tempRoot;

function createTempWorkspace() {
  // tempRoot 表示 npm pack 的输出目录，用来避免打包产物落到仓库根目录。
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cctc-pack-'));
}

function cleanupTempWorkspace() {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function runNpmPack() {
  return spawnSync('npm', ['pack', '--json', '--pack-destination', tempRoot, '--cache', path.join(tempRoot, '.npm-cache')], {
    cwd: repoRoot,
    encoding: 'utf-8',
    shell: process.platform === 'win32',
  });
}

function getPackedFilePaths(packResult) {
  const [packedPackage] = JSON.parse(packResult.stdout);

  return {
    tarballPath: path.join(tempRoot, packedPackage.filename),
    filePaths: packedPackage.files.map((file) => file.path.replaceAll('\\', '/')),
  };
}

describe('package smoke', () => {
  beforeEach(() => {
    createTempWorkspace();
  });

  afterEach(() => {
    cleanupTempWorkspace();
  });

  it('creates an npm tarball with required runtime files', () => {
    const result = runNpmPack();

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');

    const { tarballPath, filePaths } = getPackedFilePaths(result);

    expect(fs.existsSync(tarballPath)).toBe(true);
    expect(filePaths).toContain('package.json');
    expect(filePaths).toContain('bin/cli.mjs');
    expect(filePaths).toContain('src/generate.mjs');
    expect(filePaths).toContain('plopfile.mjs');
    expect(filePaths).toContain('plop-templates/general/index.setup.vue.hbs');
    expect(filePaths).toContain('plop-templates/single-pick/index.setup.vue.hbs');
    expect(filePaths).toContain('plop-templates/multiple-pick/index.setup.vue.hbs');
  });
});
