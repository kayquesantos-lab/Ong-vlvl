'use client'
import { Pencil } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { AnimalAvatar } from './animal-avatar'
import { AnimalStatusBadge } from './status-badge'
import { formatAnimalId, formatDate } from '@/lib/utils'
import { PORTE_LABEL, SEXO_LABEL, type Animal } from '@/lib/types'

interface Props {
  animal: Animal | null
  open: boolean
  onClose: () => void
  onEdit: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-muted rounded-lg p-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-faint mb-1">
        {label}
      </div>
      <div className="text-sm font-bold text-ink-subtle">{value}</div>
    </div>
  )
}

function LongField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-muted rounded-lg p-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-faint mb-1.5">
        {label}
      </div>
      <p className="text-sm text-ink-subtle leading-relaxed whitespace-pre-line">{value}</p>
    </div>
  )
}

export function AnimalDetailsModal({ animal, open, onClose, onEdit }: Props) {
  if (!animal) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detalhes do animal"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="w-4 h-4" /> Editar
          </Button>
        </>
      }
    >
      <div className="space-y-4 pb-2">
        <div className="flex items-center gap-4 p-4 bg-surface-muted rounded-xl">
          <AnimalAvatar animal={animal} size="lg" />
          <div className="min-w-0">
            <div className="font-bold text-ink truncate">{animal.nome}</div>
            <div className="text-xs text-ink-muted mb-1.5">ID: #{formatAnimalId(animal.id)}</div>
            <AnimalStatusBadge status={animal.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Sexo" value={animal.sexo ? SEXO_LABEL[animal.sexo] : '—'} />
          <Field label="Porte" value={animal.porte ? PORTE_LABEL[animal.porte] : '—'} />
          <Field label="Castrado" value={animal.castrado ? 'Sim' : 'Não'} />
          <Field label="Nascimento" value={formatDate(animal.data_nascimento)} />
          <Field label="Cadastrado" value={formatDate(animal.criado_em)} />
          <Field label="Atualizado" value={formatDate(animal.atualizado_em)} />
        </div>

        {animal.aparencia && <LongField label="Aparência" value={animal.aparencia} />}
        {animal.comportamento && (
          <LongField label="Comportamento" value={animal.comportamento} />
        )}
        {animal.observacoes && <LongField label="Observações" value={animal.observacoes} />}
      </div>
    </Modal>
  )
}
