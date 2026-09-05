import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.resolve(root, '../ai_product2_integrated.xml')
const outputPath = path.join(root, 'public/data/questions.json')
const existingClassifications = fs.existsSync(outputPath) ? new Map(JSON.parse(fs.readFileSync(outputPath, 'utf8')).questions.map((question) => [question.id, {
  mainCategory: question.mainCategory,
  businessCategories: question.businessCategories,
  corePoints: question.corePoints,
}])) : new Map()
const xml = fs.readFileSync(sourcePath, 'utf8')
const strip = (value) => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim()
const splitTags = (value) => value.split(/\s*\/\s*|、/).map((item) => item.trim()).filter(Boolean)
const frequencyMap = { 超高频: 'S', 高频: 'A', 中高频: 'B', 中频: 'C' }
const specificMap = { 是: 'yes', 否: 'no', 半是: 'partial' }
const normalizeCompanies = (values, number) => [...new Set(values.flatMap((value) => {
  if (value === 'TRAE' || value === '字节') return ['字节跳动']
  if (['办公 Agent 方向', '企业 ToB', 'ToB', '教育方向'].includes(value)) return ['通用']
  if (number === 42 && (value === '影像' || value === '影像方向')) return []
  return [value]
}))]

const questions = []
const tokenPattern = /<(h2|h3|h4|p|ul)>[\s\S]*?<\/\1>/g
for (const tokenMatch of xml.matchAll(tokenPattern)) {
  const token = tokenMatch[0]
  const tag = tokenMatch[1]
  const text = strip(token)
  if (tag === 'h4' && /^母题\s*\d+｜/.test(text)) {
    const number = Number(text.match(/^母题\s*(\d+)/)?.[1])
    questions.push({
      id: `Q-${String(number).padStart(4, '0')}`,
      title: number === 42 ? '美图方向：AIGC 修图或写真产品如何做差异化与体验优化？' : text.replace(/^母题\s*\d+｜/, ''),
      ...existingClassifications.get(`Q-${String(number).padStart(4, '0')}`),
      tags: null,
      similarQuestions: [],
      sources: [{ document: 'ai_product2_integrated.xml', reference: `母题 ${number}` }],
      updatedAt: '2026-08-30',
    })
  } else if (tag === 'p' && text.startsWith('标签：') && questions.length) {
    const fields = Object.fromEntries(text.replace(/^标签：/, '').split('｜').map((part) => {
      const index = part.indexOf('=')
      return [part.slice(0, index), part.slice(index + 1)]
    }))
    questions.at(-1).tags = {
      company: normalizeCompanies(splitTags(fields['公司标签']), Number(questions.at(-1).id.slice(2))),
      companyStyle: splitTags(fields['公司风格']),
      interviewStage: splitTags(fields['轮次标签']),
      frequency: frequencyMap[fields['频级']],
      companySpecific: specificMap[fields['是否公司特异']],
    }
  } else if (tag === 'ul' && questions.length && questions.at(-1).similarQuestions.length === 0) {
    questions.at(-1).similarQuestions = [...token.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((item) => strip(item[1]))
  }
}

if (questions.length !== 45 || questions.some((question) => !question.tags || !question.mainCategory || !question.businessCategories?.[0] || !question.corePoints?.[0])) {
  throw new Error(`整合文档解析异常：得到 ${questions.length} 道母题`)
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify({ version: '1.0.2', updatedAt: '2026-08-30', originalQuestionCount: 361, questions }, null, 2) + '\n')
console.log(`已从整合文档生成 ${questions.length} 道母题。`)
