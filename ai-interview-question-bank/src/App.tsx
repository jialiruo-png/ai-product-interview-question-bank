import React, { useEffect, useMemo, useState } from 'react'
import { BookOpen, Database, Menu, Plus, Search, X } from 'lucide-react'
import { DataActions } from './components/DataActions'
import { FilterPanel } from './components/FilterPanel'
import { QuestionCard } from './components/QuestionCard'
import { QuestionEditor } from './components/QuestionEditor'
import type { FilterKey, Filters, Question, QuestionBank } from './types'
import { validateQuestionBank } from './lib/validation'

const STORAGE_KEY = 'ai-interview-question-bank-v4'
const BLOCKED_CLASSIFICATIONS = new Set(['字节', 'TRAE', '影像', '影像方向', '办公 Agent 方向', '企业 ToB', 'ToB', '教育方向'])
const emptyFilters: Filters = { query: '', categories: [], businesses: [], corePoints: [], companies: [], stages: [], frequencies: [], companySpecific: 'all' }
const frequencyRank = { S: 0, A: 1, B: 2, C: 3 }

function filtersFromUrl(): Filters {
  const params = new URLSearchParams(window.location.search)
  const values = (key: string) => params.get(key)?.split('|').filter((value) => value && !BLOCKED_CLASSIFICATIONS.has(value)) ?? []
  const specific = params.get('specific')
  return { query: params.get('q') ?? '', categories: values('category'), businesses: values('business'), corePoints: values('core'), companies: values('company'), stages: values('stage'), frequencies: values('frequency'), companySpecific: specific === 'yes' || specific === 'no' || specific === 'partial' ? specific : 'all' }
}

const unique = (items: string[]) => [...new Set(items)].sort((a, b) => a.localeCompare(b, 'zh-CN'))
const hasAny = (selected: string[], values: string[]) => !selected.length || selected.some((item) => values.includes(item))

function storedBank(): QuestionBank | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    const result = validateQuestionBank(JSON.parse(stored))
    if (result.valid && result.data) return result.data
  } catch { localStorage.removeItem(STORAGE_KEY) }
  return null
}

