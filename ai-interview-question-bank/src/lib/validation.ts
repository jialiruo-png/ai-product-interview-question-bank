import type { QuestionBank } from '../types'

const FORBIDDEN_COMPANIES = new Set(['字节', 'TRAE', '影像', '影像方向', '办公 Agent 方向', '企业 ToB', 'ToB', '教育方向'])
const FORBIDDEN_BUSINESSES = new Set(['办公 Agent 方向', '企业 ToB', 'ToB', '教育方向'])

export function validateQuestionBank(value: unknown): { valid: boolean; errors: string[]; data?: QuestionBank } {
  const errors: string[] = []
  if (!value || typeof value !== 'object') return { valid: false, errors: ['文件内容必须是 JSON 对象。'] }
  const bank = value as Partial<QuestionBank>
  if (!Array.isArray(bank.questions) || bank.questions.length === 0) errors.push('questions 必须是非空数组。')
  if (typeof bank.version !== 'string') errors.push('缺少 version。')
  if (typeof bank.updatedAt !== 'string') errors.push('缺少 updatedAt。')
  if (typeof bank.originalQuestionCount !== 'number') errors.push('originalQuestionCount 必须是数字。')
  const ids = new Set<string>()
  bank.questions?.forEach((question, index) => {
    const prefix = `第 ${index + 1} 题`
    if (!/^Q-\d{4}$/.test(question?.id ?? '')) errors.push(`${prefix} ID 格式应为 Q-0001。`)
    if (ids.has(question.id)) errors.push(`${prefix} ID 重复：${question.id}`)
    ids.add(question.id)
    if (!question.title?.trim()) errors.push(`${prefix}缺少题目。`)
    if (!question.mainCategory?.trim()) errors.push(`${prefix}缺少主分类。`)
    if (!Array.isArray(question.businessCategories)) errors.push(`${prefix}业务分类应为数组。`)
    if (!Array.isArray(question.corePoints)) errors.push(`${prefix}核心考点应为数组。`)
    if (!question.tags || !['S', 'A', 'B', 'C'].includes(question.tags.frequency)) errors.push(`${prefix}频级不合法。`)
    if (!question.tags || !['yes', 'no', 'partial'].includes(question.tags.companySpecific)) errors.push(`${prefix}公司特异标记不合法。`)
    for (const key of ['company', 'companyStyle', 'interviewStage'] as const) {
      if (!Array.isArray(question.tags?.[key])) errors.push(`${prefix}的 ${key} 应为数组。`)
    }
    for (const company of question.tags?.company ?? []) {
      if (FORBIDDEN_COMPANIES.has(company)) errors.push(`${prefix}包含已禁用公司分类：${company}。`)
    }
    for (const business of question.businessCategories ?? []) {
      if (FORBIDDEN_BUSINESSES.has(business)) errors.push(`${prefix}包含已禁用业务分类：${business}。`)
    }
    if (!Array.isArray(question.similarQuestions)) errors.push(`${prefix}相似问法应为数组。`)
    if (!Array.isArray(question.sources) || !question.sources.length) errors.push(`${prefix}至少需要一个来源。`)
  })
  return errors.length ? { valid: false, errors } : { valid: true, errors: [], data: bank as QuestionBank }
}

export const csv = (value: string) => value.split(/[，,]/).map((item) => item.trim()).filter(Boolean)
