'use client'
import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import type { CategoriaConta, Conta, StatusConta } from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: (msg: string) => void
  conta: Conta | null
}

interface FormValues {
  descricao: string
  fornecedor: string
  categoria: CategoriaConta
  valor: string
  vencimento: string
  status: StatusConta
  observacoes: string
}

const EMPTY: FormValues = {
  descricao: '',
  fornecedor: '',
  categoria: 'OUTROS',
  valor: '',
  vencimento: '',
  status: 'PENDENTE',
  observacoes: '',
}

export function ContaFormModal({ open, onClose, onSaved, conta }: Props) {
  const [form, setForm] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (conta) {
      setForm({
        descricao: conta.descricao,
        fornecedor: conta.fornecedor,
        categoria: conta.categoria,
        valor: String(conta.valor),
        vencimento: conta.vencimento,
        status: conta.status,
        observacoes: conta.observacoes,
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [open, conta])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.descricao.trim()) e.descricao = 'Descrição obrigatória'
    if (!form.valor) e.valor = 'Valor obrigatório'
    if (!form.vencimento) e.vencimento = 'Vencimento obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    try {
      if (conta) {
        await api.put(`/financeiro/contas/${conta.id}/`, form)
        onSaved('Conta atualizada com sucesso!')
      } else {
        await api.post('/financeiro/contas/', form)
        onSaved('Conta lançada com sucesso!')
      }
      onClose()
    } catch {
      setErrors({ general: 'Erro ao salvar a conta.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={conta ? 'Editar conta' : 'Lançar nova conta'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {conta ? 'Salvar alterações' : 'Lançar conta'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 pb-2">
        {errors.general && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-danger-50 border border-danger-500/30 text-danger-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <Input
          label="Descrição *"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          error={errors.descricao}
          placeholder="Ex: Ração Premier Adulto 15kg"
        />

        <Input
          label="Fornecedor"
          value={form.fornecedor}
          onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
          placeholder="Ex: Petshop Bom Amigo"
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Categoria"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaConta })}
          >
            <option value="ALIMENTACAO">Alimentação</option>
            <option value="VETERINARIO">Veterinário</option>
            <option value="MEDICAMENTO">Medicamento</option>
            <option value="HIGIENE">Higiene</option>
            <option value="INFRAESTRUTURA">Infraestrutura</option>
            <option value="TRANSPORTE">Transporte</option>
            <option value="OUTROS">Outros</option>
          </Select>

          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as StatusConta })}
          >
            <option value="PENDENTE">Pendente</option>
            <option value="PAGO">Pago</option>
            <option value="VENCIDO">Vencido</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Valor (R$) *"
            type="number"
            step="0.01"
            min="0"
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
            error={errors.valor}
            placeholder="0,00"
          />

          <Input
            label="Vencimento *"
            type="date"
            value={form.vencimento}
            onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
            error={errors.vencimento}
          />
        </div>

        <Textarea
          label="Observações"
          optional
          rows={2}
          value={form.observacoes}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
        />
      </div>
    </Modal>
  )
}
