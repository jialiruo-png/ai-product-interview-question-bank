import { BookOpen, Copy, ExternalLink, Table2, Users, X } from 'lucide-react'
import { useState } from 'react'

const resources = {
  document: {
    title: '查看题库文档',
    description: '在飞书文档中查看题库的完整说明与使用指南。',
    href: 'https://wcn6t4b50ylf.feishu.cn/wiki/BNPWwqjknil7zBkM3zqcLsRWnJH?from=from_copylink',
  },
  table: {
    title: '查看多维表格',
    description: '在飞书多维表格中浏览、维护题库数据。',
    href: 'https://wcn6t4b50ylf.feishu.cn/wiki/L9uxwC6aoin9eRkCw62cryOwnCd?from=from_copylink',
  },
} as const

type ResourceKey = keyof typeof resources

export function DataActions() {
  const [selected, setSelected] = useState<ResourceKey | 'group' | null>(null)
  const [copied, setCopied] = useState(false)
  const resource = selected && selected !== 'group' ? resources[selected] : null

  const copyLink = async () => {
    if (!resource) return
    await navigator.clipboard.writeText(resource.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return <>
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelected('document')} className="action-secondary"><BookOpen size={16} />查看题库文档</button>
        <button onClick={() => setSelected('table')} className="action-secondary"><Table2 size={16} />查看多维表格</button>
        <button onClick={() => setSelected('group')} className="action-secondary"><Users size={16} />加入产品交流群</button>
      </div>
    </div>

    {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/30 p-0 backdrop-blur-sm md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="resource-dialog-title" onClick={() => setSelected(null)}>
      <section className="w-full rounded-t-2xl bg-white p-5 shadow-2xl md:max-w-md md:rounded-2xl md:p-6" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ochre">AI PRODUCT INTERVIEW LIBRARY</p>
            <h2 id="resource-dialog-title" className="mt-1 text-xl font-bold text-ink">{resource?.title ?? '加入产品交流群'}</h2>
          </div>
          <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100" aria-label="关闭"><X size={18} /></button>
        </div>

        {resource ? <>
          <p className="mt-3 text-sm leading-6 text-stone-500">{resource.description}</p>
          <div className="mt-5 break-all rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-600">{resource.href}</div>
          <div className="mt-4 flex gap-2">
            <button onClick={copyLink} className="action-secondary flex-1 justify-center"><Copy size={16} />{copied ? '已复制' : '复制链接'}</button>
            <a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-moss px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"><ExternalLink size={16} />打开链接</a>
          </div>
        </> : <>
          <p className="mt-3 text-sm leading-6 text-stone-500">扫码加入「大魔王的 AI 产品交流群」。</p>
          <img src="/group-qr.png" alt="大魔王的 AI 产品交流群二维码" className="mx-auto mt-4 w-full max-w-xs rounded-xl border border-stone-200" />
        </>}
      </section>
    </div>}
  </>
}
