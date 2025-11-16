import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // TODO: Add admin auth check

    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(data || [])
  } catch (error) {
    console.error('[v0] GET /api/purchases error:', error)
    return Response.json(
      { message: 'Error fetching purchases' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { giftId, guestEmail } = await request.json()

    console.log('[v0] POST /api/purchases - giftId:', giftId, 'email:', guestEmail)

    if (!giftId || !guestEmail) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guestEmail)) {
      return Response.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get gift details
    const { data: gift, error: giftError } = await supabase
      .from('gifts')
      .select('*')
      .eq('id', giftId)
      .single()

    if (giftError || !gift) {
      console.error('[v0] Gift not found:', giftError)
      throw new Error('Gift not found')
    }

    // Check if gift is already purchased
    if (gift.status === 'purchased') {
      return Response.json(
        { message: 'Gift already purchased' },
        { status: 400 }
      )
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        gift_id: giftId,
        guest_email: guestEmail,
        amount: gift.price,
        payment_status: 'pending',
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('[v0] Purchase creation error:', purchaseError)
      throw purchaseError
    }

    console.log('[v0] Purchase created:', purchase.id)

    // Get config for MercadoPago token
    const { data: config } = await supabase
      .from('site_config')
      .select('mercadopago_access_token')
      .eq('id', 1)
      .single()

    console.log('[v0] Config fetched, has token:', !!config?.mercadopago_access_token)

    if (!config?.mercadopago_access_token) {
      console.error('[v0] MercadoPago token not configured')
      return Response.json(
        { message: 'MercadoPago not configured. Please configure it in the admin dashboard.' },
        { status: 400 }
      )
    }

    // Call create preference API
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    console.log('[v0] Calling preference API with baseUrl:', baseUrl)
    
    const preferenceResponse = await fetch(
      `${baseUrl}/api/payments/create-preference`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseId: purchase.id,
          giftId,
          email: guestEmail,
        }),
      }
    )

    console.log('[v0] Preference API response status:', preferenceResponse.status)

    if (!preferenceResponse.ok) {
      const error = await preferenceResponse.text()
      console.error('[v0] Preference API error:', error)
      throw new Error('Failed to create payment preference')
    }

    const preferenceData = await preferenceResponse.json()
    console.log('[v0] Preference data:', preferenceData)

    return Response.json({
      purchase_id: purchase.id,
      init_point: preferenceData.init_point,
    })
  } catch (error) {
    console.error('[v0] POST /api/purchases error:', error)
    return Response.json(
      { message: error instanceof Error ? error.message : 'Error creating purchase' },
      { status: 500 }
    )
  }
}
