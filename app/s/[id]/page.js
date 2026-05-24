'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Playfair_Display, Lora } from 'next/font/google'
import './letter.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
})

export default function LetterPage() {
  const { id } = useParams()
  const [letter, setLetter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [opened, setOpened] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    fetch(`/api/letters/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setLetter(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Gagal memuat surat')
        setLoading(false)
      })
  }, [id])

  function handleOpen() {
    if (exiting) return
    setExiting(true)
    setTimeout(() => setOpened(true), 650)
  }

  const themeClass = letter ? `theme-${letter.theme || 'ivory'}` : ''
  const initial = letter ? (letter.to_name || '?')[0].toUpperCase() : ''

  // --- Loading ---
  if (loading) {
    return (
      <main className={`letter-page ${playfair.variable} ${lora.variable}`}>
        <div className="loading-spinner" />
      </main>
    )
  }

  // --- Error ---
  if (error || !letter) {
    return (
      <main className={`letter-page ${playfair.variable} ${lora.variable}`}>
        <div className="error-content">
          <div className="error-emoji">📭</div>
          <h1 className="error-title">Surat tidak ditemukan</h1>
          <p className="error-subtitle">Link mungkin salah atau surat sudah dihapus.</p>
          <Link href="/" className="error-link">Buat surat baru →</Link>
        </div>
      </main>
    )
  }

  // --- Main ---
  return (
    <main className={`letter-page ${playfair.variable} ${lora.variable} ${themeClass}`}>
      {!opened ? (
        /* ============================================
           CLOSED STATE — Surprise scroll
           ============================================ */
        <div
          className={`surprise-container ${exiting ? 'surprise-exit' : ''}`}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
        >
          <div className="scroll-wrapper">
            {/* Top curl */}
            <div className="scroll-curl scroll-curl-top" />

            {/* Paper body */}
            <div className="scroll-body">
              {/* Tassel decoration */}
              <div className="scroll-tassel">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="tassel-line"
                    style={{ transform: `rotate(${-45 + i * 15}deg)` }}
                  />
                ))}
              </div>

              {/* Vertical string */}
              <div className="scroll-string" />

              {/* Wax seal */}
              <div className="wax-seal">
                <span className="wax-seal-letter">{initial}</span>
              </div>
            </div>

            {/* Bottom curl */}
            <div className="scroll-curl scroll-curl-bottom" />
          </div>

          <h2 className="surprise-title">Sebuah Surat Untukmu</h2>
          <p className="surprise-hint">
            <span className="surprise-hint-dot" />
            <span>Klik untuk membuka</span>
          </p>
        </div>
      ) : (
        /* ============================================
           OPENED STATE — Letter content
           ============================================ */
        <div className="opened-container">
          {/* Spotify Player */}
          {letter.spotify_track_id && (
            <div className="spotify-card">
              {letter.song_title && (
                <div className="spotify-label">
                  <span className="spotify-icon">♫</span>
                  <span>{letter.song_title}</span>
                </div>
              )}
              <iframe
                src={`https://open.spotify.com/embed/track/${letter.spotify_track_id}?utm_source=generator`}
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Player"
              />
            </div>
          )}

          {/* Letter Content */}
          <div className="letter-card">
            <h1 className="letter-greeting">Dearest {letter.to_name},</h1>
            <div className="letter-body">{letter.message}</div>
            <div className="letter-signature">From, {letter.from_name}</div>
          </div>

          {/* Footer */}
          <div className="letter-footer">
            <span className="footer-brand">
              Powered by <strong>ForYou</strong>
            </span>
            <Link href="/" className="footer-cta">
              Create your own →
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
