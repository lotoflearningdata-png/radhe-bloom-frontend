import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Trash2, Eye, EyeOff, Pencil, Check, X } from 'lucide-react'

export default function AdminCategories() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null) // { id, name }

  const fetchCats = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/categories?includeHidden=true&counts=true')
      setCats(data.categories || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchCats() }, [])

  const addCat = async () => {
    if (!name.trim()) return toast.error('Enter a category name')
    setAdding(true)
    try {
      await axios.post('/api/categories', { name: name.trim() })
      setName('')
      toast.success('Category added')
      fetchCats()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add category') }
    finally { setAdding(false) }
  }

  const toggleHidden = async (c) => {
    try {
      await axios.put(`/api/categories/${c._id}`, { hidden: !c.hidden })
      setCats(prev => prev.map(x => x._id === c._id ? { ...x, hidden: !c.hidden } : x))
      toast.success(c.hidden ? 'Category is now visible in the store' : 'Category hidden from store menus')
    } catch { toast.error('Failed to update category') }
  }

  const saveName = async () => {
    if (!editing.name.trim()) return toast.error('Name cannot be empty')
    try {
      await axios.put(`/api/categories/${editing.id}`, { name: editing.name.trim() })
      setCats(prev => prev.map(x => x._id === editing.id ? { ...x, name: editing.name.trim() } : x))
      setEditing(null)
      toast.success('Category renamed')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to rename') }
  }

  const deleteCat = async (c) => {
    if (!confirm(`Delete category "${c.name}"?`)) return
    try {
      await axios.delete(`/api/categories/${c._id}`)
      setCats(prev => prev.filter(x => x._id !== c._id))
      toast.success('Category deleted')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Add form */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <p className="text-xs font-bold text-devotion-brown/70 uppercase tracking-wider mb-2">New Category</p>
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addCat() }}
            placeholder="e.g. Diwali Collection" className="input-field flex-1" />
          <button onClick={addCat} disabled={adding} className="btn-primary disabled:opacity-60">
            <Plus size={16} /> Add
          </button>
        </div>
        <p className="text-xs text-cream-500 mt-2">
          Hiding a category removes it from the store menus (its products stay reachable via other categories or search).
          A category can only be deleted when no products use it.
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card divide-y divide-cream-100">
          {cats.map(c => (
            <div key={c._id} className={`flex items-center gap-3 px-5 py-3 ${c.hidden ? 'opacity-60' : ''}`}>
              <div className="flex-1 min-w-0">
                {editing?.id === c._id ? (
                  <div className="flex items-center gap-2">
                    <input value={editing.name} autoFocus
                      onChange={e => setEditing(ed => ({ ...ed, name: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditing(null) }}
                      className="input-field text-sm py-1.5" />
                    <button onClick={saveName} className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"><Check size={14} /></button>
                    <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg bg-cream-100 text-devotion-brown hover:bg-cream-200"><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-devotion-brown text-sm flex items-center gap-2">
                      {c.name}
                      {c.hidden && <span className="bg-gray-800/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff size={9} /> Hidden</span>}
                    </p>
                    <p className="text-xs text-cream-500">/shop/{c.slug} · {c.productCount ?? 0} product{c.productCount === 1 ? '' : 's'}</p>
                  </>
                )}
              </div>
              <button onClick={() => setEditing({ id: c._id, name: c.name })} title="Rename"
                className="p-2 rounded-lg hover:bg-cream-100 text-devotion-brown transition-colors">
                <Pencil size={15} />
              </button>
              <button onClick={() => toggleHidden(c)} title={c.hidden ? 'Show in store' : 'Hide from store'}
                className="p-2 rounded-lg hover:bg-cream-100 transition-colors">
                {c.hidden ? <Eye size={15} className="text-green-600" /> : <EyeOff size={15} className="text-devotion-brown" />}
              </button>
              <button onClick={() => deleteCat(c)} disabled={(c.productCount ?? 0) > 0}
                title={(c.productCount ?? 0) > 0 ? 'Move its products first' : 'Delete'}
                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {cats.length === 0 && <p className="p-8 text-center text-cream-500 text-sm">No categories yet — add your first one above.</p>}
        </div>
      )}
    </div>
  )
}
