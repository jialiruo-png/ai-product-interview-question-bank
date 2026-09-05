# AI 产品面试题库

一个纯前端的中文知识卡片工具，将 361 道原始面试题归并为 45 道母题，集中管理题目、相似问法、标签与来源。首版不包含回答框架、答案、个人案例等内容。

## 在 VSCode 中打开

1. 在 VSCode 选择「文件 → 打开文件夹」。
2. 选择 `ai-interview-question-bank` 目录。
3. 打开终端并执行：

```bash
pnpm install
pnpm run dev
```

开发地址默认为 `http://localhost:5173`。

## 常用命令

```bash
pnpm run dev           # 启动本地开发服务器
pnpm run validate:data # 校验题库 Schema、重复 ID、重复母题和相似问法
pnpm run lint          # 检查 TypeScript / React 代码
pnpm run build         # 生成 dist 静态站点
pnpm run import:integrated # 从上级目录的整合 XML 重新生成题库（仅首次迁移/受控重建）
```

## 题库文件与更新流程

网页唯一发布底库是 `public/data/questions.json`，结构约束位于 `schemas/questions.schema.json`。

### 网页内日常维护

1. 点击「新增母题」或题卡右上角编辑按钮。
2. 修改结果会保存到当前浏览器的 `localStorage`，不会直接写回服务器或源码。
3. 点击「导出完整题库」，下载新的 JSON。
4. 用下载文件替换 `public/data/questions.json`。
5. 依次运行 `pnpm run validate:data`、`pnpm run lint`、`pnpm run build`。
6. 提交 Git 并重新部署。

「导出当前结果」只适合备份或分享筛选结果，不应用它覆盖完整底库。导入 JSON 时，网页会先检查关键字段、ID 格式、重复 ID、频级和公司特异性枚举，再由用户确认覆盖浏览器数据。

### 直接编辑 JSON

适合批量调整标签。VSCode 可结合 Schema 查看字段约束；修改后必须运行数据校验。题目使用稳定 ID（如 `Q-0001`），修改标题时不要改变 ID。

## 飞书文档新增题目后的推荐迭代流程

1. 在飞书文档保留「待入库」区，放入新题、面经文本或 OCR 内容。
2. 对每道新题人工判断：新建母题，还是并入现有母题的 `similarQuestions`。
3. 确认主分类、业务分类、核心考点、公司、公司风格、面试阶段、频级、公司特异性与来源。
4. 通过网页表单新增/编辑并导出完整 JSON，或直接修改 `questions.json`。
5. 运行数据校验并人工抽查，避免自动同步覆盖已确认的归并关系。
6. 构建、提交并部署。

`import:integrated` 会按当前 `ai_product2_integrated.xml` 的固定结构重建 45 道母题，只适合受控迁移，不建议把未审核的飞书内容直接自动覆盖底库。

## 数据模型说明

每道母题包含：

- `id`、`title`、`mainCategory`、`businessCategories`、`corePoints`
- `tags.company`、`companyStyle`、`interviewStage`、`frequency`、`companySpecific`
- `similarQuestions`、`sources`、`updatedAt`

频级使用 `S / A / B / C`，分别对应超高频、高频、中高频、中频。`companySpecific` 使用 `yes / no / partial`。本项目刻意不定义任何答案字段。

## 为什么不依赖 GitHub 也能运行

本项目是标准 React + TypeScript 静态应用。安装依赖后可在任意电脑本地运行，构建后的 `dist` 也可部署到任意静态托管服务，因此 GitHub 不是运行前提。

仍建议建立 GitHub 仓库：它可以记录题库每次变更、支持回滚与协作审核，并可通过 GitHub Actions 自动执行数据校验、构建和部署，降低长期维护风险。
