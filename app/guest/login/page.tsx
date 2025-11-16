'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from '@/components/ui/input-otp'
import { useToast } from '@/hooks/use-toast'

type Step = 'email' | 'otp'

export default function GuestLoginPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/guest/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error requesting OTP')
      }

      toast({
        title: 'Sucesso',
        description: 'Código OTP enviado para seu email',
      })

      setStep('otp')
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao solicitar código',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/guest/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP')
      }

      toast({
        title: 'Sucesso',
        description: 'Login realizado com sucesso',
      })

      router.push('/guest/purchases')
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao verificar código',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md p-8">
        {step === 'email' ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Meus Presentes</h1>
              <p className="text-muted-foreground">
                Digite seu email para acessar seu histórico de presentes
              </p>
            </div>

            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Enviar Código
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Verificar Código</h1>
              <p className="text-muted-foreground">
                Digitamos um código de 6 dígitos para {email}
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <Label className="mb-4 block">Código OTP</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Verificar
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                }}
              >
                Voltar
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}
