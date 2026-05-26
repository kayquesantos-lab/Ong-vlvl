'use client'
import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  FilterX,
  PawPrint,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { TableSkeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/page-header'
import { AnimalAvatar } from '@/components/animais/animal-avatar'
import { AnimalStatusBadge } from '@/components/animais/status-badge'
import { AnimalFormModal } from '@/components/animais/animal-form-modal'
import { AnimalDetailsModal } from '@/components/animais/animal-details-modal'
import { useDebounce } from '@/hooks/use-debounce'
import { cn, formatAnimalId } from '@/lib/utils'
import { PORTE_LABEL, SEXO_LABEL, type Animal, type Paginated } from '@/lib/types'
import api from '@/lib/api'

const PAGE_SIZE = 10

export default function AnimaisPage() {
  const [animais, setAnimais] = useState<Animal[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({ status: '', porte: '', sexo: '', search: '' })
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(filters.search, 400)

  const [formOpen, setFormOpen] = useState(false)
  const [editAnimal, setEditAnimal] = useState<Animal | null>(null)
  const [detailsAnimal, setDetailsAnimal] = useState<Animal | null>(null)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / PAGE_SIZE)), [count])

  useEffect(() => {
    let active = true
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.porte) params.set('porte', filters.porte)
    if (filters.sexo) params.set('sexo', filters.sexo)
    if (debouncedSearch) params.set('search', debouncedSearch)
    params.set('page', String(page))
    params.set('page_size', String(PAGE_SIZE))

    api
      .get<Paginated<Animal>>(`/animais/?${params}`)
      .then(({ data }) => {
        if (!active) return
        setAnimais(data.results)
        setCount(data.count)
      })
      .catch(() => {
        if (!active) return
        setAnimais([])
        setCount(0)
      })
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [filters.status, filters.porte, filters.sexo, debouncedSearch, page])

  // Reset paginacao quando filtro muda
  useEffect(() => {
    setPage(1)
  }, [filters.status, filters.porte, filters.sexo, debouncedSearch])

  function openNew() {
    setEditAnimal(null)
    setFormOpen(true)
  }

  function openEdit(animal: Animal) {
    setEditAnimal(animal)
    setDetailsAnimal(null)
    setFormOpen(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return
    try {
      await api.delete(`/animais/${id}/`)
      // Recarrega forcando refetch — ajusta page se ficou vazia
      setAnimais((prev) => prev.filter((a) => a.id !== id))
      setCount((c) => c - 1)
    } catch {
      alert('Erro ao excluir.')
    }
  }

  function clearFilters() {
    setFilters({ status: '', porte: '', sexo: '', search: '' })
  }

  const hasFilters =
    filters.status !== '' || filters.porte !== '' || filters.sexo !== '' || filters.search !== ''

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Peludos' }, { label: 'Gestão de peludos' }]}
        title="Gestão de Peludos"
        description="Gerencie a listagem e informações de todos os animais resgatados."
        actions={
          <Button onClick={openNew}>
            <Plus className="w-4 h-4" /> Cadastrar animal
          </Button>
        }
      />

      {/* Filtros */}
      <div className="bg-white border border-line rounded-card shadow-card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px] max-w-md">
            <label className="block text-xs font-bold text-ink-faint mb-1.5 uppercase tracking-wider">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                placeholder="Buscar pelo nome..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-line bg-white text-sm focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div className="w-40">
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Todos</option>
              <option value="NO_ABRIGO">No Abrigo</option>
              <option value="ADOTADO">Adotado</option>
              <option value="LT">Lar Temporário</option>
              <option value="DESAPARECIDO">Desaparecido</option>
              <option value="FALECIDO">Falecido</option>
            </Select>
          </div>

          <div className="w-36">
            <Select
              label="Porte"
              value={filters.porte}
              onChange={(e) => setFilters({ ...filters, porte: e.target.value })}
            >
              <option value="">Todos</option>
              <option value="PEQUENO">Pequeno</option>
              <option value="MEDIO">Médio</option>
              <option value="GRANDE">Grande</option>
            </Select>
          </div>

          <div className="w-32">
            <Select
              label="Sexo"
              value={filters.sexo}
              onChange={(e) => setFilters({ ...filters, sexo: e.target.value })}
            >
              <option value="">Todos</option>
              <option value="M">Macho</option>
              <option value="F">Fêmea</option>
            </Select>
          </div>

          {hasFilters && (
            <Button variant="ghost" size="md" onClick={clearFilters}>
              <FilterX className="w-4 h-4" /> Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-line rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-surface-muted border-b border-line">
              <tr>
                {['Foto', 'Nome', 'Porte', 'Sexo', 'Status'].map((h) => (
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
              <TableSkeleton rows={6} columns={['avatar', 'text', 'short', 'short', 'badge', 'actions']} />
            ) : animais.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={<PawPrint className="w-6 h-6 animate-pop" />}
                      title={hasFilters ? 'Nenhum animal corresponde aos filtros' : 'Nenhum animal cadastrado'}
                      description={
                        hasFilters
                          ? 'Tente limpar os filtros ou ajustar a busca.'
                          : 'Comece cadastrando o primeiro peludo da casa.'
                      }
                      action={
                        !hasFilters && (
                          <Button onClick={openNew}>
                            <Plus className="w-4 h-4" /> Cadastrar animal
                          </Button>
                        )
                      }
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-line-subtle stagger-children">
                {animais.map((animal) => (
                  <tr
                    key={animal.id}
                    className="group transition-colors hover:bg-brand-50/40"
                  >
                    <td className="px-6 py-3">
                      <div className="transition-transform duration-200 group-hover:scale-105">
                        <AnimalAvatar animal={animal} size="md" />
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-bold text-ink group-hover:text-brand-700 transition-colors">
                        {animal.nome}
                      </div>
                      <div className="text-xs text-ink-muted mt-0.5 font-mono">
                        #{formatAnimalId(animal.id)}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-ink-subtle">
                      {animal.porte ? PORTE_LABEL[animal.porte] : '—'}
                    </td>
                    <td className="px-6 py-3 text-sm text-ink-subtle">
                      {animal.sexo ? SEXO_LABEL[animal.sexo] : '—'}
                    </td>
                    <td className="px-6 py-3">
                      <AnimalStatusBadge status={animal.status} />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <ActionButton
                          label="Visualizar"
                          onClick={() => setDetailsAnimal(animal)}
                        >
                          <Eye className="w-4 h-4" />
                        </ActionButton>
                        <ActionButton label="Editar" onClick={() => openEdit(animal)}>
                          <Pencil className="w-4 h-4" />
                        </ActionButton>
                        <ActionButton
                          label="Excluir"
                          danger
                          onClick={() => handleDelete(animal.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {animais.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={count}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            itemLabel="peludos registrados"
          />
        )}
      </div>

      <AnimalFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          // Refetch reaplicando filtros atuais
          setFilters((f) => ({ ...f }))
        }}
        animal={editAnimal}
      />

      <AnimalDetailsModal
        animal={detailsAnimal}
        open={detailsAnimal !== null}
        onClose={() => setDetailsAnimal(null)}
        onEdit={() => detailsAnimal && openEdit(detailsAnimal)}
      />
    </>
  )
}

function ActionButton({
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
        'p-2 rounded-md text-ink-faint',
        'transition-all duration-150',
        'hover:scale-110 active:scale-95',
        danger ? 'hover:text-danger-500 hover:bg-danger-50' : 'hover:text-brand-500 hover:bg-brand-50',
      )}
    >
      {children}
    </button>
  )
}
