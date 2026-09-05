import React from 'react'
import { Check, ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { FilterKey, Filters } from '../types'

interface OptionSets {
  categories: string[]
  businesses: string[]
  corePoints: string[]
  companies: string[]
  stages: string[]
}

interface Props {
  filters: Filters
  options: OptionSets
  activeCount: number
  onToggle: (key: FilterKey, value: string) => void
  onSpecific: (value: Filters['companySpecific']) => void
  onReset: () => void
}

const labels: Record<FilterKey, string> = {
  categories: '主分类', businesses: '业务分类', corePoints: '核心考点', companies: '公司', stages: '面试阶段', frequencies: '频级',
}

export function FilterPanel({ filters, options, activeCount, onToggle, onSpecific, onReset }: Props) {
  const groups: Array<{ key: FilterKey; values: string[] }> = [
    { key: 'categories', values: options.categories },
    { key: 'businesses', values: options.businesses },
    { key: 'corePoints', values: options.corePoints },
    { key: 'companies', values: options.companies },
    { key: 'stages', values: options.stages },
    { key: 'frequencies', values: ['S', 'A', 'B', 'C'] },
  ]
  return (
    <aside className="rounded-2xl border border-stone-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-ink"><SlidersHorizontal size={18} />组合筛选</div>
        <button className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-moss disabled:opacity-40" disabled={!activeCount} onClick={onReset}><RotateCcw size={14} />清空</button>
      </div>
      <div className="space-y-2">
        {groups.map(({ key, values }) => (
          <details key={key} className="group border-t border-stone-100 pt-2" open={key === 'categories' || key === 'companies'}>
            <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm font-medium text-stone-700">
              <span>{labels[key]} {filters[key].length > 0 && <b className="ml-1 text-ochre">{filters[key].length}</b>}</span>
              <ChevronDown className="transition group-open:rotate-180" size={16} />
            </summary>
            <div className="max-h-48 space-y-1 overflow-y-auto pb-2 pr-1">
              {values.map((value) => {
                const checked = filters[key].includes(value)
                return <button key={value} onClick={() => onToggle(key, value)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition ${checked ? 'bg-emerald-50 text-moss' : 'text-stone-600 hover:bg-stone-50'}`}>
                  <span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? 'border-moss bg-moss text-white' : 'border-stone-300'}`}>{Boolean(checked) && <Check size={12} />}</span>{value}
                </button>
              })}
            </div>
          </details>
        ))}
        <div className="border-t border-stone-100 pt-3">
          <p className="mb-2 text-sm font-medium text-stone-700">公司特异性</p>
          <select value={filters.companySpecific} onChange={(event) => onSpecific(event.target.value as Filters['companySpecific'])} className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:border-moss focus:outline-none">
            <option value="all">全部</option><option value="no">通用题</option><option value="partial">部分依赖业务</option><option value="yes">公司特异题</option>
          </select>
        </div>
      </div>
    </aside>
  )
}
