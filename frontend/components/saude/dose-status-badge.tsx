import { Badge } from '@/components/ui/badge'
import type { StatusDose } from '@/lib/types'

const TONES: Record<StatusDose, 'success' | 'warning' | 'danger' | 'neutral' | 'violet'> = {
  EM_DIA: 'success',
  VENCENDO: 'warning',
  VENCIDA: 'danger',
  APLICADO: 'violet',
  SEM_RECORRENCIA: 'neutral',
}

const LABELS: Record<StatusDose, string> = {
  EM_DIA: 'Em dia',
  VENCENDO: 'Vencendo',
  VENCIDA: 'Vencida',
  APLICADO: 'Aplicado',
  SEM_RECORRENCIA: 'Sem recorrência',
}

export function DoseStatusBadge({ status }: { status: StatusDose }) {
  return <Badge tone={TONES[status]}>{LABELS[status]}</Badge>
}
