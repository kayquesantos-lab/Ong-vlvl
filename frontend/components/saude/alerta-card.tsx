'use client'
import { AlertTriangle, Calendar, Syringe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnimalAvatar } from '@/components/animais/animal-avatar'
import { cn, formatDate } from '@/lib/utils'
import type { AlertaSaude } from '@/lib/types'

interface Props {
  alerta: AlertaSaude
  onAplicar: () => void
}

export function AlertaCard({ alerta, onAplicar }: Props) {
  const vencida = alerta.status === 'VENCIDA'

  return (
    <div
      className={cn(
        'group rounded-card border bg-white shadow-card p-4 flex flex-col gap-3 card-hover',
        vencida
          ? 'border-danger-500/30 bg-gradient-to-br from-danger-50/40 to-white pulse-soft'
          : 'border-warning-500/30 bg-gradient-to-br from-warning-50/40 to-white',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge tone={vencida ? 'danger' : 'warning'}>
          <AlertTriangle className="w-3 h-3 mr-1" />
          {vencida ? 'Vencida' : 'Vencendo'}
        </Badge>
        <span className="text-xs text-ink-muted">
          {alerta.dias_restantes >= 0
            ? `Em ${alerta.dias_restantes} dia${alerta.dias_restantes === 1 ? '' : 's'}`
            : `Há ${Math.abs(alerta.dias_restantes)} dia${Math.abs(alerta.dias_restantes) === 1 ? '' : 's'}`}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <AnimalAvatar
          animal={{ nome: alerta.animal_nome, foto_url: alerta.animal_foto_url }}
          size="md"
        />
        <div className="min-w-0">
          <div className="font-bold text-ink truncate">{alerta.animal_nome}</div>
          <div className="flex items-center gap-1 text-xs text-ink-muted mt-0.5">
            <Syringe className="w-3 h-3" />
            <span className="truncate">{alerta.tipo_display}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-ink-subtle">
        <Calendar className="w-4 h-4 text-ink-faint" />
        <span>Próxima dose: {formatDate(alerta.proxima_dose)}</span>
      </div>

      <Button size="sm" variant={vencida ? 'danger' : 'primary'} onClick={onAplicar}>
        <Syringe className="w-3.5 h-3.5" /> Registrar aplicação
      </Button>
    </div>
  )
}
