import { Badge } from '@/components/ui/badge'
import { STATUS_CONTA_LABEL, type StatusConta } from '@/lib/types'

const TONES: Record<StatusConta, 'success' | 'warning' | 'danger'> = {
  PAGO: 'success',
  PENDENTE: 'warning',
  VENCIDO: 'danger',
}

export function ContaStatusBadge({ status }: { status: StatusConta }) {
  return <Badge tone={TONES[status]}>{STATUS_CONTA_LABEL[status]}</Badge>
}
