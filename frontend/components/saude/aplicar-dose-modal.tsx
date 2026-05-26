'use client'
import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { AlertaSaude, TipoSaude } from '@/lib/types'

interface Props {
  alerta: AlertaSaude | null
  onClose: () => void
  onApplied: () => void
}

function calcularProximaDose(tipo: TipoSaude, dataAplicacao: string): string {
  if (!dataAplicacao) return ''
  const data = new Date(dataAplicacao + 'T12:00:00')
  switch (tipo) {
    case 'ANTIRABICA':
    case 'V10':
      data.setFullYear(data.getFullYear() + 1)
      break
    case 'VERMIFUGO':
      data.setMonth(data.getMonth() + 4)
      break
    case 'CARRAPATICIDA':
      data.setMonth(data.getMonth() + 3)
      break
    case 'OUTRA_VACINA':
      return ''
  }
  return data.toISOString().split('T')[0]
}

export function AplicarDoseModal({ alerta, onClose, onApplied }: Props) {
  const [dataAplicacao, setDataAplicacao] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (alerta) {
      const hoje = new Date().toISOString().split('T')[0]
      setDataAplicacao(hoje)
    }
  }, [alerta])

  const proxima = alerta ? calcularProximaDose(alerta.tipo, dataAplicacao) : ''

  async function handleAplicar() {
    if (!alerta || !dataAplicacao) return
    setSaving(true)
    try {
      await api.post('/saude/registros/', {
        animal: alerta.animal_id,
        tipo: alerta.tipo,
        data_aplicacao: dataAplicacao,
        proxima_dose: proxima || null,
        observacoes: 'Registrado via painel de alertas',
      })
      onApplied()
      onClose()
    } catch {
      alert('Erro ao registrar aplicação.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={alerta !== null}
      onClose={onClose}
      title="Registrar aplicação"
      description={
        alerta
          ? `${alerta.tipo_display} para ${alerta.animal_nome}`
          : undefined
      }
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleAplicar} loading={saving}>
            Confirmar aplicação
          </Button>
        </>
      }
    >
      {alerta && (
        <div className="space-y-4 pb-2">
          <Input
            label="Data da aplicação"
            type="date"
            value={dataAplicacao}
            onChange={(e) => setDataAplicacao(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />

          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
            <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
              Próxima dose
            </div>
            <div className="text-lg font-extrabold text-brand-700">
              {proxima ? formatDate(proxima) : 'Sem recorrência'}
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Calculado automaticamente conforme o tipo da aplicação.
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}
