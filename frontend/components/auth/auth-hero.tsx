import Image from 'next/image'
import { PawPrint, Heart, Stethoscope, Home } from 'lucide-react'

interface Pillar {
  icon: React.ReactNode
  title: string
  description: string
}

const PILLARS: Pillar[] = [
  {
    icon: <PawPrint className="w-4 h-4" />,
    title: 'Resgate',
    description: 'Buscamos animais em situação de risco e abandono.',
  },
  {
    icon: <Stethoscope className="w-4 h-4" />,
    title: 'Cuidado',
    description: 'Tratamento veterinário, vacinas e acompanhamento.',
  },
  {
    icon: <Home className="w-4 h-4" />,
    title: 'Adoção',
    description: 'Encontramos famílias responsáveis para cada peludo.',
  },
]

export function AuthHero() {
  return (
    <div className="relative h-full flex flex-col justify-between p-8 lg:p-10 text-white overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 rounded-3xl min-h-[520px]">
      {/* Decorações de fundo */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-12 w-72 h-72 rounded-full bg-accent-500/30 blur-3xl" />

      {/* Patinhas flutuantes */}
      <PawPrint
        className="absolute top-12 right-12 w-16 h-16 text-white/10 float-slow"
        style={{ transform: 'rotate(-18deg)' }}
      />
      <PawPrint
        className="absolute bottom-32 right-8 w-10 h-10 text-white/15 float-slower"
        style={{ animationDelay: '1.2s' }}
      />
      <PawPrint
        className="absolute top-1/2 left-8 w-12 h-12 text-white/10 float-slow"
        style={{ animationDelay: '0.6s', transform: 'rotate(22deg)' }}
      />

      {/* Topo: logo + nome */}
      <div className="relative">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-2xl mb-5 p-2.5">
          <Image
            src="/logo.png"
            alt="Vira Lata Vira Luxo"
            width={72}
            height={72}
            className="object-contain w-full h-full"
            priority
          />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-1">
          Portal Institucional
        </p>
        <h2 className="text-3xl font-extrabold leading-tight">
          Vira Lata
          <br />
          Vira Luxo
        </h2>
      </div>

      {/* Meio: missão */}
      <div className="relative">
        <Heart className="w-5 h-5 text-accent-300 mb-3 fill-accent-300/40" />
        <p className="text-lg font-medium text-white/95 leading-snug">
          &ldquo;Cada peludo merece um lar cheio de amor.&rdquo;
        </p>
        <p className="text-sm text-white/70 mt-2 leading-relaxed">
          Trabalhamos para transformar a vida de animais em situação de
          vulnerabilidade através do resgate, cuidado e adoção responsável.
        </p>
      </div>

      {/* Base: pilares */}
      <div className="relative pt-6 border-t border-white/15 space-y-2.5">
        {PILLARS.map((p) => (
          <div key={p.title} className="flex items-start gap-3">
            <div className="shrink-0 w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white mt-0.5">
              {p.icon}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white leading-tight">
                {p.title}
              </div>
              <div className="text-xs text-white/70 leading-snug">
                {p.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
