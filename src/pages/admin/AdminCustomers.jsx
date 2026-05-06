import { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, User } from 'lucide-react'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    axios.get('/api/auth/users')
      .then(r => setCustomers(r.data.users || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div className="space-y-5">
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..." className="input-field pl-9 text-sm" />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-cream-50 text-xs text-cream-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filtered.map(c => (
                <tr key={c._id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-bold text-sm">
                        {c.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-devotion-brown">{c.name}</p>
                        <p className="text-xs text-cream-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-devotion-brown">{c.phone || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.role === 'admin' ? 'bg-saffron-100 text-saffron-700' : 'bg-cream-100 text-cream-600'}`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-cream-500">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <User size={32} className="text-cream-300 mx-auto mb-2" />
              <p className="text-cream-500">No customers found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}