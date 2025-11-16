'use client'

import { Button } from '@/components/ui/button'
import { MapPin, ExternalLink } from 'lucide-react'

export default function LocationSection() {
  const venue = {
    name: 'Salão de Festas Elegância',
    address: 'Rua das Flores, 1234, São Paulo, SP',
    latitude: -23.561414,
    longitude: -46.656139,
  }

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`
    window.open(url, '_blank')
  }

  const openWaze = () => {
    const url = `https://waze.com/ul?ll=${venue.latitude},${venue.longitude}&navigate=yes`
    window.open(url, '_blank')
  }

  return (
    <section id="location" className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-balance">
          Local do Evento
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.2023!2d${venue.longitude}!3d${venue.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1spt-BR!2sbr!4v1234567890`}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center gap-6">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">{venue.name}</h3>
                  <p className="text-muted-foreground text-sm">{venue.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full gap-2"
                onClick={openGoogleMaps}
              >
                <MapPin className="w-4 h-4" />
                Abrir no Google Maps
              </Button>
              <Button 
                variant="outline"
                className="w-full gap-2"
                onClick={openWaze}
              >
                <MapPin className="w-4 h-4" />
                Abrir no Waze
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg text-sm">
              <p className="font-semibold mb-2">Estacionamento</p>
              <p className="text-muted-foreground">
                Estacionamento gratuito disponível no local com vagas acessíveis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
