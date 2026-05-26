'use client'
import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Wallet,
  Pencil,
  Trash2,
  Download,
  FilterX,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { TableSkeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/page-header'
import { ResumoStats } from '@/components/financeiro/resumo-stats'
import { GraficoMensal } from '@/components/financeiro/grafico-mensal'
import { ContaFormModal } from '@/components/financeiro/conta-form-modal'
import { PagarContaModal } from '@/components/financeiro/pagar-conta-modal'
import { ContaStatusBadge } from '@/components/financeiro/conta-status-badge'
import ToastContainer, { toast } from '@/components/toast'
import { useDebounce } from '@/hooks/use-debounce'
import { cn, formatBRL, formatContaId, formatDate } from '@/lib/utils'
import type { Conta, Paginated, ResumoFinanceiro } from '@/lib/types'
import api from '@/lib/api'

const PAGE_SIZE = 10

export default function FinanceiroPage() {
  const [contas, setContas] = useState<Conta[]>([])
  const [count, setCount] = useState(0)
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [filtros, setFiltros] = useState({ status: '', categoria: '', data_inicio: '', data_fim: '' })
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editConta, setEditConta] = useState<Conta | null>(null)
  const [contaPagar, setContaPagar] = useState<Conta | null>(null)
  const [exportando, setExportando] = useState(false)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / PAGE_SIZE)), [count])
  const hasFilters =
    debouncedSearch !== '' ||
    filtros.status !== '' ||
    filtros.categoria !== '' ||
    filtros.data_inicio !== '' ||
    filtros.data_fim !== ''

  async function fetchContas() {
    setLoading(true)
    const params: Record<string, string> = {
      page: String(page),
      page_size: String(PAGE_SIZE),
    }
    if (debouncedSearch) params.search = debouncedSearch
    if (filtros.status) params.status = filtros.status
    if (filtros.categoria) params.categoria = filtros.categoria
    if (filtros.data_inicio) params.data_inicio = filtros.data_inicio
    if (filtros.data_fim) params.data_fim = filtros.data_fim

    try {
      const [contasRes, resumoRes] = await Promise.all([
        api.get<Paginated<Conta>>('/financeiro/contas/', { params }),
        api.get<ResumoFinanceiro>('/financeiro/resumo/'),
      ])
      setContas(contasRes.data.results)
      setCount(contasRes.data.count)
      setResumo(resumoRes.data)
    } catch {
      setContas([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContas()
  }, [page, debouncedSearch, filtros.status, filtros.categoria, filtros.data_inicio, filtros.data_fim])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filtros.status, filtros.categoria, filtros.data_inicio, filtros.data_fim])

  function openNew() {
    setEditConta(null)
    setFormOpen(true)
  }
  function openEdit(c: Conta) {
    setEditConta(c)
    setFormOpen(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Deseja excluir esta conta?')) return
    try {
      await api.delete(`/financeiro/contas/${id}/`)
      toast('Conta excluída.', 'warning')
      fetchContas()
    } catch {
      toast('Erro ao excluir a conta.', 'error')
    }
  }

  function clearFilters() {
    setSearch('')
    setFiltros({ status: '', categoria: '', data_inicio: '', data_fim: '' })
  }

  async function exportar(tipo: 'contas' | 'animais') {
    setExportando(true)
    try {
      const response = await api.get(`/financeiro/export/${tipo}/`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${tipo}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast(`Arquivo ${tipo}.csv baixado.`, 'success')
    } catch {
      toast('Erro ao exportar.', 'error')
    } finally {
      setExportando(false)
    }
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Controle Financeiro' }, { label: 'Contas' }]}
        title="Controle Financeiro"
        description="Acompanhe receitas, despesas e pagamentos da ONG."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => exportar('contas')}
              loading={exportando}
            >
              <Download className="w-4 h-4" /> Exportar
            </Button>
            <Button onClick={openNew}>
              <Plus className="w-4 h-4" /> Lançar conta
            </Button>
          </>
        }
      />

      <ResumoStats resumo={resumo} loading={loading && !resumo} />

      <GraficoMensal resumo={resumo} />

      <Card>
        {/* Filtros */}
        <div className="px-6 py-4 flex flex-wrap items-end gap-3 border-b border-line-subtle">
          <div className="flex-1 min-w-[220px] max-w-md">
            <label className="block text-xs font-bold text-ink-faint mb-1.5 uppercase tracking-wider">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                placeholder="Descrição ou fornecedor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-line bg-white text-sm focus:border-brand-500"
              />
            </div>
          </div>

          <div className="w-36">
            <Select
              label="Status"
              value={filtros.status}
              onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
            >
              <option value="">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="PAGO">Pago</option>
              <option value="VENCIDO">Vencido</option>
            </Select>
          </div>

          <div className="w-44">
            <Select
              label="Categoria"
              value={filtros.categoria}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
            >
              <option value="">Todas</option>
              <option value="ALIMENTACAO">Alimentação</option>
              <option value="VETERINARIO">Veterinário</option>
              <option value="MEDICAMENTO">Medicamento</option>
              <option value="HIGIENE">Higiene</option>
              <option value="INFRAESTRUTURA">Infraestrutura</option>
              <option value="TRANSPORTE">Transporte</option>
              <option value="OUTROS">Outros</option>
            </Select>
          </div>

          <div className="w-40">
            <label className="block text-xs font-bold text-ink-faint mb-1.5 uppercase tracking-wider">
              De
            </label>
            <input
              type="date"
              value={filtros.data_inicio}
              onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-line bg-white text-sm focus:border-brand-500"
            />
          </div>

          <div className="w-40">
            <label className="block text-xs font-bold text-ink-faint mb-1.5 uppercase tracking-wider">
              Até
            </label>
            <input
              type="date"
              value={filtros.data_fim}
              onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-line bg-white text-sm focus:border-brand-500"
            />
          </div>

          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <FilterX className="w-4 h-4" /> Limpar
            </Button>
          )}
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-surface-muted border-b border-line">
              <tr>
                {['ID', 'Descrição', 'Categoria', 'Vencimento', 'Valor', 'Status'].map((h) => (
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
                columns={['short', 'text', 'short', 'short', 'value', 'badge', 'actions']}
              />
            ) : contas.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={<Wallet className="w-6 h-6 animate-pop" />}
                      title={hasFilters ? 'Nenhuma conta encontrada' : 'Nenhuma conta lançada'}
                      description={
                        hasFilters
                          ? 'Tente limpar os filtros para ver todas as contas.'
                          : 'Lance a primeira conta para começar a controlar.'
                      }
                      action={
                        !hasFilters && (
                          <Button onClick={openNew}>
                            <Plus className="w-4 h-4" /> Lançar conta
                          </Button>
                        )
                      }
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-line-subtle stagger-children">
                {contas.map((c) => (
                  <tr key={c.id} className="group transition-colors hover:bg-brand-50/40">
                    <td className="px-6 py-3 text-sm font-mono text-ink-muted">
                      #{formatContaId(c.id)}
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-bold text-ink group-hover:text-brand-700 transition-colors">
                        {c.descricao}
                      </div>
                      {c.fornecedor && (
                        <div className="text-xs text-ink-muted mt-0.5">{c.fornecedor}</div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-ink-subtle">{c.categoria_display}</td>
                    <td className="px-6 py-3 text-sm text-ink-subtle">
                      {formatDate(c.vencimento)}
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-ink">
                      {formatBRL(c.valor)}
                    </td>
                    <td className="px-6 py-3">
                      <ContaStatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        {c.status !== 'PAGO' && (
                          <button
                            type="button"
                            title="Registrar pagamento"
                            onClick={() => setContaPagar(c)}
                            className="p-2 rounded-md text-ink-faint hover:text-success-700 hover:bg-success-50 transition-all hover:scale-110 active:scale-95"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <IconBtn label="Editar" onClick={() => openEdit(c)}>
                          <Pencil className="w-4 h-4" />
                        </IconBtn>
                        <IconBtn danger label="Excluir" onClick={() => handleDelete(c.id)}>
                          <Trash2 className="w-4 h-4" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {contas.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={count}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            itemLabel="contas"
          />
        )}
      </Card>

      <ContaFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={(msg) => {
          toast(msg, 'success')
          fetchContas()
        }}
        conta={editConta}
      />

      <PagarContaModal
        conta={contaPagar}
        onClose={() => setContaPagar(null)}
        onPaid={() => {
          toast('Pagamento registrado com sucesso!', 'success')
          fetchContas()
        }}
      />

      <ToastContainer />
    </>
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
