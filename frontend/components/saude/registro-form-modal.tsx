'use client'
import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import type { Animal, RegistroSaude, TipoSaude } from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
  registro: RegistroSaude | null
  animais: Animal[]
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

interface Form {
  animal: string
  tipo: TipoSaude
  nome_produto: string
  data_aplicacao: string
  proxima_dose: string
  observacoes: string
  proxima_dose_manual: boolean
}

const EMPTY: Form = {
  animal: '',
  tipo: 'ANTIRABICA',
  nome_produto: '',
  data_aplicacao: '',
  proxima_dose: '',
  observacoes: '',
  proxima_dose_manual: false,
}

export function RegistroFormModal({ open, onClose, onSaved, registro, animais }: Props) {
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (registro) {
      setForm({
        animal: String(registro.animal),
        tipo: registro.tipo,
        nome_produto: registro.nome_produto,
        data_aplicacao: registro.data_aplicacao,
        proxima_dose: registro.proxima_dose ?? '',
        observacoes: registro.observacoes,
        proxima_dose_manual: true,
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [open, registro])

  // Auto-calcular proxima dose
  useEffect(() => {
    if (form.proxima_dose_manual) return
    if (!form.data_aplicacao) return
    const calc = calcularProximaDose(form.tipo, form.data_aplicacao)
    setForm((f) => ({ ...f, proxima_dose: calc }))
  }, [form.tipo, form.data_aplicacao, form.proxima_dose_manual])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.animal) e.animal = 'Selecione um animal'
    if (!form.data_aplicacao) e.data_aplicacao = 'Data obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        animal: Number(form.animal),
        tipo: form.tipo,
        nome_produto: form.nome_produto,
        data_aplicacao: form.data_aplicacao,
        proxima_dose: form.proxima_dose || null,
        observacoes: form.observacoes,
      }
      if (registro) {
        await api.put(`/saude/registros/${registro.id}/`, payload)
      } else {
        await api.post('/saude/registros/', payload)
      }
      onSaved()
      onClose()
    } catch {
      setErrors({ general: 'Erro ao salvar. Verifique os dados.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={registro ? 'Editar registro de saúde' : 'Novo registro de saúde'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {registro ? 'Salvar alterações' : 'Cadastrar'}
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

        <Select
          label="Animal *"
          value={form.animal}
          onChange={(e) => setForm({ ...form, animal: e.target.value })}
          error={errors.animal}
        >
          <option value="">Selecione um animal</option>
          {animais.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </Select>

        <Select
          label="Tipo *"
          value={form.tipo}
          onChange={(e) =>
            setForm({ ...form, tipo: e.target.value as TipoSaude, proxima_dose_manual: false })
          }
        >
          <option value="ANTIRABICA">Vacina Antirrábica</option>
          <option value="V10">Vacina V10</option>
          <option value="OUTRA_VACINA">Outra Vacina</option>
          <option value="VERMIFUGO">Vermífugo</option>
          <option value="CARRAPATICIDA">Carrapaticida</option>
        </Select>

        <Input
          label="Nome do produto"
          value={form.nome_produto}
          onChange={(e) => setForm({ ...form, nome_produto: e.target.value })}
          placeholder="Ex: Nobivac Rabies"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Data da aplicação *"
            type="date"
            value={form.data_aplicacao}
            onChange={(e) => setForm({ ...form, data_aplicacao: e.target.value, proxima_dose_manual: false })}
            error={errors.data_aplicacao}
          />
          <Input
            label="Próxima dose"
            type="date"
            value={form.proxima_dose}
            onChange={(e) => setForm({ ...form, proxima_dose: e.target.value, proxima_dose_manual: true })}
            hint="Calculada automaticamente"
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
