'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    from_name: '',
    to_name: '',
    message: '',
    song_title: '',
    spotify_url: '',
    theme: 'ivory'
  })

  const themes = [
    { id: 'ivory', label: 'Ivory', color: '#f5f0e8' },
    { id: 'blush', label: 'Blush', color: '#f9e4e4' },
    { id: 'sage',  label: 'Sage',  color: '#e4f0e8' },
    { id: 'dusk',  label: 'Dusk',  color: '#2a2438' },
  ]

  function extractSpotifyId(url) {
    const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }

  async function handleSubmit() {
    if (!form.from_name || !form.to_name || !form.message) {
      alert('Isi nama pengirim, penerima, dan pesan dulu ya.')
      return
    }

    setLoading(true)

    const spotify_track_id = extractSpotifyId(form.spotify_url)

    const res = await fetch('/api/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_name: form.from_name,
        to_name: form.to_name,
        message: form.message,
        song_title: form.song_title,
        spotify_track_id,
        theme: form.theme,
      })
    })

    const data = await res.json()
    setLoading(false)

    if (data.id) {
      router.push(`/created?id=${data.id}`)
    } else {
      alert('Gagal menyimpan surat: ' + data.error)
    }
  }

  return (
    <main className="min-h-screen bg-[#e8dfd0] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#faf6ee] rounded-2xl shadow-lg p-8">
        <h1 className="font-serif text-3xl mb-1 text-[#2c1f0e]">Tulis Suratmu</h1>
        <p className="text-sm text-[#6b5740] italic mb-6">Isi form di bawah — link unik akan di-generate setelah kamu kirim.</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-[#6b5740] block mb-1">Dari</label>
            <input
              className="w-full border border-[#e0d0b8] rounded-lg px-3 py-2 bg-[#f7f0e3] text-[#2c1f0e] text-sm outline-none focus:border-[#b8860b]"
              placeholder="Namamu"
              value={form.from_name}
              onChange={e => setForm({...form, from_name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[#6b5740] block mb-1">Untuk</label>
            <input
              className="w-full border border-[#e0d0b8] rounded-lg px-3 py-2 bg-[#f7f0e3] text-[#2c1f0e] text-sm outline-none focus:border-[#b8860b]"
              placeholder="Nama dia"
              value={form.to_name}
              onChange={e => setForm({...form, to_name: e.target.value})}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs uppercase tracking-widest text-[#6b5740] block mb-1">Isi Surat</label>
          <textarea
            className="w-full border border-[#e0d0b8] rounded-lg px-3 py-2 bg-[#f7f0e3] text-[#2c1f0e] text-sm outline-none focus:border-[#b8860b] resize-none h-32 leading-relaxed"
            placeholder="Tulis pesanmu di sini..."
            value={form.message}
            onChange={e => setForm({...form, message: e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label className="text-xs uppercase tracking-widest text-[#6b5740] block mb-1">Link Lagu Spotify</label>
          <input
            className="w-full border border-[#e0d0b8] rounded-lg px-3 py-2 bg-[#f7f0e3] text-[#2c1f0e] text-sm outline-none focus:border-[#b8860b]"
            placeholder="https://open.spotify.com/track/..."
            value={form.spotify_url}
            onChange={e => setForm({...form, spotify_url: e.target.value})}
          />
        </div>

        <div className="mb-6">
          <label className="text-xs uppercase tracking-widest text-[#6b5740] block mb-1">Judul Lagu</label>
          <input
            className="w-full border border-[#e0d0b8] rounded-lg px-3 py-2 bg-[#f7f0e3] text-[#2c1f0e] text-sm outline-none focus:border-[#b8860b]"
            placeholder="cth: Photograph — Ed Sheeran"
            value={form.song_title}
            onChange={e => setForm({...form, song_title: e.target.value})}
          />
        </div>

        <div className="mb-6">
          <label className="text-xs uppercase tracking-widest text-[#6b5740] block mb-2">Tema</label>
          <div className="grid grid-cols-4 gap-2">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setForm({...form, theme: t.id})}
                className={`py-2 rounded-lg border text-xs transition-all ${form.theme === t.id ? 'border-[#b8860b] text-[#2c1f0e]' : 'border-[#e0d0b8] text-[#6b5740]'}`}
              >
                <div className="w-5 h-5 rounded-full mx-auto mb-1 border border-[#d0c0a0]" style={{background: t.color}}></div>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-[#2c1f0e] text-[#faf6ee] rounded-lg font-serif text-lg italic hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Kirim Surat →'}
        </button>
      </div>
    </main>
  )
}