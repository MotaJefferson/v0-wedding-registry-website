'use client'

import { Calendar, Clock, MapPin, Cross as Dress } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function WeddingDetails() {
  return (
    <section id="details" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-balance">
          Detalhes da Cerimônia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ceremony */}
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Cerimônia</h3>
                <p className="text-muted-foreground mb-1">21 de Junho de 2025</p>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>17:00 - Entrada dos noivos</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Reception */}
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Recepção</h3>
                <p className="text-muted-foreground mb-1">Mesmo local</p>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>19:00 - Início</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Dress Code */}
          <Card className="p-6 md:col-span-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Dress className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Traje Sugerido</h3>
                <p className="text-muted-foreground">
                  Social - Convidamos você a usar suas melhores roupas para celebrar com a gente! Mulheres: vestido ou terno. Homens: terno ou smoking.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
