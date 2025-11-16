'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import type { Purchase, Gift } from '@/lib/types/database'

interface PurchaseWithGift extends Purchase {
  gift?: Gift
}

export default function GuestPurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseWithGift[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/guest/purchases')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/guest/login')
            return
          }
          throw new Error('Failed to fetch purchases')
        }

        const data = await response.json()
        setPurchases(data)
      } catch (error) {
        console.error('[v0] Error fetching purchases:', error)
        toast({
          title: 'Erro',
          description: 'Erro ao buscar seus presentes',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [router, toast])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/guest/logout', { method: 'POST' })
      router.push('/guest/login')
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Aprovado</Badge>
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Meus Presentes</h1>
            <p className="text-sm text-muted-foreground">Histórico de presentes que você deu</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : purchases.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Você ainda não deu nenhum presente
            </p>
            <Button onClick={() => router.push('/gifts')}>
              Ver Lista de Presentes
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Total de presentes: {purchases.length}
              </h2>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Presente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>ID da Transação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">
                        {purchase.gift?.name || 'Presente removido'}
                      </TableCell>
                      <TableCell>{formatPrice(purchase.amount)}</TableCell>
                      <TableCell>
                        {getStatusBadge(purchase.payment_status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(purchase.created_at)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {purchase.payment_id || 'Processando...'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Summary */}
            <Card className="p-6 bg-accent/5">
              <h3 className="font-bold mb-4">Resumo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Investido</p>
                  <p className="text-2xl font-bold">
                    {formatPrice(
                      purchases.reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Presentes Aprovados</p>
                  <p className="text-2xl font-bold">
                    {purchases.filter((p) => p.payment_status === 'approved')
                      .length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
