import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    // 1. Verificar Autenticação de Admin
    const cookieStore = await cookies()
    const adminSession = cookieStore.get('admin_session')
    
    if (!adminSession) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { purchaseId } = await request.json()

    if (!purchaseId) {
      return Response.json({ message: 'Purchase ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    // 2. Buscar a compra no banco
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('id', purchaseId)
      .single()

    if (purchaseError || !purchase) {
      return Response.json({ message: 'Purchase not found' }, { status: 404 })
    }

    if (!purchase.payment_id) {
      return Response.json({ message: 'Esta compra ainda não possui ID de pagamento no MercadoPago' }, { status: 400 })
    }

    // 3. Buscar token de acesso nas configurações
    const { data: config } = await supabase
      .from('site_config')
      .select('mercadopago_access_token')
      .eq('id', 1)
      .single()

    if (!config?.mercadopago_access_token) {
      return Response.json({ message: 'MercadoPago not configured' }, { status: 500 })
    }

    // 4. Consultar API do MercadoPago
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${purchase.payment_id}`,
      {
        headers: {
          'Authorization': `Bearer ${config.mercadopago_access_token}`,
        },
      }
    )

    if (!mpResponse.ok) {
      return Response.json({ message: 'Erro ao consultar MercadoPago' }, { status: 500 })
    }

    const paymentData = await mpResponse.json()

    // 5. Mapear status
    const statusMap: Record<string, 'approved' | 'pending' | 'rejected'> = {
      'approved': 'approved',
      'pending': 'pending',
      'in_process': 'pending',
      'rejected': 'rejected',
      'cancelled': 'rejected',
      'refunded': 'rejected',
      'charged_back': 'rejected',
    }

    const newStatus = statusMap[paymentData.status] || 'pending'

    // 6. Atualizar no Banco de Dados se mudou
    if (newStatus !== purchase.payment_status) {
      const { error: updateError } = await supabase
        .from('purchases')
        .update({
          payment_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', purchaseId)

      if (updateError) throw updateError
    }

    return Response.json({ 
      success: true, 
      status: newStatus,
      oldStatus: purchase.payment_status 
    })

  } catch (error) {
    console.error('[v0] Check status error:', error)
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}