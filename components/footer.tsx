'use client'

import { Heart, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Maria & João
            </h3>
            <p className="text-sm text-muted-foreground">
              Obrigado por fazer parte do nosso dia especial!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/gifts" className="text-muted-foreground hover:text-primary transition">
                  Presentes
                </a>
              </li>
              <li>
                <a href="/guest" className="text-muted-foreground hover:text-primary transition">
                  Meus Presentes
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                contato@casamento.com
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                (11) 99999-9999
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Wedding Registry. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
