'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, MapPin, Gift, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/navigation'
import HeroSection from '@/components/home/hero-section'
import WeddingDetails from '@/components/home/wedding-details'
import LocationSection from '@/components/home/location-section'
import Footer from '@/components/footer'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToGifts = () => {
    const element = document.getElementById('gifts-section')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        {/* Hero Section */}
        <HeroSection onScrollToGifts={scrollToGifts} />

        {/* Wedding Details Section */}
        <WeddingDetails />

        {/* Location Section */}
        <LocationSection />

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Queremos compartilhar este momento com você
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Convidamos você a fazer parte do nosso dia especial escolhendo um presente que nos ajude a começar nossa nova vida juntos.
            </p>
            <Link href="/gifts">
              <Button size="lg" className="gap-2">
                <Gift className="w-5 h-5" />
                Ver Lista de Presentes
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
