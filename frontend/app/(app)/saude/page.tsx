'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus,
  Search,
  Stethoscope,
  AlertTriangle,
  Pencil,
  Trash2,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/ui/count-up'
import { TableSkeleton, StatSkeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/page-header'
import { AnimalAvatar } from '@/components/animais/animal-avatar'
import { AlertaCard } from '@/components/saude/alerta-card'
import { DoseStatusBadge } from '@/components/saude/dose-status-badge'
import { RegistroFormModal } from '@/components/saude/registro-form-modal'
import { AplicarDoseModal } from '@/components/saude/aplicar-dose-modal'
import { useDebounce } from '@/hooks/use-debounce'
import { cn, formatDate } from '@/lib/utils'
import {
  TIPO_SAUDE_LABEL,
  type AlertaSaude,
  type Animal,
  type Paginated,
  type RegistroSaude,
} from '@/lib/types'
import api from '@/lib/api'

type Tab = 'historico' | 'alertas'

export default function SaudePage() {
  const [tab, setTab] = useState<Tab>('historico')
  const [animais, setAnimais] = useState<Animal[]>([])
  const [registros, setRegistros] = useState<RegistroSaude[]>([])
  const [alertas, setAlertas] = useState<AlertaSaude[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [filtroAnimal, setFiltroAnimal] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editRegistro, setEditRegistro] = useState<RegistroSaude | null>(null)
  const [aplicarAlerta, setAplicarAlerta] = useState<AlertaSaude | null>(null)

  async function fetchTudo() {
    setLoading(true)
    try {
      const [animaisRes, registrosRes, alertasRes] = await Promise.all([
        api.get<Paginated<Animal>>('/animais/', { params: { page_size: 200 } }),
        api.get<Paginated<RegistroSaude>>('/saude/registros/', { params: { page_size: 200 } }),
        api.get<AlertaSaude[]>('/saude/alertas/'),
      ])
      setAnimais(animaisRes.data.results)
      setRegistros(registrosRes.data.results)
      setAlertas(alertasRes.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTudo()
  }, [])

  const registrosFiltrados = useMemo(() => {
    return registros.filter((r) => {
      if (filtroAnimal && String(r.animal) !== filtroAnimal) return false
      if (filtroTipo && r.tipo !== filtroTipo) return false
      if (debouncedSearch && !r.animal_nome.toLowerCase().includes(debouncedSearch.toLowerCase()))
        return false
      return true
    })
  }, [registros, filtroAnimal, filtroTipo, debouncedSearch])

  async function handleDelete(id: number) {
    if (!confirm('Deseja excluir este registro?')) return
    await api.delete(`/saude/registros/${id}/`)
    fetchTudo()
  }

  function openNew() {
    setEditRegistro(null)
    setFormOpen(true)
  }

  function openEdit(r: RegistroSaude) {
    setEditRegistro(r)
    setFormOpen(true)
  }

  const alertasVencidas = alertas.filter((a) => a.status === 'VENCIDA').length
  const alertasVencendo = alertas.filter((a) => a.status === 'VENCENDO').length

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Peludos' }, { label: 'Saúde dos animais' }]}
        title="Saúde dos Animais"
        description="Acompanhe vacinas, vermífugos e demais aplicações dos peludos."
        actions={
          <Button onClick={openNew}>
            <Plus className="w-4 h-4" /> Novo registro
          </Button>
        }
      />

      {/* Resumo de alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              tone="danger"
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Doses vencidas"
              value={alertasVencidas}
            />
            <StatCard
              tone="warning"
              icon={<Calendar className="w-5 h-5" />}
              label="Vencendo em 30 dias"
              value={alertasVencendo}
            />
            <StatCard
              tone="brand"
              icon={<Stethoscope className="w-5 h-5" />}
              label="Total de registros"
              value={registros.length}
            />
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        items={[
          { id: 'historico', label: 'Histórico' },
          {
            id: 'alertas',
            label: 'Alertas',
            badge:
              alertas.length > 0 ? (
                <Badge
                  tone={alertasVencidas > 0 ? 'danger' : 'warning'}
                  className={cn('ml-1.5', alertasVencidas > 0 && 'pulse-soft')}
                >
                  {alertas.length}
                </Badge>
              ) : undefined,
          },
        ]}
        active={tab}
        onChange={(id) => setTab(id as Tab)}
      />

      {tab === 'historico' ? (
        <Card>
          {/* Filtros */}
          <div className="px-6 py-4 flex flex-wrap items-end gap-4 border-b border-line-subtle">
            <div className="flex-1 min-w-[200px] max-w-md">
              <label className="block text-xs font-bold text-ink-faint mb-1.5 uppercase tracking-wider">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  placeholder="Buscar pelo nome do animal..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-line bg-white text-sm focus:border-brand-500"
                />
              </div>
            </div>
            <div className="w-48">
              <Select
                label="Animal"
                value={filtroAnimal}
                onChange={(e) => setFiltroAnimal(e.target.value)}
              >
                <option value="">Todos</option>
                {animais.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-48">
              <Select label="Tipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="">Todos</option>
                <option value="ANTIRABICA">Vacina Antirrábica</option>
                <option value="V10">Vacina V10</option>
                <option value="OUTRA_VACINA">Outra Vacina</option>
                <option value="VERMIFUGO">Vermífugo</option>
                <option value="CARRAPATICIDA">Carrapaticida</option>
              </Select>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead className="bg-surface-muted border-b border-line">
                <tr>
                  {['Animal', 'Tipo', 'Produto', 'Aplicação', 'Próxima dose', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-[11px] font-bold text-ink-muted uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="text-right px-6 py-3 text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              {loading ? (
                <TableSkeleton
                  rows={6}
                  columns={['text', 'short', 'short', 'short', 'short', 'badge', 'actions']}
                />
              ) : registrosFiltrados.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        icon={<Stethoscope className="w-6 h-6 animate-pop" />}
                        title="Nenhum registro de saúde"
                        description="Registre vacinas, vermífugos e outras aplicações para acompanhar a saúde dos peludos."
                        action={
                          <Button onClick={openNew}>
                            <Plus className="w-4 h-4" /> Novo registro
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-line-subtle stagger-children">
                  {registrosFiltrados.map((r) => {
                    const animal = animais.find((a) => a.id === r.animal)
                    return (
                      <tr key={r.id} className="group transition-colors hover:bg-brand-50/40">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            {animal && (
                              <div className="transition-transform group-hover:scale-105">
                                <AnimalAvatar animal={animal} size="sm" />
                              </div>
                            )}
                            <span className="font-semibold text-ink group-hover:text-brand-700 transition-colors">
                              {r.animal_nome}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-ink-subtle">
                          {TIPO_SAUDE_LABEL[r.tipo]}
                        </td>
                        <td className="px-6 py-3 text-sm text-ink-subtle">
                          {r.nome_produto || '—'}
                        </td>
                        <td className="px-6 py-3 text-sm text-ink-subtle">
                          {formatDate(r.data_aplicacao)}
                        </td>
                        <td className="px-6 py-3 text-sm text-ink-subtle">
                          {formatDate(r.proxima_dose)}
                        </td>
                        <td className="px-6 py-3">
                          <DoseStatusBadge status={r.status_dose} />
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <IconBtn label="Editar" onClick={() => openEdit(r)}>
                              <Pencil className="w-4 h-4" />
                            </IconBtn>
                            <IconBtn danger label="Excluir" onClick={() => handleDelete(r.id)}>
                              <Trash2 className="w-4 h-4" />
                            </IconBtn>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              )}
            </table>
          </div>
        </Card>
      ) : (
        // Tab Alertas
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white border border-line rounded-card p-4 h-44 skeleton" />
              ))}
            </div>
          ) : alertas.length === 0 ? (
            <Card>
              <EmptyState
                icon={<Stethoscope className="w-6 h-6 animate-pop" />}
                title="Nenhum alerta de saúde"
                description="Todos os peludos estão com vacinas em dia. Continue cuidando!"
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {alertas.map((a) => (
                <AlertaCard
                  key={`${a.animal_id}-${a.tipo}`}
                  alerta={a}
                  onAplicar={() => setAplicarAlerta(a)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <RegistroFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchTudo}
        registro={editRegistro}
        animais={animais}
      />

      <AplicarDoseModal
        alerta={aplicarAlerta}
        onClose={() => setAplicarAlerta(null)}
        onApplied={fetchTudo}
      />
    </>
  )
}

interface TabItem {
  id: string
  label: string
  badge?: React.ReactNode
}

function Tabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[]
  active: string
  onChange: (id: string) => void
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const el = refs.current[active]
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [active])

  return (
    <div className="relative flex items-center gap-1 border-b border-line">
      {items.map((item) => (
        <button
          key={item.id}
          ref={(el) => {
            refs.current[item.id] = el
          }}
          onClick={() => onChange(item.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors relative z-10',
            active === item.id ? 'text-brand-700' : 'text-ink-muted hover:text-ink',
          )}
        >
          {item.label}
          {item.badge}
        </button>
      ))}
      <span
        aria-hidden
        className="absolute bottom-0 h-[2px] bg-brand-500 rounded-full transition-all duration-300 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  )
}

function StatCard({
  tone,
  icon,
  label,
  value,
}: {
  tone: 'danger' | 'warning' | 'brand'
  icon: React.ReactNode
  label: string
  value: number
}) {
  const tones = {
    danger: 'bg-danger-50 text-danger-700',
    warning: 'bg-warning-50 text-warning-700',
    brand: 'bg-brand-50 text-brand-700',
  }
  const accents = {
    danger: 'from-danger-50/60 to-transparent',
    warning: 'from-warning-50/60 to-transparent',
    brand: 'from-brand-50/60 to-transparent',
  }
  return (
    <Card className={cn('relative overflow-hidden card-hover flex items-center gap-4 p-5')}>
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-50 -z-10',
          accents[tone],
        )}
      />
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110',
          tones[tone],
        )}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</div>
        <div className="text-2xl font-extrabold text-ink">
          <CountUp value={value} />
        </div>
      </div>
    </Card>
  )
}

function IconBtn({
  children,
  label,
  onClick,
  danger,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'p-2 rounded-md text-ink-faint transition-all duration-150 hover:scale-110 active:scale-95',
        danger ? 'hover:text-danger-500 hover:bg-danger-50' : 'hover:text-brand-500 hover:bg-brand-50',
      )}
    >
      {children}
    </button>
  )
}
