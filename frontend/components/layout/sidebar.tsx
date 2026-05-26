'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PawPrint, Stethoscope, Wallet, LogOut, type LucideIcon } from 'lucide-react'
import { logout } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavSection {
  title: string
  items: NavItem[]
}

const SECTIONS: NavSection[] = [
  {
    title: 'Peludos',
    items: [
      { href: '/animais', label: 'Cadastro de Animais', icon: PawPrint },
      { href: '/saude', label: 'Saúde dos animais', icon: Stethoscope },
    ],
  },
  {
    title: 'Controle Financeiro',
    items: [
      { href: '/financeiro', label: 'Lançamento de contas', icon: Wallet },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 shrink-0 bg-white border-r border-line flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-line-subtle">
        <div className="relative w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-sm shadow-brand-500/30 transition-transform hover:scale-105 hover:rotate-6 cursor-default">
          <PawPrint className="w-6 h-6" />
        </div>
        <div>
          <div className="font-bold text-ink leading-tight">Vira Lata</div>
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Vira Luxo
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-7 scrollbar-thin">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[11px] font-bold text-ink-faint uppercase tracking-widest">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                        'transition-all duration-200',
                        active
                          ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm'
                          : 'text-ink-subtle hover:bg-surface-muted hover:text-ink hover:translate-x-0.5',
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-brand-500 rounded-r-full" />
                      )}
                      <Icon
                        className={cn(
                          'w-[18px] h-[18px] shrink-0 transition-transform duration-200',
                          active ? 'scale-110' : 'group-hover:scale-110',
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line-subtle p-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-muted hover:bg-surface-subtle transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-ink truncate">Admin Vira Lata</div>
            <div className="text-xs text-ink-muted">Sair do sistema</div>
          </div>
          <button
            onClick={logout}
            className="shrink-0 p-2 rounded-lg text-ink-faint hover:text-danger-500 hover:bg-white hover:scale-110 active:scale-95 transition-all"
            aria-label="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
