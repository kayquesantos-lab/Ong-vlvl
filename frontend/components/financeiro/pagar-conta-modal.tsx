'use client'
import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { formatBRL } from '@/lib/utils'
import type { Conta } from '@/lib/types'

interface Props {
  conta: Conta | null
  onClose: () => void
  onPaid: () => void
}

export function PagarContaModal({ conta, onClose, onPaid }: Props) {
  const [dataPagamento, setDataPagamento] = useState('')
  const [valorPago, setValorPago] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (conta) {
      setDataPagamento(new Date().toISOString().split('T')[0])
      setValorPago(String(conta.valor))
      setObservacoes('')
    }
  }, [conta])

  async function handleSubmit() {
    if (!conta || !dataPagamento || !valorPago) return
    setSaving(true)
    try {
      await api.post('/financeiro/pagamentos/', {
        conta: conta.id,
        data_pagamento: dataPagamento,
        valor_pago: valorPago,
        observacoes,
      })
      onPaid()
      onClose()
    } catch {
      alert('Erro ao registrar pagamento.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={conta !== null}
      onClose={onClose}
      title="Registrar pagamento"
      description={conta?.descricao}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Confirmar pagamento
          </Button>
        </>
      }
    >
      {conta && (
        <div className="space-y-4 pb-2">
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
            <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
              Valor da conta
            </div>
            <div className="text-2xl font-extrabold text-brand-700">
              {formatBRL(conta.valor)}
            </div>
          </div>

          <Input
            label="Data do pagamento *"
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
          />

          <Input
            label="Valor pago (R$) *"
            type="number"
            step="0.01"
            min="0"
            value={valorPago}
            onChange={(e) => setValorPago(e.target.value)}
          />

          <Textarea
            label="Observações"
            optional
            rows={2}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>
      )}
    </Modal>
  )
}
