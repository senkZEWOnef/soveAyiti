'use client'

import { useState } from 'react'
import { site } from '@/data/site'

type Field = {
  name: string
  label: string
  type?: 'text' | 'email' | 'textarea' | 'select'
  options?: string[]
  required?: boolean
  placeholder?: string
}

export default function SimpleForm({
  fields,
  submitLabel,
  topic,
  successMessage,
}: {
  fields: Field[]
  submitLabel: string
  topic: string
  successMessage: string
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'unconfigured'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!site.formEndpoint) {
      setState('unconfigured')
      return
    }
    setState('sending')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ topic, ...data }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return <p className="rounded-lg bg-navy-50 p-5 text-navy-800" role="status">{successMessage}</p>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="mb-1.5 block text-sm font-semibold text-navy-800">
            {f.label}
          </label>
          {f.type === 'textarea' ? (
            <textarea id={f.name} name={f.name} rows={5} required={f.required} placeholder={f.placeholder} className="input" />
          ) : f.type === 'select' ? (
            <select id={f.name} name={f.name} required={f.required} className="input" defaultValue="">
              <option value="" disabled>Chwazi…</option>
              {f.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input id={f.name} name={f.name} type={f.type ?? 'text'} required={f.required} placeholder={f.placeholder} className="input" />
          )}
        </div>
      ))}
      <button type="submit" disabled={state === 'sending'} className="btn-primary w-full sm:w-auto">
        {state === 'sending' ? 'Ap voye…' : submitLabel}
      </button>
      {state === 'error' && <p className="text-sm text-flag-700" role="alert">Pa t kapab voye. Eseye ankò.</p>}
      {state === 'unconfigured' && (
        <p className="text-sm text-flag-700" role="alert">
          Fòm sa poko konekte. Defini NEXT_PUBLIC_FORM_ENDPOINT pou li mache.
        </p>
      )}
      <p className="text-xs text-navy-500">Nou mande sèlman sa ki nesesè. Pa bay enfòmasyon ou pa vle pataje.</p>
    </form>
  )
}
