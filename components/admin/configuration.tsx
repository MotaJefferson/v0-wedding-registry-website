'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import type { SiteConfig } from '@/lib/types/database'

export default function Configuration() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config')
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error('[v0] Error fetching config:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao buscar configurações',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config) return

    setSaving(true)
    try {
      const response = await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (!response.ok) throw new Error('Failed to save config')

      toast({
        title: 'Sucesso',
        description: 'Configurações salvas',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar configurações',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!config) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações do Site</h2>
        <p className="text-muted-foreground">Gerenciar informações gerais e de pagamento</p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Couple Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Informações dos Noivos</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="couple_name">Nome do Casal</Label>
              <Input
                id="couple_name"
                value={config.couple_name || ''}
                onChange={(e) =>
                  setConfig({ ...config, couple_name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="wedding_date">Data do Casamento</Label>
              <Input
                id="wedding_date"
                type="date"
                value={config.wedding_date || ''}
                onChange={(e) =>
                  setConfig({ ...config, wedding_date: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Venue Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Informações do Local</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="venue_name">Nome do Local</Label>
              <Input
                id="venue_name"
                value={config.venue_name || ''}
                onChange={(e) =>
                  setConfig({ ...config, venue_name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="venue_address">Endereço</Label>
              <Input
                id="venue_address"
                value={config.venue_address || ''}
                onChange={(e) =>
                  setConfig({ ...config, venue_address: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="venue_latitude">Latitude</Label>
                <Input
                  id="venue_latitude"
                  type="number"
                  step="0.00000001"
                  value={config.venue_latitude || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      venue_latitude: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="venue_longitude">Longitude</Label>
                <Input
                  id="venue_longitude"
                  type="number"
                  step="0.00000001"
                  value={config.venue_longitude || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      venue_longitude: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Informações de Pagamento</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mercadopago_token">
                Token de Acesso MercadoPago
              </Label>
              <Input
                id="mercadopago_token"
                type="password"
                value={config.mercadopago_access_token || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    mercadopago_access_token: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Email Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Informações de Email</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notification_email">Email de Notificações</Label>
              <Input
                id="notification_email"
                type="email"
                value={config.notification_email || ''}
                onChange={(e) =>
                  setConfig({ ...config, notification_email: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Configurações
        </Button>
      </Card>
    </div>
  )
}
