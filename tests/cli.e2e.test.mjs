import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import pkg from '../package.json' with { type: 'json' };

const repoRoot = path.resolve(import.meta.dirname, '..');
const cliPath = path.join(repoRoot, 'bin', 'cli.mjs');
let tempRoot;

function createTempWorkspace() {
  // tempRoot 表示 CLI E2E 的执行目录，用来模拟用户在任意目录调用脚手架。
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cctc-cli-'));
}

function cleanupTempWorkspace() {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function runCli(args, options = {}) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? tempRoot,
    encoding: 'utf-8',
  });
}

describe('CLI E2E', () => {
  beforeEach(() => {
    createTempWorkspace();
  });

  afterEach(() => {
    cleanupTempWorkspace();
  });

  it('prints version', () => {
    const result = runCli(['--version']);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`cvct v${pkg.version}`);
  });

  it('generates a component in non-interactive mode', () => {
    const result = runCli([
      '--name=CliSinglePick',
      '--rootPath=components',
      '--templateType=single-pick',
      '--vueTemplateType=setup',
      '--collisionStrategy=overwrite',
    ]);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('CliSinglePick');

    const componentRoot = path.join(tempRoot, 'components', 'CliSinglePick');
    const indexVue = fs.readFileSync(path.join(componentRoot, 'src', 'index.vue'), 'utf-8');

    expect(fs.existsSync(path.join(componentRoot, 'index.ts'))).toBe(true);
    expect(indexVue).toContain("name: 'CliSinglePick'");
    expect(indexVue).not.toContain('{{');
  });

  it('fails fast in strict non-interactive mode when required args are missing', () => {
    const result = runCli(['--nonInteractive']);

    expect(result.status).toBe(1);
    expect(result.stderr).not.toBe('');
  });
});
