import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // TODO: Add admin auth check

    const { data, error } = await supabase
      .from('gifts')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return Response.json(data)
  } catch (error) {
    console.error('[v0] PATCH /api/gifts error:', error)
    return Response.json(
      { message: 'Error updating gift' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // TODO: Add admin auth check

    const { error } = await supabase
      .from('gifts')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/gifts error:', error)
    return Response.json(
      { message: 'Error deleting gift' },
      { status: 500 }
    )
  }
}
