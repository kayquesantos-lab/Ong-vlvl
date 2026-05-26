import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import '@/styles/animations.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Vira Lata Vira Luxo — Portal',
    template: '%s · Vira Lata Vira Luxo',
  },
  description:
    'Portal de gestão da ONG Vira Lata Vira Luxo — cadastro de animais, saúde, adoção e controle financeiro.',
  applicationName: 'Vira Lata Vira Luxo',
  authors: [{ name: 'ONG Vira Lata Vira Luxo' }],
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={manrope.variable} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>{children}</body>
    </html>
  )
}
