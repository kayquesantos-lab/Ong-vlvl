import { ReactNode } from 'react'
import { Sidebar } from './sidebar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-surface-muted">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-6 md:px-8 lg:px-10 py-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
