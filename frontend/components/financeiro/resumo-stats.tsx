import { CheckCircle2, Clock, AlertOctagon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/ui/count-up'
import { StatSkeleton } from '@/components/ui/skeleton'
import { cn, formatBRL } from '@/lib/utils'
import type { ResumoFinanceiro } from '@/lib/types'

interface Props {
  resumo: ResumoFinanceiro | null
  loading?: boolean
}

export function ResumoStats({ resumo, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
      <StatCard
        tone="success"
        icon={<CheckCircle2 className="w-5 h-5" />}
        label="Total pago"
        value={resumo?.total_pago ?? 0}
      />
      <StatCard
        tone="warning"
        icon={<Clock className="w-5 h-5" />}
        label="Total pendente"
        value={resumo?.total_pendente ?? 0}
      />
      <StatCard
        tone="danger"
        icon={<AlertOctagon className="w-5 h-5" />}
        label="Total vencido"
        value={resumo?.total_vencido ?? 0}
        hint={
          resumo && resumo.qtd_vencidas > 0
            ? `${resumo.qtd_vencidas} conta${resumo.qtd_vencidas === 1 ? '' : 's'}`
            : undefined
        }
      />
    </div>
  )
}

function StatCard({
  tone,
  icon,
  label,
  value,
  hint,
}: {
  tone: 'success' | 'warning' | 'danger'
  icon: React.ReactNode
  label: string
  value: number
  hint?: string
}) {
  const tones = {
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    danger: 'bg-danger-50 text-danger-700',
  }
  const accents = {
    success: 'from-success-50/70 to-transparent',
    warning: 'from-warning-50/70 to-transparent',
    danger: 'from-danger-50/70 to-transparent',
  }
  return (
    <Card className="relative overflow-hidden group card-hover flex items-center gap-4 p-5">
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-60 -z-10',
          accents[tone],
        )}
      />
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          'transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3',
          tones[tone],
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          {label}
        </div>
        <div className="text-xl font-extrabold text-ink truncate">
          <CountUp value={value} format={(n) => formatBRL(n)} duration={1100} />
        </div>
        {hint && <div className="text-xs text-ink-muted mt-0.5">{hint}</div>}
      </div>
    </Card>
  )
}
