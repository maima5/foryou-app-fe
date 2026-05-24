'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CreatedContent() {
  const params = useSearchParams()
  const id = params.get('id')
  const link = `${window.location.origin}/s/${id}`

  function copyLink() {
    navigator.clipboard.writeText(link)
    alert('Link tersalin!')
  }

  return (
    <main className="min-h-screen bg-[#e8dfd0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#faf6ee] rounded-2xl shadow-lg p-8 text-center">
        <div className="text-4xl mb-4">💌</div>
        <h1 className="font-serif text-2xl text-[#2c1f0e] mb-2">Surat tersimpan!</h1>
        <p className="text-sm text-[#6b5740] italic mb-6">Bagikan link ini ke penerima</p>

        <div className="bg-[#f7f0e3] border border-[#e0d0b8] rounded-lg px-4 py-3 mb-4 text-sm text-[#2c1f0e] break-all text-left">
          {link}
        </div>

        <button
          onClick={copyLink}
          className="w-full py-3 bg-[#2c1f0e] text-[#faf6ee] rounded-lg font-serif text-lg italic hover:opacity-80 transition-opacity"
        >
          Salin Link
        </button>
      </div>
    </main>
  )
}

export default function CreatedPage() {
  return (
    <Suspense>
      <CreatedContent />
    </Suspense>
  )
}