export default function App() {
  const [bank, setBank] = useState<QuestionBank | null>(storedBank)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<Filters>(filtersFromUrl)
  const [sort, setSort] = useState('frequency')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Question | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    if (bank) return
    fetch('./data/questions.json', { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error('题库文件加载失败')
      return response.json() as Promise<QuestionBank>
    }).then(setBank).catch((reason: Error) => setError(reason.message))
  }, [bank])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.query) params.set('q', filters.query)
    const keys: Array<[keyof Filters, string]> = [['categories', 'category'], ['businesses', 'business'], ['corePoints', 'core'], ['companies', 'company'], ['stages', 'stage'], ['frequencies', 'frequency']]
    keys.forEach(([key, param]) => { const value = filters[key]; if (Array.isArray(value) && value.length) params.set(param, value.join('|')) })
    if (filters.companySpecific !== 'all') params.set('specific', filters.companySpecific)
    window.history.replaceState(null, '', `${window.location.pathname}${params.size ? `?${params}` : ''}`)
  }, [filters])

  const options = useMemo(() => {
    const questions = bank?.questions ?? []
    return {
      categories: unique(questions.map((item) => item.mainCategory)),
      businesses: unique(questions.flatMap((item) => item.businessCategories).filter((item) => !BLOCKED_CLASSIFICATIONS.has(item))),
      companies: unique(questions.flatMap((item) => item.tags.company).filter((item) => !BLOCKED_CLASSIFICATIONS.has(item))),
      corePoints: unique(questions.flatMap((item) => item.corePoints)),
      stages: unique(questions.flatMap((item) => item.tags.interviewStage)),
    }
  }, [bank])

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase()
    const list = (bank?.questions ?? []).filter((item) => {
      const searchable = [item.title, ...item.similarQuestions, item.mainCategory, ...item.businessCategories, ...item.tags.company, ...item.corePoints].join(' ').toLocaleLowerCase()
      return (!query || searchable.includes(query)) &&
        hasAny(filters.categories, [item.mainCategory]) && hasAny(filters.businesses, item.businessCategories) &&
        hasAny(filters.companies, item.tags.company) && hasAny(filters.corePoints, item.corePoints) &&
        hasAny(filters.stages, item.tags.interviewStage) && hasAny(filters.frequencies, [item.tags.frequency]) &&
        (filters.companySpecific === 'all' || item.tags.companySpecific === filters.companySpecific)
    })
    return [...list].sort((a, b) => sort === 'id' ? a.id.localeCompare(b.id) : sort === 'updated' ? b.updatedAt.localeCompare(a.updatedAt) : frequencyRank[a.tags.frequency] - frequencyRank[b.tags.frequency] || a.id.localeCompare(b.id))
  }, [bank, filters, sort])

  const activeCount = (filters.query ? 1 : 0) + filters.categories.length + filters.businesses.length + filters.corePoints.length + filters.companies.length + filters.stages.length + filters.frequencies.length + (filters.companySpecific === 'all' ? 0 : 1)
  const nextId = `Q-${String(Math.max(0, ...(bank?.questions.map((item) => Number(item.id.slice(2))) ?? [])) + 1).padStart(4, '0')}`
  const toggle = (key: FilterKey, value: string) => setFilters((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }))
  const persist = (next: QuestionBank) => { setBank(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
  const saveQuestion = (question: Question) => {
    if (!bank) return
    const exists = bank.questions.some((item) => item.id === question.id)
    persist({ ...bank, updatedAt: new Date().toISOString().slice(0, 10), questions: exists ? bank.questions.map((item) => item.id === question.id ? question : item) : [...bank.questions, question] })
    setEditorOpen(false); setEditing(null)
  }
  if (error) return <main className="mx-auto max-w-xl p-8"><div className="rounded-2xl border border-red-200 bg-white p-8 text-center"><Database className="mx-auto text-red-500" /><h1 className="mt-4 text-xl font-bold">题库加载失败</h1><p className="mt-2 text-stone-500">{error}，请确认 data/questions.json 已随站点发布。</p></div></main>
  if (!bank) return <main className="grid min-h-screen place-items-center"><div className="text-center text-stone-500"><BookOpen className="mx-auto mb-3 animate-pulse text-moss" />正在整理题卡…</div></main>

  return <div className="app-shell min-h-screen">
    <header className="app-header border-b border-stone-200/80 bg-paper/90">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="grid items-end gap-7 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-moss"><span className="h-2 w-2 rounded-sm bg-ochre" />AI PRODUCT INTERVIEW LIBRARY</div>
            <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-ink md:text-5xl">把零散面经，整理成可复习、可追踪的 AI 产品面试题库。</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">覆盖项目、评测、RAG、Agent、增长与公司场景。搜索相似问法，组合筛选重点，把 361 道原始题压缩为清晰的准备路径。</p>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:justify-self-end">
            <Stat value={bank.questions.length} label="母题" /><Stat value={bank.originalQuestionCount} label="原始题" /><Stat value={bank.questions.reduce((sum, item) => sum + item.similarQuestions.length, 0)} label="相似问法" />
          </div>
        </div>
      </div>
    </header>

    <main className="app-main mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <div className="mb-5 rounded-2xl border border-stone-200 bg-white p-3 shadow-card md:p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1"><span className="sr-only">搜索题目</span><Search className="absolute left-3 top-3 text-stone-400" size={19} /><input value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} placeholder="搜索母题、相似问法、公司或标签…" className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-10 text-sm focus:border-moss focus:outline-none" />{Boolean(filters.query) && <button onClick={() => setFilters({ ...filters, query: '' })} className="absolute right-3 top-3 text-stone-400"><X size={18} /></button>}</label>
          <button onClick={() => { setEditing(null); setEditorOpen(true) }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-moss px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"><Plus size={18} />新增母题</button>
          <button onClick={() => setFiltersOpen(true)} className="action-secondary justify-center lg:hidden"><Menu size={17} />筛选 {activeCount > 0 && `(${activeCount})`}</button>
        </div>
      </div>

      <div className="app-content grid gap-6 lg:grid-cols-4">
        <div className="desktop-filter hidden lg:block lg:pr-2"><FilterPanel filters={filters} options={options} activeCount={activeCount} onToggle={toggle} onSpecific={(value) => setFilters({ ...filters, companySpecific: value })} onReset={() => setFilters(emptyFilters)} /></div>
        <section className="question-scroll-region min-w-0 lg:col-span-3 lg:pr-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-stone-500">找到 <strong className="text-xl text-ink">{filtered.length}</strong> 道母题{activeCount > 0 && ` · 已启用 ${activeCount} 个条件`}</p>
            <label className="flex items-center gap-2"><span className="mb-0">排序</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"><option value="frequency">频级优先</option><option value="updated">最近更新</option><option value="id">题号顺序</option></select></label>
          </div>
          <div className="space-y-4">{filtered.map((question) => <QuestionCard key={question.id} question={question} onEdit={(item) => { setEditing(item); setEditorOpen(true) }} />)}</div>
          {!filtered.length && <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center"><Search className="mx-auto text-stone-300" /><h2 className="mt-4 font-semibold">没有匹配的母题</h2><button onClick={() => setFilters(emptyFilters)} className="mt-3 text-sm text-moss hover:underline">清空筛选条件</button></div>}
          <div className="mt-6"><DataActions /></div>
        </section>
      </div>
    </main>
    <footer className="app-footer mx-auto w-full max-w-7xl px-4 pb-10 pt-4 text-xs text-stone-400 md:px-8 lg:pb-3">题库版本 {bank.version} · 数据更新于 {bank.updatedAt} · 编辑数据仅保存在本地浏览器</footer>

    {Boolean(filtersOpen) && <div className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-sm lg:hidden" onClick={() => setFiltersOpen(false)}><div className="absolute bottom-0 right-0 top-0 w-80 max-w-full overflow-y-auto bg-paper p-4" onClick={(e) => e.stopPropagation()}><div className="mb-3 flex justify-end"><button onClick={() => setFiltersOpen(false)} className="rounded-lg p-2"><X /></button></div><FilterPanel filters={filters} options={options} activeCount={activeCount} onToggle={toggle} onSpecific={(value) => setFilters({ ...filters, companySpecific: value })} onReset={() => setFilters(emptyFilters)} /></div></div>}
    {Boolean(editorOpen) && <QuestionEditor question={editing} nextId={nextId} onClose={() => { setEditorOpen(false); setEditing(null) }} onSave={saveQuestion} />}
  </div>
}

function Stat({ value, label }: { value: number; label: string }) {
  return <div className="min-w-20 rounded-xl border border-stone-200 bg-white px-3 py-3 text-center shadow-sm"><strong className="block text-xl font-bold text-moss md:text-2xl">{value}</strong><span className="text-xs text-stone-500">{label}</span></div>
}
