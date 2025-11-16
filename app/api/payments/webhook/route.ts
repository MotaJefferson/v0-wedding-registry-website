import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log('[v0] Webhook received:', body)

    // Handle different webhook types
    if (body.type === 'payment') {
      const paymentId = body.data.id

      // Verify webhook signature (if using Webhook verification)
      // const xSignature = request.headers.get('x-signature')
      // const xRequestId = request.headers.get('x-request-id')
      // Verify signature logic here

      // Get payment details from MercadoPago
      const { data: config } = await supabase
        .from('site_config')
        .select('mercadopago_access_token')
        .eq('id', 1)
        .single()

      if (!config?.mercadopago_access_token) {
        throw new Error('MercadoPago not configured')
      }

      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${config.mercadopago_access_token}`,
          },
        }
      )

      if (!paymentResponse.ok) {
        throw new Error('Failed to fetch payment details')
      }

      const payment = await paymentResponse.json()

      if (payment.status === 'approved') {
        const externalReference = payment.external_reference

        // Update purchase
        const { data: purchase, error: purchaseError } = await supabase
          .from('purchases')
          .select('*')
          .eq('id', externalReference)
          .single()

        if (purchaseError || !purchase) {
          throw new Error('Purchase not found')
        }

        // Update purchase status
        await supabase
          .from('purchases')
          .update({
            payment_id: paymentId.toString(),
            payment_status: 'approved',
            updated_at: new Date().toISOString(),
          })
          .eq('id', externalReference)

        // Update gift status
        await supabase
          .from('gifts')
          .update({
            status: 'purchased',
            purchased_by: purchase.guest_email,
            purchased_at: new Date().toISOString(),
          })
          .eq('id', purchase.gift_id)

        try {
          await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/email/send-purchase-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ purchaseId: externalReference }),
          })
        } catch (emailError) {
          console.error('[v0] Failed to send confirmation email:', emailError)
        }

        console.log('[v0] Payment approved for purchase:', externalReference)
      } else if (payment.status === 'rejected') {
        const externalReference = payment.external_reference

        await supabase
          .from('purchases')
          .update({
            payment_status: 'rejected',
            updated_at: new Date().toISOString(),
          })
          .eq('id', externalReference)

        console.log('[v0] Payment rejected for purchase:', externalReference)
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return Response.json(
      { message: 'Error processing webhook' },
      { status: 500 }
    )
  }
}
