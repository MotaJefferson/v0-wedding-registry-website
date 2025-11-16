import { createClient } from '@/lib/supabase/server'

interface MercadoPagoPreference {
  items: Array<{
    title: string
    description: string
    unit_price: number
    quantity: number
    currency_id: string
  }>
  payer: {
    email: string
  }
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  auto_return: string
  notification_url: string
  external_reference: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { purchaseId, giftId, email } = await request.json()

    console.log('[v0] Create preference - purchaseId:', purchaseId, 'giftId:', giftId)

    if (!purchaseId || !giftId || !email) {
      return Response.json(
        { message: 'Missing required fields' },
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
      console.error('[v0] Gift not found in preference creation:', giftError)
      throw new Error('Gift not found')
    }

    // Get config for credentials
    const { data: config } = await supabase
      .from('site_config')
      .select('*')
      .eq('id', 1)
      .single()

    if (!config?.mercadopago_access_token) {
      console.error('[v0] MercadoPago token not found in config')
      throw new Error('MercadoPago not configured')
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    // Create preference object
    const preference: MercadoPagoPreference = {
      items: [
        {
          title: gift.name,
          description: gift.description || '',
          unit_price: parseFloat(gift.price.toString()),
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email,
      },
      back_urls: {
        success: `${baseUrl}/payment/success?purchase_id=${purchaseId}`,
        failure: `${baseUrl}/payment/failure?purchase_id=${purchaseId}`,
        pending: `${baseUrl}/payment/pending?purchase_id=${purchaseId}`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/payments/webhook`,
      external_reference: purchaseId,
    }

    console.log('[v0] MercadoPago preference payload:', preference)

    // Call MercadoPago API
    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.mercadopago_access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference),
      }
    )

    console.log('[v0] MercadoPago API response status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('[v0] MercadoPago API error:', error)
      throw new Error('Failed to create payment preference')
    }

    const data = await response.json()
    console.log('[v0] MercadoPago preference created:', data.id)

    return Response.json({
      init_point: data.init_point,
      preference_id: data.id,
    })
  } catch (error) {
    console.error('[v0] Create preference error:', error)
    return Response.json(
      { message: error instanceof Error ? error.message : 'Error creating preference' },
      { status: 500 }
    )
  }
}
