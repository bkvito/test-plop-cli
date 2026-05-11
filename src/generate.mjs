import * as changeCase from 'change-case';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '..', 'plop-templates');

const BUSINESS_TEMPLATE_MAP = {
  general: {
    label: '通用模板',
    templateDir: 'general',
  },
  'single-pick': {
    label: '产品组单选模板',
    templateDir: 'single-pick',
  },
  'multiple-pick': {
    label: '产品组多选模板',
    templateDir: 'multiple-pick',
  },
};

const VUE_TEMPLATE_STYLE_MAP = {
  setup: {
    label: 'script setup 风格',
    templateFile: 'index.setup.vue.hbs',
  },
  normal: {
    label: 'defineComponent 风格',
    templateFile: 'index.normal.vue.hbs',
  },
};

const VALID_COLLISION_STRATEGIES = ['skip', 'overwrite'];

const TEMPLATE_FILES = [
  { output: 'src/index.scss', templateFile: 'index.scss.hbs', getData: (componentName, className) => ({ class: className, componentName }) },
  { output: 'src/index.vue', type: 'vue-entry', getData: (componentName, className) => ({ class: className, componentName }) },
  { output: 'src/typing.ts', templateFile: 'typing.ts.hbs', getData: (componentName) => ({ interfaceName: componentName, componentName }) },
  { output: 'src/hook.ts', templateFile: 'hook.ts.hbs', getData: (componentName) => ({ componentName }) },
  { output: 'src/data.ts', templateFile: 'data.ts.hbs', getData: (componentName) => ({ componentName }) },
  { output: 'index.ts', templateFile: 'index.ts.hbs', getData: (componentName) => ({ componentName }) },
];

function renderTemplate(templatePath, data) {
  const source = fs.readFileSync(templatePath, 'utf-8');
  let result = source;
  for (const [key, value] of Object.entries(data)) {
    result = result.replaceAll(`{{ ${key} }}`, String(value));
    result = result.replaceAll(`{{${key}}}`, String(value));
  }
  return result;
}

function resolveTemplateOptions({ templateType, vueTemplateType }) {
  const businessTemplate = BUSINESS_TEMPLATE_MAP[templateType];
  const vueTemplateStyle = VUE_TEMPLATE_STYLE_MAP[vueTemplateType];

  if (!businessTemplate) {
    return {
      success: false,
      error: `无效的 templateType: "${templateType}"，可选值: ${Object.keys(BUSINESS_TEMPLATE_MAP).join(', ')}`,
    };
  }

  if (!vueTemplateStyle) {
    return {
      success: false,
      error: `无效的 vueTemplateType: "${vueTemplateType}"，可选值: ${Object.keys(VUE_TEMPLATE_STYLE_MAP).join(', ')}`,
    };
  }

  return {
    success: true,
    businessTemplate,
    vueTemplateStyle,
  };
}

export function generateComponent({
  name,
  rootPath,
  templateType = 'general',
  vueTemplateType = 'setup',
  collisionStrategy = 'skip',
}) {
  if (!name || typeof name !== 'string') {
    return { success: false, error: '缺少必填参数: --name (组件名称)' };
  }

  if (!rootPath || typeof rootPath !== 'string') {
    return { success: false, error: '缺少必填参数: --rootPath (组件生成路径)' };
  }

  const resolvedOptions = resolveTemplateOptions({ templateType, vueTemplateType });
  if (!resolvedOptions.success) {
    return resolvedOptions;
  }

  if (!VALID_COLLISION_STRATEGIES.includes(collisionStrategy)) {
    return {
      success: false,
      error: `无效的 collisionStrategy: "${collisionStrategy}"，可选值: ${VALID_COLLISION_STRATEGIES.join(', ')}`,
    };
  }

  const camelName = changeCase.camelCase(name);
  const componentName = changeCase.pascalCase(camelName);
  const className = changeCase.kebabCase(camelName);
  const targetFolder = path.join(rootPath, componentName);
  const fullTargetPath = path.join(process.cwd(), targetFolder);

  if (fs.existsSync(fullTargetPath)) {
    if (collisionStrategy === 'skip') {
      return {
        success: false,
        error: `目录已存在: ${targetFolder}（使用 --collisionStrategy=overwrite 覆盖）`,
      };
    }

    if (collisionStrategy === 'overwrite') {
      fs.rmSync(fullTargetPath, { recursive: true, force: true });
    }
  }

  const { businessTemplate, vueTemplateStyle } = resolvedOptions;
  const generatedFiles = [];

  for (const item of TEMPLATE_FILES) {
    const templateFile = item.type === 'vue-entry' ? vueTemplateStyle.templateFile : item.templateFile;
    const templatePath = path.join(TEMPLATES_DIR, businessTemplate.templateDir, templateFile);
    const templateData = item.getData(componentName, className);
    const destFile = path.join(fullTargetPath, item.output);
    const destDir = path.dirname(destFile);

    fs.mkdirSync(destDir, { recursive: true });

    const content = renderTemplate(templatePath, templateData);
    fs.writeFileSync(destFile, content, 'utf-8');
    generatedFiles.push(path.join(targetFolder, item.output).replace(/\\/g, '/'));
  }

  return {
    success: true,
    files: generatedFiles,
    componentName,
    targetFolder,
    templateType,
    vueTemplateType,
    templateLabel: businessTemplate.label,
    vueTemplateLabel: vueTemplateStyle.label,
  };
}
