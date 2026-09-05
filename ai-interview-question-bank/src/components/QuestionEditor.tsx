import { useState } from 'react'
import { Save, X } from 'lucide-react'
import type { CompanySpecific, Frequency, Question } from '../types'
import { csv } from '../lib/validation'

interface Props { question: Question | null; nextId: string; onClose: () => void; onSave: (question: Question) => void }
const empty = (id: string): Question => ({ id, title: '', mainCategory: '', businessCategories: [], corePoints: [], tags: { company: [], companyStyle: [], interviewStage: [], frequency: 'B', companySpecific: 'no' }, similarQuestions: [], sources: [{ document: '网页本地新增', reference: '手动录入' }], updatedAt: new Date().toISOString().slice(0, 10) })

export function QuestionEditor({ question, nextId, onClose, onSave }: Props) {
  const [form, setForm] = useState<Question>(() => question ? structuredClone(question) : empty(nextId))
  const [error, setError] = useState('')
  const listValue = (items: string[]) => items.join('，')
  const updateList = (path: 'businessCategories' | 'corePoints' | 'company' | 'companyStyle' | 'interviewStage' | 'similarQuestions', value: string) => {
    if (path === 'businessCategories' || path === 'corePoints' || path === 'similarQuestions') setForm({ ...form, [path]: csv(value) })
    else setForm({ ...form, tags: { ...form.tags, [path]: csv(value) } })
  }
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || !form.mainCategory.trim() || !form.tags.company.length || !form.sources[0]?.document.trim()) {
      setError('请填写母题、主分类、公司和来源。')
      return
    }
    onSave({ ...form, title: form.title.trim(), mainCategory: form.mainCategory.trim(), updatedAt: new Date().toISOString().slice(0, 10) })
  }
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/30 p-0 backdrop-blur-sm md:items-center md:p-6" role="dialog" aria-modal="true">
    <form onSubmit={submit} className="max-h-screen w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl md:max-h-[90vh] md:max-w-3xl md:rounded-2xl md:p-7">
      <div className="mb-6 flex items-start justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-ochre">本地维护</p><h2 className="mt-1 text-2xl font-bold text-ink">{question ? '编辑母题' : '新增母题'}</h2><p className="mt-1 text-sm text-stone-500">保存到本浏览器；导出 JSON 后替换项目文件才能发布。</p></div>
        <button type="button" onClick={onClose} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"><X /></button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2"><span>母题 *</span><textarea value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} rows={2} /></label>
        <label><span>题号</span><input value={form.id} readOnly className="bg-stone-50" /></label>
        <label><span>主分类 *</span><input value={form.mainCategory} onChange={(e) => setForm({ ...form, mainCategory: e.target.value })} /></label>
        <label><span>业务分类（逗号分隔）</span><input value={listValue(form.businessCategories)} onChange={(e) => updateList('businessCategories', e.target.value)} /></label>
        <label><span>核心考点（逗号分隔）</span><input value={listValue(form.corePoints)} onChange={(e) => updateList('corePoints', e.target.value)} /></label>
        <label><span>公司 *（逗号分隔）</span><input value={listValue(form.tags.company)} onChange={(e) => updateList('company', e.target.value)} /></label>
        <label><span>公司风格</span><input value={listValue(form.tags.companyStyle)} onChange={(e) => updateList('companyStyle', e.target.value)} /></label>
        <label><span>面试阶段</span><input value={listValue(form.tags.interviewStage)} onChange={(e) => updateList('interviewStage', e.target.value)} /></label>
        <label><span>频级</span><select value={form.tags.frequency} onChange={(e) => setForm({ ...form, tags: { ...form.tags, frequency: e.target.value as Frequency } })}><option value="S">S · 超高频</option><option value="A">A · 高频</option><option value="B">B · 中高频</option><option value="C">C · 中频</option></select></label>
        <label><span>公司特异性</span><select value={form.tags.companySpecific} onChange={(e) => setForm({ ...form, tags: { ...form.tags, companySpecific: e.target.value as CompanySpecific } })}><option value="no">通用</option><option value="partial">部分特异</option><option value="yes">公司特异</option></select></label>
        <label className="md:col-span-2"><span>相似问法（逗号分隔）</span><textarea value={listValue(form.similarQuestions)} onChange={(e) => updateList('similarQuestions', e.target.value)} rows={4} /></label>
        <label><span>来源文档 *</span><input value={form.sources[0]?.document ?? ''} onChange={(e) => setForm({ ...form, sources: [{ ...form.sources[0], document: e.target.value }] })} /></label>
        <label><span>来源定位</span><input value={form.sources[0]?.reference ?? ''} onChange={(e) => setForm({ ...form, sources: [{ ...form.sources[0], reference: e.target.value }] })} /></label>
      </div>
      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm">取消</button><button className="inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"><Save size={16} />保存到浏览器</button></div>
    </form>
  </div>
}
