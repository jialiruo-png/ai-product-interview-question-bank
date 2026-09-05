import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv/dist/2020.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(fs.readFileSync(path.join(root, 'public/data/questions.json'), 'utf8'))
const schema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/questions.schema.json'), 'utf8'))
const ajv = new Ajv({ allErrors: true, strict: false, formats: { date: /^\d{4}-\d{2}-\d{2}$/ } })
const validate = ajv.compile(schema)

if (!validate(data)) {
  console.error('题库 Schema 校验失败：')
  for (const error of validate.errors ?? []) console.error(`- ${error.instancePath || '/'} ${error.message}`)
  process.exit(1)
}

const errors = []
const ids = new Set()
const titles = new Set()
const forbiddenCompanies = new Set(['字节', 'TRAE', '影像', '影像方向', '办公 Agent 方向', '企业 ToB', 'ToB', '教育方向'])
const forbiddenBusinesses = new Set(['办公 Agent 方向', '企业 ToB', 'ToB', '教育方向'])
for (const question of data.questions) {
  if (ids.has(question.id)) errors.push(`重复 ID：${question.id}`)
  ids.add(question.id)
  const titleKey = question.title.trim().toLowerCase()
  if (titles.has(titleKey)) errors.push(`重复母题：${question.title}`)
  titles.add(titleKey)
  for (const company of question.tags.company) {
    if (forbiddenCompanies.has(company)) errors.push(`${question.id} 包含已禁用公司分类：${company}`)
  }
  for (const business of question.businessCategories) {
    if (forbiddenBusinesses.has(business)) errors.push(`${question.id} 包含已禁用业务分类：${business}`)
  }
  const variants = new Set()
  for (const item of question.similarQuestions) {
    const key = item.trim().toLowerCase()
    if (variants.has(key)) errors.push(`${question.id} 存在重复相似问法：${item}`)
    variants.add(key)
  }
}
if (errors.length) {
  console.error('题库业务校验失败：\n' + errors.map((item) => `- ${item}`).join('\n'))
  process.exit(1)
}
console.log(`题库校验通过：${data.questions.length} 道母题，原始来源 ${data.originalQuestionCount} 道题。`)
