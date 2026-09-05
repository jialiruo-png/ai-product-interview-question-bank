import { Building2, CalendarDays, ChevronDown, FileText, Pencil, Sparkles } from 'lucide-react'
import type { Question } from '../types'

const frequencyText = { S: '超高频', A: '高频', B: '中高频', C: '中频' }
const specificText = { yes: '公司特异', no: '通用', partial: '部分特异' }

export function QuestionCard({ question, onEdit }: { question: Question; onEdit: (question: Question) => void }) {
  return (
    <article className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 md:p-6">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`rounded-md px-2 py-1 text-xs font-bold ${question.tags.frequency === 'S' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'}`}>{question.tags.frequency} · {frequencyText[question.tags.frequency]}</span>
          <span className="font-mono text-xs text-stone-400">{question.id}</span>
        </div>
        <button onClick={() => onEdit(question)} className="rounded-lg p-2 text-stone-400 opacity-70 transition hover:bg-stone-100 hover:text-moss group-hover:opacity-100" title="编辑母题"><Pencil size={16} /></button>
      </div>
      <h2 className="text-lg font-semibold leading-relaxed text-ink md:text-xl">{question.title}</h2>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-800">{question.mainCategory}</span>
        {question.businessCategories.map((item) => <span key={item} className="rounded-md bg-stone-100 px-2 py-1 text-stone-600">{item}</span>)}
        {question.corePoints.map((item) => <span key={item} className="rounded-md border border-stone-200 px-2 py-1 text-stone-600">{item}</span>)}
        <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700">{specificText[question.tags.companySpecific]}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-500">
        <span className="inline-flex items-center gap-1.5"><Building2 size={15} />{question.tags.company.join(' · ')}</span>
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} />{question.tags.interviewStage.join(' · ')}</span>
      </div>
      <details className="group/details mt-5 border-t border-stone-100 pt-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-moss">
          <span className="inline-flex items-center gap-2"><Sparkles size={16} />{question.similarQuestions.length} 个相似问法</span>
          <ChevronDown size={17} className="transition group-open/details:rotate-180" />
        </summary>
        <ol className="mt-3 space-y-2 border-l-2 border-emerald-100 pl-4 text-sm leading-6 text-stone-600">
          {question.similarQuestions.map((item, index) => <li key={item}><span className="mr-2 text-stone-300">{String(index + 1).padStart(2, '0')}</span>{item}</li>)}
        </ol>
      </details>
      <div className="mt-4 flex items-center gap-2 text-xs text-stone-400"><FileText size={13} />来源：{question.sources.map((source) => `${source.document} · ${source.reference}`).join('；')}</div>
    </article>
  )
}
