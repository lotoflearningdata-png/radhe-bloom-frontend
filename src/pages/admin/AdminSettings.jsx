import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const [diwaliHeroImage, setDiwaliHeroImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    axios.get('/api/settings')
      .then(({ data }) => setDiwaliHeroImage(data.settings?.diwaliHeroImage || ''))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.put('/api/settings', { diwaliHeroImage })
      toast.success('Settings saved!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-devotion-brown/60">Loading…</p>

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl text-devotion-brown mb-1">Homepage Settings</h2>
      <p className="text-sm text-devotion-brown/60 mb-6">Controls for the Season Special (Diwali) section on the homepage.</p>

      <div className="bg-white border border-cream-200 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
            Diwali Hero Image URL
          </label>
          <input
            type="text"
            value={diwaliHeroImage}
            onChange={e => setDiwaliHeroImage(e.target.value)}
            placeholder="https://res.cloudinary.com/.../image/upload/..."
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:border-saffron-400 focus:outline-none text-sm"
          />
          <p className="text-xs text-devotion-brown/50 mt-1.5">
            Paste a Cloudinary (or any) image URL to pin the photo shown in the homepage Season Special medallion.
            Leave empty to auto-pick the best-rated photo from the "Diwali Collection" category instead.
          </p>
        </div>

        {diwaliHeroImage && (
          <div>
            <p className="text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Preview</p>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-saffron-400/40 shadow-md bg-cream-100">
              <img src={diwaliHeroImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 btn-primary disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
