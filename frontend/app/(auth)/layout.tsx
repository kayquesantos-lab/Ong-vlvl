import { ReactNode } from 'react'
import { PawBackground } from '@/components/auth/paw-background'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-soft bg-300 relative overflow-hidden"
      style={{ animation: 'gradientShift 18s ease infinite' }}
    >
      <PawBackground />
      <div className="w-full max-w-md lg:max-w-5xl relative">{children}</div>
    </div>
  )
}
