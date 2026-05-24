import { supabaseAdmin } from '@/app/lib/supabase'

export async function GET(request, { params }) {
  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from('letters')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return Response.json({ error: 'Surat tidak ditemukan' }, { status: 404 })
  }

  // Catat waktu dibuka (kalau belum pernah)
  if (!data.opened_at) {
    await supabaseAdmin
      .from('letters')
      .update({ opened_at: new Date().toISOString() })
      .eq('id', id)
  }

  return Response.json(data)
}
