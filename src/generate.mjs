import * as changeCase from 'change-case';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '..', 'plop-templates');

const VALID_TEMPLATE_TYPES = ['setup', 'normal'];
const VALID_COLLISION_STRATEGIES = ['skip', 'overwrite'];

const TEMPLATE_CONFIG = [
  { file: 'index.scss', dest: 'src', templateFile: 'index.scss.hbs', getData: (cn, cl) => ({ class: cl }) },
  { file: 'index.vue', dest: 'src', getData: (cn, cl, tt) => ({
    templateFile: tt === 'setup' ? 'index.setup.vue.hbs' : 'index.vue.hbs',
    data: { class: cl, componentName: cn },
  })},
  { file: 'typing.ts', dest: 'src', templateFile: 'typing.ts.hbs', getData: (cn) => ({ interfaceName: cn }) },
  { file: 'hook.ts', dest: 'src', templateFile: 'hook.ts.hbs', getData: (cn) => ({ componentName: cn }) },
  { file: 'data.ts', dest: 'src', templateFile: 'data.ts.hbs', getData: () => ({}) },
  { file: 'index.ts', dest: '', templateFile: 'index.ts.hbs', getData: (cn) => ({ componentName: cn }) },
];

function renderTemplate(templateName, data) {
  const filePath = path.join(TEMPLATES_DIR, templateName);
  const source = fs.readFileSync(filePath, 'utf-8');
  let result = source;
  for (const [key, value] of Object.entries(data)) {
    result = result.replaceAll(`{{ ${key} }}`, String(value));
    result = result.replaceAll(`{{${key}}}`, String(value));
  }
  return result;
}

export function generateComponent({ name, rootPath, templateType = 'setup', collisionStrategy = 'skip' }) {
  if (!name || typeof name !== 'string') {
    return { success: false, error: '缺少必填参数: --name (组件名称)' };
  }
  if (!rootPath || typeof rootPath !== 'string') {
    return { success: false, error: '缺少必填参数: --rootPath (组件生成路径)' };
  }
  if (!VALID_TEMPLATE_TYPES.includes(templateType)) {
    return { success: false, error: `无效的 templateType: "${templateType}"，可选值: ${VALID_TEMPLATE_TYPES.join(', ')}` };
  }
  if (!VALID_COLLISION_STRATEGIES.includes(collisionStrategy)) {
    return { success: false, error: `无效的 collisionStrategy: "${collisionStrategy}"，可选值: ${VALID_COLLISION_STRATEGIES.join(', ')}` };
  }

  const camelName = changeCase.camelCase(name);
  const componentName = changeCase.pascalCase(camelName);
  const className = changeCase.kebabCase(camelName);
  const targetFolder = path.join(rootPath, componentName);
  const fullTargetPath = path.join(process.cwd(), targetFolder);

  if (fs.existsSync(fullTargetPath)) {
    if (collisionStrategy === 'skip') {
      return { success: false, error: `目录已存在: ${targetFolder}（使用 --collisionStrategy=overwrite 覆盖）` };
    }
    if (collisionStrategy === 'overwrite') {
      fs.rmSync(fullTargetPath, { recursive: true, force: true });
    }
  }

  const generatedFiles = [];

  for (const item of TEMPLATE_CONFIG) {
    const itemResult = item.getData(componentName, className, templateType);
    const templateFile = itemResult.templateFile || item.templateFile;
    const templateData = itemResult.data || itemResult;

    const destDir = item.dest === ''
      ? fullTargetPath
      : path.join(fullTargetPath, item.dest);
    const destFile = path.join(destDir, item.file);

    fs.mkdirSync(destDir, { recursive: true });

    const content = renderTemplate(templateFile, templateData);
    fs.writeFileSync(destFile, content, 'utf-8');
    generatedFiles.push(path.join(targetFolder, item.dest, item.file).replace(/\\/g, '/'));
  }

  return { success: true, files: generatedFiles, componentName, targetFolder };
}
