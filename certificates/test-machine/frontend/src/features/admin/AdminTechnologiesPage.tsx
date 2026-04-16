import React from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useStore.js'
import { loadTechnologiesRequest, createTechnologyRequest } from './store/admin.slice.js'

export function AdminTechnologiesPage() {
  const dispatch = useAppDispatch()
  const { technologies, loading } = useAppSelector(s => s.admin)
  const [showForm, setShowForm] = React.useState(false)
  const [name, setName] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [levelsInput, setLevelsInput] = React.useState('')

  React.useEffect(() => { dispatch(loadTechnologiesRequest()) }, [dispatch])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const levels = levelsInput.split(',').map(s => s.trim()).filter(Boolean)
    dispatch(createTechnologyRequest({ name, slug, description, levels, isActive: true }))
    setShowForm(false)
    setName(''); setSlug(''); setDescription(''); setLevelsInput('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Technologies</h1>
        <button className="btn-primary text-sm" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ Add Technology'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card space-y-4">
          <h2 className="font-medium text-white">New Technology</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Slug</label>
              <input className="input font-mono" value={slug} onChange={e => setSlug(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Levels (comma-separated)</label>
            <input className="input" placeholder="MID, SENIOR" value={levelsInput} onChange={e => setLevelsInput(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary text-sm" disabled={loading}>Create</button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Slug</th>
              <th className="pb-2 pr-4">Levels</th>
              <th className="pb-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {technologies.map(t => (
              <tr key={t.id} className="border-b border-slate-800">
                <td className="py-2 pr-4 text-white">{t.name}</td>
                <td className="py-2 pr-4 font-mono text-slate-400">{t.slug}</td>
                <td className="py-2 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {t.levels.map(l => <span key={l} className="badge badge-mid">{l}</span>)}
                  </div>
                </td>
                <td className="py-2">
                  <span className={`badge ${t.isActive ? 'badge-senior' : ''}`}>{t.isActive ? 'Yes' : 'No'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
