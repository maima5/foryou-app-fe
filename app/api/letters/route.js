import { supabaseAdmin } from '@/app/lib/supabase'
import { nanoid } from 'nanoid'

export async function POST(request) {
  const body = await request.json()
  const { from_name, to_name, message, song_title, spotify_track_id, theme } = body

  if (!from_name || !to_name || !message) {
    return Response.json({ error: 'from_name, to_name, message wajib diisi' }, { status: 400 })
  }

  const id = nanoid(5)

  const { data, error } = await supabaseAdmin
    .from('letters')
    .insert({ id, from_name, to_name, message, song_title, spotify_track_id, theme })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ id, url: `/s/${id}` }, { status: 201 })
}
