import * as changeCase from 'change-case';
import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUSINESS_TEMPLATE_CHOICES = [
  { name: '通用模板', value: 'general' },
  { name: '产品组单选模板', value: 'single-pick' },
  { name: '产品组多选模板', value: 'multiple-pick' },
];

const VUE_TEMPLATE_STYLE_CHOICES = [
  { name: 'script setup 风格', value: 'setup' },
  { name: 'defineComponent 风格', value: 'normal' },
];

const BUSINESS_TEMPLATE_DIR_MAP = {
  general: 'general',
  'single-pick': 'single-pick',
  'multiple-pick': 'multiple-pick',
};

const VUE_TEMPLATE_FILE_MAP = {
  setup: 'index.setup.vue.hbs',
  normal: 'index.normal.vue.hbs',
};

const TEMPLATE_FILES = [
  { file: 'index.scss', output: 'src/index.scss', templateFile: 'index.scss.hbs', getData: (componentName, className) => ({ class: className, componentName }) },
  { file: 'index.vue', output: 'src/index.vue', type: 'vue-entry', getData: (componentName, className) => ({ class: className, componentName }) },
  { file: 'typing.ts', output: 'src/typing.ts', templateFile: 'typing.ts.hbs', getData: (componentName) => ({ interfaceName: componentName, componentName }) },
  { file: 'hook.ts', output: 'src/hook.ts', templateFile: 'hook.ts.hbs', getData: (componentName) => ({ componentName }) },
  { file: 'data.ts', output: 'src/data.ts', templateFile: 'data.ts.hbs', getData: (componentName) => ({ componentName }) },
  { file: 'index.ts', output: 'index.ts', templateFile: 'index.ts.hbs', getData: (componentName) => ({ componentName }) },
];

export default (plop) => {
  plop.setGenerator('create-component-template', {
    description: '----组件模板生成器---',
    prompts: [
      {
        type: 'input',
        name: 'rootPath',
        message: '请输入组件生成路径:',
        default: (data) => data.rootPath || 'src/components/platform',
      },
      {
        type: 'list',
        name: 'templateType',
        message: '请选择业务模板类型:',
        choices: BUSINESS_TEMPLATE_CHOICES,
        default: 'general',
      },
      {
        type: 'list',
        name: 'vueTemplateType',
        message: '请选择 index.vue 的 Vue 语法风格:',
        choices: VUE_TEMPLATE_STYLE_CHOICES,
        default: 'setup',
      },
      {
        type: 'input',
        name: 'name',
        message: '请输入组件名称(大驼峰):',
        default: (data) => data.name || 'CustomComponent',
      },
      {
        type: 'list',
        name: 'collisionStrategy',
        message: (data) => `目录 ${data.rootPath}/${data.name} 已存在，请选择处理方式:`,
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '重新输入名称', value: 'retry' },
        ],
        when: (data) => {
          const targetPath = path.join(process.cwd(), data.rootPath, data.name);
          return fs.existsSync(targetPath);
        },
      },
      {
        type: 'input',
        name: 'retryName',
        message: '请输入新的组件名称:',
        when: (data) => data.collisionStrategy === 'retry',
        validate: (value, data) => {
          if (value && value !== data.name) {
            data.name = value;
            const newPath = path.join(process.cwd(), data.rootPath, value);
            if (fs.existsSync(newPath)) {
              return '新名称仍然已存在，请再次输入或 Ctrl+C 退出';
            }
            return true;
          }
          return '请输入一个新的组件名称以避开冲突';
        },
      },
    ],

    actions: (data) => {
      const actions = [];
      const finalName = data.name;
      const camelName = changeCase.camelCase(finalName);
      const componentName = changeCase.pascalCase(camelName);
      const className = changeCase.kebabCase(camelName);
      const targetFolder = `${data.rootPath}/${componentName}`;
      const businessTemplateDir = BUSINESS_TEMPLATE_DIR_MAP[data.templateType];
      const vueTemplateFile = VUE_TEMPLATE_FILE_MAP[data.vueTemplateType];

      if (data.collisionStrategy === 'overwrite') {
        actions.push({
          type: 'deleteTargetDir',
          path: targetFolder,
        });
      }

      TEMPLATE_FILES.forEach((item) => {
        const templateFile = item.type === 'vue-entry' ? vueTemplateFile : item.templateFile;
        actions.push({
          type: 'add',
          force: true,
          path: `${targetFolder}/${item.output}`,
          templateFile: `${__dirname}/plop-templates/${businessTemplateDir}/${templateFile}`,
          data: item.getData(componentName, className),
        });
      });

      return actions;
    },
  });

  plop.setActionType('deleteTargetDir', (answers, config) => {
    const targetDir = path.join(process.cwd(), config.path);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      return `[Clean] 已清理旧目录: ${config.path}`;
    }
    return '无需清理';
  });
};
