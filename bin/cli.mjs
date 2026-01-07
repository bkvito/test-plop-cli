#!/usr/bin/env node
// 
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Plop, run } from 'plop';
import minimist from 'minimist'; // 推荐安装 minimist 解析参数

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const argv = minimist(args);

Plop.prepare({
  configPath: path.join(__dirname, '../plopfile.mjs'),
  import: []
}, env => {
  // 关键：将解析后的 argv 传递给 run
  Plop.execute(env, (env) => {
    const options = {
      ...env,
      dest: process.cwd()
    };
    return run(options, undefined, true);
  });
});