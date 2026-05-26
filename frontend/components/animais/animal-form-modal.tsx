'use client'
import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2, AlertCircle } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import type { Animal, Porte, Sexo, StatusAnimal } from '@/lib/types'

interface FormValues {
  nome: string
  sexo: Sexo
  porte: Porte
  status: StatusAnimal
  castrado: boolean
  aparencia: string
  comportamento: string
  observacoes: string
  fotoFile: File | null
  fotoPreview: string
}

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
  animal: Animal | null
}

const EMPTY: FormValues = {
  nome: '',
  sexo: 'M',
  porte: 'MEDIO',
  status: 'NO_ABRIGO',
  castrado: false,
  aparencia: '',
  comportamento: '',
  observacoes: '',
  fotoFile: null,
  fotoPreview: '',
}

export function AnimalFormModal({ open, onClose, onSaved, animal }: Props) {
  const [form, setForm] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    if (animal) {
      setForm({
        nome: animal.nome,
        sexo: animal.sexo ?? 'M',
        porte: animal.porte ?? 'MEDIO',
        status: animal.status,
        castrado: animal.castrado,
        aparencia: animal.aparencia,
        comportamento: animal.comportamento,
        observacoes: animal.observacoes,
        fotoFile: null,
        fotoPreview: animal.foto_url ?? '',
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [open, animal])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.nome.trim()) e.nome = 'Nome obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('nome', form.nome)
      fd.append('sexo', form.sexo)
      fd.append('porte', form.porte)
      fd.append('status', form.status)
      fd.append('castrado', String(form.castrado))
      fd.append('aparencia', form.aparencia)
      fd.append('comportamento', form.comportamento)
      fd.append('observacoes', form.observacoes)
      if (form.fotoFile) fd.append('foto', form.fotoFile)

      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (animal) {
        await api.put(`/animais/${animal.id}/`, fd, cfg)
      } else {
        await api.post('/animais/', fd, cfg)
      }
      onSaved()
      onClose()
    } catch {
      setErrors({ general: 'Erro ao salvar. Verifique os dados.' })
    } finally {
      setSaving(false)
    }
  }

  function handlePickFile(file: File | null) {
    if (!file) {
      setForm({ ...form, fotoFile: null, fotoPreview: '' })
      return
    }
    setForm({ ...form, fotoFile: file, fotoPreview: URL.createObjectURL(file) })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={animal ? 'Editar animal' : 'Cadastrar animal'}
      description={animal ? `Editando ${animal.nome}` : 'Preencha os dados do peludo.'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {animal ? 'Salvar alterações' : 'Cadastrar'}
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

        {/* Foto */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Foto <span className="text-ink-faint font-normal">(opcional)</span>
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'w-full border border-dashed border-line rounded-lg p-4 bg-surface-muted',
              'flex flex-col items-center justify-center gap-2',
              'hover:border-brand-500 hover:bg-brand-50/30 transition-colors',
            )}
          >
            {form.fotoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.fotoPreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-ink-faint" />
                <span className="text-sm text-ink-muted">Clique para adicionar foto</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)}
          />
          {form.fotoPreview && (
            <button
              type="button"
              onClick={() => handlePickFile(null)}
              className="flex items-center gap-1 mt-2 text-xs text-danger-500 hover:text-danger-700"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remover foto
            </button>
          )}
        </div>

        <Input
          label="Nome *"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          error={errors.nome}
          placeholder="Ex: Bidu"
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Sexo"
            value={form.sexo}
            onChange={(e) => setForm({ ...form, sexo: e.target.value as Sexo })}
          >
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </Select>

          <Select
            label="Porte"
            value={form.porte}
            onChange={(e) => setForm({ ...form, porte: e.target.value as Porte })}
          >
            <option value="PEQUENO">Pequeno</option>
            <option value="MEDIO">Médio</option>
            <option value="GRANDE">Grande</option>
          </Select>
        </div>

        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as StatusAnimal })}
        >
          <option value="NO_ABRIGO">No Abrigo</option>
          <option value="ADOTADO">Adotado</option>
          <option value="LT">Lar Temporário</option>
          <option value="DESAPARECIDO">Desaparecido</option>
          <option value="FALECIDO">Falecido</option>
        </Select>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Castrado?</label>
          <div className="flex gap-2">
            {[
              { label: 'Sim', value: true },
              { label: 'Não', value: false },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setForm({ ...form, castrado: opt.value })}
                className={cn(
                  'flex-1 h-10 px-4 rounded-lg text-sm font-semibold transition-colors border',
                  form.castrado === opt.value
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-ink-subtle border-line hover:bg-surface-muted',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Aparência"
          optional
          rows={2}
          value={form.aparencia}
          onChange={(e) => setForm({ ...form, aparencia: e.target.value })}
          placeholder="Descreva a aparência do animal..."
        />

        <Textarea
          label="Comportamento"
          optional
          rows={2}
          value={form.comportamento}
          onChange={(e) => setForm({ ...form, comportamento: e.target.value })}
          placeholder="Descreva o comportamento do animal..."
        />

        <Textarea
          label="Observações"
          optional
          rows={2}
          value={form.observacoes}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          placeholder="Alguma observação importante..."
        />
      </div>
    </Modal>
  )
}
