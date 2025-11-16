import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const purchaseId = params.id

    const { data: purchase, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('id', purchaseId)
      .single()

    if (error || !purchase) {
      return Response.json(
        { message: 'Purchase not found' },
        { status: 404 }
      )
    }

    const { data: gift } = await supabase
      .from('gifts')
      .select('*')
      .eq('id', purchase.gift_id)
      .single()

    return Response.json({ purchase, gift })
  } catch (error) {
    console.error('[v0] Get purchase error:', error)
    return Response.json(
      { message: 'Error fetching purchase' },
      { status: 500 }
    )
  }
}
