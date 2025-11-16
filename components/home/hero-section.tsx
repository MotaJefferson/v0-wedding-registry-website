'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Gift, ChevronDown } from 'lucide-react'

interface HeroSectionProps {
  onScrollToGifts: () => void
}

export default function HeroSection({ onScrollToGifts }: HeroSectionProps) {
  const weddingDate = new Date('2025-06-21')
  const [daysUntil, setDaysUntil] = useState(0)

  useEffect(() => {
    const today = new Date()
    const diff = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    setDaysUntil(Math.max(0, diff))
  }, [])

  return (
    <section className="relative h-screen md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
          Maria & João
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Nos damos o prazer de convida-los para celebrar nosso casamento
        </p>
        
        <div className="mb-8 p-4 bg-card/80 backdrop-blur rounded-lg inline-block">
          <p className="text-sm text-muted-foreground">Faltam</p>
          <p className="text-4xl font-bold text-primary">{daysUntil}</p>
          <p className="text-sm text-muted-foreground">dias para o grande dia</p>
        </div>

        <Button 
          size="lg" 
          className="gap-2 mb-8"
          onClick={onScrollToGifts}
        >
          <Gift className="w-5 h-5" />
          Ver Nossa Lista de Presentes
        </Button>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-primary" />
        </div>
      </div>
    </section>
  )
}
