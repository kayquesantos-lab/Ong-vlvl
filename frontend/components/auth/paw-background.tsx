import { PawPrint } from 'lucide-react'

interface Paw {
  top: string
  left: string
  size: number
  rotate: number
  opacity: number
  delay: string
  duration: 'slow' | 'slower'
  color: 'brand' | 'accent'
}

const PAWS: Paw[] = [
  { top: '8%',  left: '6%',  size: 28, rotate: -22, opacity: 0.25, delay: '0s',   duration: 'slow',   color: 'brand'  },
  { top: '18%', left: '88%', size: 36, rotate: 18,  opacity: 0.22, delay: '0.8s', duration: 'slower', color: 'accent' },
  { top: '40%', left: '92%', size: 22, rotate: -8,  opacity: 0.18, delay: '1.4s', duration: 'slow',   color: 'brand'  },
  { top: '68%', left: '4%',  size: 32, rotate: 28,  opacity: 0.22, delay: '0.4s', duration: 'slower', color: 'accent' },
  { top: '78%', left: '82%', size: 26, rotate: -16, opacity: 0.20, delay: '1.8s', duration: 'slow',   color: 'brand'  },
  { top: '32%', left: '14%', size: 20, rotate: 8,   opacity: 0.18, delay: '2.2s', duration: 'slower', color: 'accent' },
  { top: '55%', left: '78%', size: 18, rotate: 24,  opacity: 0.16, delay: '1.0s', duration: 'slow',   color: 'brand'  },
  { top: '88%', left: '50%', size: 24, rotate: -4,  opacity: 0.18, delay: '0.2s', duration: 'slower', color: 'accent' },
]

export function PawBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Blobs coloridos no fundo */}
      <div className="absolute top-1/4 -left-32 w-[480px] h-[480px] bg-brand-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-fade-in" />
      <div
        className="absolute bottom-0 -right-32 w-[480px] h-[480px] bg-accent-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-fade-in"
        style={{ animationDelay: '0.2s' }}
      />

      {/* Patinhas flutuando */}
      {PAWS.map((p, i) => (
        <PawPrint
          key={i}
          className={p.duration === 'slow' ? 'float-slow' : 'float-slower'}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            color: p.color === 'brand' ? '#40BFC1' : '#F59E0B',
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
