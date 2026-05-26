import { Badge } from '@/components/ui/badge'
import { STATUS_ANIMAL_LABEL, type StatusAnimal } from '@/lib/types'

const TONES: Record<StatusAnimal, 'brand' | 'info' | 'danger' | 'warning' | 'violet'> = {
  NO_ABRIGO: 'brand',
  ADOTADO: 'info',
  FALECIDO: 'danger',
  DESAPARECIDO: 'warning',
  LT: 'violet',
}

export function AnimalStatusBadge({ status }: { status: StatusAnimal }) {
  return <Badge tone={TONES[status]}>{STATUS_ANIMAL_LABEL[status]}</Badge>
}
