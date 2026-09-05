# AI 产品经理面试题库

把零散面经整理成一套可检索、可筛选、可持续维护的 AI 产品面试复习系统。

目前题库将 **361 道原始题目**归并为 **45 道母题**，并整理了 **183 条相似问法**。内容覆盖 AI 产品、AI 应用、Agent、RAG、模型与 Prompt、评测、增长、商业化、项目经历及职业动机等常见面试方向。

> 项目仍在持续迭代。当前版本专注于题目归并、分类与检索，暂不包含标准答案、个人案例和回答框架。

## 在线体验

[打开 AI 产品经理面试题库](https://jialiruo-png.github.io/ai-product-interview-question-bank/)

## 为什么做这个项目

准备 AI 产品经理面试时，真实面经通常散落在小红书、备忘录和飞书文档里。随着收集量增加，同一道题会以不同公司的业务语境反复出现，重复题和相似问法越来越多，想集中复习某个知识点也很难快速定位。

这个项目没有继续堆叠题目，而是先把零散问题归并成更稳定的“母题”，再把不同公司和场景下的相似问法挂到母题下面。目标是帮助使用者先抓住底层考察能力，再针对具体岗位和业务场景进行准备。

## 在线资料

- [飞书题库文档](https://wcn6t4b50ylf.feishu.cn/wiki/BNPWwqjknil7zBkM3zqcLsRWnJH?from=from_copylink)
- [AI 产品面试指南](./AI%20产品面试指南.md)
- [题库多维表格数据](./AI产品面试题多维表格_数据表.xlsx)

## 核心功能

- 关键词搜索题目和相似问法
- 按主分类、业务分类、核心考点、公司、面试阶段和频级组合筛选
- 用母题聚合同一能力点在不同公司、不同业务场景下的问法
- 展示公司、轮次、频级、公司特异性等结构化标签
- 在网页中新增、编辑、导入和导出题库数据
- 使用 JSON Schema 和校验脚本检查题库结构及重复内容
- 将浏览器中的个人修改保存在 `localStorage`，避免直接覆盖源码底库

## 题库分类

### 主分类

包括项目经历与个人贡献、产品设计与用户需求、技术原理与工程实现、数据评测与迭代优化等能力维度。

### 业务分类

包括通用、办公、搜索、内容创作、电商、游戏和 AI Coding 等业务方向。

### 核心考点

包括 RAG / 搜索 / 知识库、Agent / Workflow / 多智能体、模型与 Prompt、评测体系、Bad Case 闭环、商业化和跨团队协作等主题。

## 本地运行

项目网页位于 `ai-interview-question-bank` 子目录，需要 Node.js 和 pnpm。

```bash
git clone https://github.com/jialiruo-png/ai-product-interview-question-bank.git
cd ai-product-interview-question-bank/ai-interview-question-bank
pnpm install
pnpm run dev
```

启动后访问 `http://localhost:5173`。

## 常用命令

```bash
pnpm run dev           # 启动本地开发服务器
pnpm run validate:data # 校验 Schema、ID、母题和相似问法
pnpm run lint          # 检查 TypeScript / React 代码
pnpm run build         # 生成生产构建
```

## 数据维护

网页使用的题库底库位于：

```text
ai-interview-question-bank/public/data/questions.json
```

数据结构约束位于：

```text
ai-interview-question-bank/schemas/questions.schema.json
```

每道母题主要包含以下信息：

- 稳定 ID、题目标题和更新时间
- 主分类、业务分类和核心考点
- 公司、公司风格、面试阶段、频级及公司特异性
- 相似问法和题目来源

网页内编辑的数据默认保存在当前浏览器中。如需更新仓库底库，请导出完整题库并替换 `questions.json`，随后运行数据校验、代码检查和生产构建。

## 项目结构

```text
.
├── README.md
├── AI 产品面试指南.md
├── AI产品面试题多维表格_数据表.xlsx
├── plan.md
└── ai-interview-question-bank/
    ├── public/data/questions.json
    ├── schemas/questions.schema.json
    ├── scripts/
    └── src/
```

## 后续规划

- 打通飞书文档、多维表格与网页的数据同步
- 增加回答框架、个人项目案例、易错点和准备状态
- 根据目标公司或岗位 JD 生成面试准备清单
- 支持模拟追问和公司专项题
- 增加“今日复习”与薄弱考点推荐

这个项目希望把“到处搜题”变成“有路径地准备”。如果你也在准备 AI 产品相关面试，欢迎通过 Issue 分享建议或补充面经。
