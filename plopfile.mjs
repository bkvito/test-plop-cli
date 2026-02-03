import * as changeCase from 'change-case';
import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = `src/components/platform`;

export default (plop) => {
  plop.setGenerator('create-component-template', {
    description: '----组件模板生成器----',
    prompts: [
      {
        type: 'input',
        name: 'rootPath',
        message: '请输入组件生成路径:',
        // 逻辑：如果命令行传入了 --rootPath，则使用它，否则使用默认值
        default: (data) => data.rootPath || `src/components/platform`, 
      },
      {
        type: 'list',
        name: 'templateType',
        message: '请选择组件模板(使用上下箭头进行选择):',
        choices: [
          { name: 'VUE普通组合式API组件模板', value: 'normal' },
          { name: 'VUE的setup语法糖组件模板', value: 'setup' },
        ],
        default: 'normal'
      },
      {
        type: 'input',
        name: 'name',
        message: '请输入组件名称 (大驼峰):',
        // 逻辑：如果命令行传入了 --name，则使用它，否则使用 'CustomComponent'
        default: (data) => data.name || 'CustomComponent',
      },
      {
        type: 'list', // 使用 list 提供明确的选择
        name: 'collisionStrategy',
        message: (data) => `目录 ${data.rootPath}/${data.name} 已存在，请选择操作：`,
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '重新输入名称', value: 'retry' },
        ],
        // 关键：只有当目录存在时才触发
        when: (data) => {
          const targetPath = path.join(process.cwd(), data.rootPath, data.name);
          return fs.existsSync(targetPath);
        },
      },
      {
        // 关键点：如果用户选择 'retry'，我们通过 validate 拦截并强制用户回到上一步
        type: 'input',
        name: 'retryName',
        message: '请重新输入组件名称（按回车确认后将刷新名称）：',
        when: (data) => data.collisionStrategy === 'retry',
        validate: (value, data) => {
          // 这里利用 validate 的特性：
          // 我们直接修改上层 data.name，然后返回一个错误信息，
          // 实际上会迫使 Inquirer 停留在这里，但此时 data.name 已经被修正
          if (value && value !== data.name) {
             data.name = value; // 覆盖之前的 name
             // 检查新名字是否依然冲突
             const newPath = path.join(process.cwd(), data.rootPath, value);
             if (fs.existsSync(newPath)) {
                return '新名称依然存在，请再次输入或 Ctrl+C 退出';
             }
             return true;
          }
          return '请输入一个新的名称以避开冲突';
        }
      }
    ],

    actions: (data) => {
      const actions = [];
      // 最终确定的组件名（可能是初始输入的，也可能是 retry 后修正的）
      const finalName = data.name; 
      
      const camelCase = changeCase.camelCase(finalName);
      const componentName = changeCase.pascalCase(camelCase);
      const className = changeCase.kebabCase(camelCase);
      const targetFolder = `${data.rootPath}/${componentName}`;

      // 1. 如果选择了覆盖，执行删除动作
      if (data.collisionStrategy === 'overwrite') {
        actions.push({
          type: 'deleteTargetDir',
          path: targetFolder,
        });
      }

      const vueTemplateFile = data.templateType === 'setup' ? 'index.setup.vue.hbs' : 'index.vue.hbs';

      // 2. 生成文件列表 (统一配置)
      const templates = [
        { file: 'index.scss', data: { class: className } },
        { 
            file: 'index.vue', 
            templateFile: vueTemplateFile,
            data: { class: className, componentName } 
        },
        { file: 'typing.ts', data: { interfaceName: componentName } },
        { file: 'hook.ts', data: { componentName } },
        { file: 'index.ts', data: { componentName } },
        { file: 'data.ts' },
      ];

      templates.forEach(item => {
        actions.push({
          type: 'add',
          force: true, // 既然上面已经处理了删除逻辑，这里 force: true 确保写入成功
          path: item.file === 'index.ts' ? `${targetFolder}/index.ts` : `${targetFolder}/src/${item.file}`,
          templateFile: `${__dirname}/plop-templates/${item.templateFile || item.file + '.hbs'}`,
          data: item.data,
        });
      });

      return actions;
    },
  });

  // 注册自定义 Action：删除目录
  plop.setActionType('deleteTargetDir', (answers, config) => {
    const targetDir = path.join(process.cwd(), config.path);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      return `[Clean] 已清理旧目录: ${config.path}`;
    }
    return '无需清理';
  });
};
