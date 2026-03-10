'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { logout } from '@/lib/auth'

type Animal = {
  id: number
  nome: string
  raca?: string
  sexo: string
  porte: string
  status: string
  foto?: string
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  NO_ABRIGO: { bg: '#e6f9f5', color: '#3dbdb0' },
  ADOTADO: { bg: '#e8f4fd', color: '#5ba8d4' },
  FALECIDO: { bg: '#fde8e8', color: '#e05c5c' },
  DESAPARECIDO: { bg: '#fff4e6', color: '#f59e0b' },
  LT: { bg: '#f0e6ff', color: '#9b59b6' },
}

const STATUS_LABELS: Record<string, string> = {
  NO_ABRIGO: 'NO ABRIGO',
  ADOTADO: 'ADOTADO',
  FALECIDO: 'FALECIDO',
  DESAPARECIDO: 'DESAPARECIDO',
  LT: 'LAR TEMPORÁRIO',
}

const SEXO_LABELS: Record<string, string> = { M: 'Macho', F: 'Fêmea' }
const PORTE_LABELS: Record<string, string> = { PEQUENO: 'Pequeno', MEDIO: 'Médio', GRANDE: 'Grande' }

export default function AnimaisPage() {
  const [animais, setAnimais] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', porte: '', sexo: '', search: '' })
  const [showModal, setShowModal] = useState(false)
  const [editAnimal, setEditAnimal] = useState<Animal | null>(null)
  const [form, setForm] = useState({
    nome: '', raca: '', sexo: 'M', porte: 'MEDIO', status: 'NO_ABRIGO',
    castrado: false, aparencia: '', comportamento: '', observacoes: '',
    fotoFile: null as File | null, fotoPreview: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [viewAnimal, setViewAnimal] = useState<Animal | null>(null)
  const PER_PAGE = 5

  async function fetchAnimais() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.porte) params.append('porte', filters.porte)
      if (filters.sexo) params.append('sexo', filters.sexo)
      if (filters.search) params.append('search', filters.search)
      const { data } = await api.get(`/animais/?${params}`)

      // Garante que sempre será um array
      if (Array.isArray(data)) {
        setAnimais(data)
      } else if (Array.isArray(data.results)) {
        setAnimais(data.results)
      } else {
        setAnimais([])
      }
    } catch (err) {
      console.error('Erro ao buscar animais:', err)
      setAnimais([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimais()
  }, [filters])

  function clearFilters() {
    setFilters({ status: '', porte: '', sexo: '', search: '' })
    setPage(1)
  }

  function openNew() {
    setEditAnimal(null)
    setForm({
      nome: '', raca: '', sexo: 'M', porte: 'MEDIO', status: 'NO_ABRIGO',
      castrado: false, aparencia: '', comportamento: '', observacoes: '',
      fotoFile: null, fotoPreview: ''
    })
    setFormErrors({})
    setShowModal(true)
  }

  function openEdit(a: Animal) {
    setEditAnimal(a)
    setForm({
      nome: a.nome, raca: a.raca || '', sexo: a.sexo, porte: a.porte, status: a.status,
      castrado: (a as any).castrado || false,
      aparencia: (a as any).aparencia || '',
      comportamento: (a as any).comportamento || '',
      observacoes: (a as any).observacoes || '',
      fotoFile: null,
      fotoPreview: (a as any).foto_url || ''
    })
    setFormErrors({})
    setShowModal(true)
  }

  async function handleDelete(id: number) {
    if (confirm('Deseja excluir este animal?')) {
      await api.delete(`/animais/${id}/`)
      fetchAnimais()
    }
  }

  function validateForm() {
    const e: Record<string, string> = {}
    if (!form.nome.trim()) e.nome = 'Nome obrigatório'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validateForm()) return
    try {
      const formData = new FormData()
      formData.append('nome', form.nome)
      formData.append('raca', form.raca)
      formData.append('sexo', form.sexo)
      formData.append('porte', form.porte)
      formData.append('status', form.status)
      formData.append('castrado', String(form.castrado))
      formData.append('aparencia', form.aparencia)
      formData.append('comportamento', form.comportamento)
      formData.append('observacoes', form.observacoes)
      if (form.fotoFile) formData.append('foto', form.fotoFile)

      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (editAnimal) {
        await api.put(`/animais/${editAnimal.id}/`, formData, config)
      } else {
        await api.post('/animais/', formData, config)
      }
      setShowModal(false)
      fetchAnimais()
    } catch (err: any) {
      console.error('Erro ao salvar:', err)
      setFormErrors({ general: 'Erro ao salvar. Verifique os dados.' })
    }
  }

  const paginated = animais.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.max(1, Math.ceil(animais.length / PER_PAGE))

  const selectStyle = {
    padding: '9px 36px 9px 14px',
    border: '1.5px solid #e8edf2',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: '#4a5568',
    backgroundColor: '#fff',
    appearance: 'none' as const,
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238a9ab0' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 12px center',
    outline: 'none',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width: '260px', minWidth: '260px', backgroundColor: '#fff', borderRight: '1px solid #eef1f5', display: 'flex', flexDirection: 'column', padding: '0 0 20px' }}>
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #eef1f5' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#3dbdb0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🐾</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a2535' }}>Vira Lata</div>
            <div style={{ fontSize: '0.7rem', color: '#8a9ab0', letterSpacing: '0.05em' }}>VIRA LUXO</div>
          </div>
        </div>
        <nav style={{ padding: '20px 12px', flex: 1 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#b0bec5', letterSpacing: '0.12em', padding: '0 12px', marginBottom: '8px' }}>PELUDOS</p>
          {[
            { icon: '👤', label: 'Cadastro de Animais', active: true },
            { icon: '💊', label: 'Saúde dos animais', active: false },
            { icon: '📄', label: 'Exportação de dados', active: false },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: item.active ? '#e8f9f7' : 'transparent', color: item.active ? '#3dbdb0' : '#4a5568', fontWeight: item.active ? 600 : 400, fontSize: '0.875rem', marginBottom: '2px', borderLeft: item.active ? '3px solid #3dbdb0' : '3px solid transparent' }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#b0bec5', letterSpacing: '0.12em', padding: '16px 12px 8px', marginTop: '8px' }}>CONTROLE FINANCEIRO</p>
          {[
            { icon: '📋', label: 'Lançamento de contas' },
            { icon: '💳', label: 'Registro de pagamentos' },
            { icon: '📊', label: 'Listagem por status' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', color: '#4a5568', fontSize: '0.875rem', marginBottom: '2px', borderLeft: '3px solid transparent' }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #eef1f5', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3dbdb0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a2535' }}>Admin Vira Lata</div>
            <div style={{ fontSize: '0.72rem', color: '#8a9ab0' }}>Sair do sistema</div>
          </div>
          <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a9ab0', fontSize: '1.1rem' }}>↪</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #eef1f5', padding: '0 28px', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: '#8a9ab0' }}>
            Peludos <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#1a2535', fontWeight: 600 }}>Gestão de Peludos</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b0bec5', fontSize: '1rem' }}>⌕</span>
            <input
              placeholder="Buscar animal pelo nome..."
              value={filters.search}
              onChange={e => { setFilters({ ...filters, search: e.target.value }); setPage(1) }}
              style={{ padding: '9px 14px 9px 34px', border: '1.5px solid #e8edf2', borderRadius: '8px', fontSize: '0.85rem', width: '220px', outline: 'none', backgroundColor: '#f8fafc' }}
            />
          </div>
          <button onClick={openNew} style={{ backgroundColor: '#3dbdb0', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            + Cadastrar animal
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a9ab0', fontSize: '1.2rem' }}>🔔</button>
        </header>

        <main style={{ padding: '32px 28px', flex: 1, overflowY: 'auto' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a2535', marginBottom: '4px' }}>Gestão de Peludos</h1>
          <p style={{ color: '#8a9ab0', fontSize: '0.875rem', marginBottom: '28px' }}>Gerencie a listagem e informações de todos os animais resgatados.</p>

          {/* FILTERS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8a9ab0', letterSpacing: '0.08em', marginBottom: '4px' }}>STATUS</p>
              <select value={filters.status} onChange={e => { setFilters({ ...filters, status: e.target.value }); setPage(1) }} style={selectStyle}>
                <option value="">Todos os Status</option>
                <option value="NO_ABRIGO">No Abrigo</option>
                <option value="ADOTADO">Adotado</option>
                <option value="FALECIDO">Falecido</option>
                <option value="DESAPARECIDO">Desaparecido</option>
                <option value="LT">Lar Temporário</option>
              </select>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8a9ab0', letterSpacing: '0.08em', marginBottom: '4px' }}>PORTE</p>
              <select value={filters.porte} onChange={e => { setFilters({ ...filters, porte: e.target.value }); setPage(1) }} style={selectStyle}>
                <option value="">Todos os Portes</option>
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Médio</option>
                <option value="GRANDE">Grande</option>
              </select>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8a9ab0', letterSpacing: '0.08em', marginBottom: '4px' }}>SEXO</p>
              <select value={filters.sexo} onChange={e => { setFilters({ ...filters, sexo: e.target.value }); setPage(1) }} style={selectStyle}>
                <option value="">Todos</option>
                <option value="M">Macho</option>
                <option value="F">Fêmea</option>
              </select>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a9ab0', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', padding: '9px 0' }}>
                ⊘ Limpar
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef1f5', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eef1f5' }}>
                  {['FOTO', 'NOME', 'PORTE', 'SEXO', 'STATUS', 'AÇÕES'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#8a9ab0', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#b0bec5' }}>Carregando...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#b0bec5' }}>Nenhum animal encontrado.</td></tr>
                ) : paginated.map((animal, i) => {
                  const sc = STATUS_COLORS[animal.status] || { bg: '#f1f5f9', color: '#64748b' }
                  return (
                    <tr key={animal.id} style={{ borderBottom: i < paginated.length - 1 ? '1px solid #f5f7fa' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafbfc')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                          {(animal as any).foto_url ? <img src={(animal as any).foto_url} alt={animal.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🐾'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a2535' }}>{animal.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: '#b0bec5' }}>ID: #VL-{String(animal.id).padStart(3, '0')}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: '#4a5568' }}>{PORTE_LABELS[animal.porte] || animal.porte}</td>
                      <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: '#4a5568' }}>{SEXO_LABELS[animal.sexo] || animal.sexo}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ backgroundColor: sc.bg, color: sc.color, padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                          {STATUS_LABELS[animal.status] || animal.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button title="Visualizar" onClick={() => setViewAnimal(animal)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0bec5', fontSize: '1rem' }}
                            onMouseEnter={e => ((e.target as HTMLElement).style.color = '#3dbdb0')}
                            onMouseLeave={e => ((e.target as HTMLElement).style.color = '#b0bec5')}>👁</button>
                          <button title="Editar" onClick={() => openEdit(animal)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0bec5', fontSize: '1.1rem', lineHeight: 1, transition: 'color 0.15s' }}
                            onMouseEnter={e => ((e.target as HTMLElement).style.color = '#3dbdb0')}
                            onMouseLeave={e => ((e.target as HTMLElement).style.color = '#b0bec5')}>✎</button>
                          <button title="Excluir" onClick={() => handleDelete(animal.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0bec5', fontSize: '1rem' }}
                            onMouseEnter={e => ((e.target as HTMLElement).style.color = '#ef4444')}
                            onMouseLeave={e => ((e.target as HTMLElement).style.color = '#b0bec5')}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid #f5f7fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#8a9ab0' }}>
                Mostrando {animais.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, animais.length)} de {animais.length} peludos registrados
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: '30px', height: '30px', border: '1px solid #e8edf2', borderRadius: '6px', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: '#8a9ab0' }}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)} style={{ width: '30px', height: '30px', border: n === page ? 'none' : '1px solid #e8edf2', borderRadius: '6px', background: n === page ? '#3dbdb0' : '#fff', color: n === page ? '#fff' : '#4a5568', cursor: 'pointer', fontWeight: n === page ? 700 : 400 }}>{n}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: '30px', height: '30px', border: '1px solid #e8edf2', borderRadius: '6px', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: '#8a9ab0' }}>›</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a2535' }}>{editAnimal ? 'Editar Animal' : 'Cadastrar Animal'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#8a9ab0' }}>✕</button>
            </div>

            {formErrors.general && (
              <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '16px' }}>
                {formErrors.general}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>

              {/* Foto */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2535', display: 'block', marginBottom: '5px' }}>
                  Foto <span style={{ color: '#b0bec5', fontWeight: 400 }}>(opcional)</span>
                </label>
                <div
                  style={{ border: '1.5px dashed #e8edf2', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f8fafc' }}
                  onClick={() => document.getElementById('foto-input')?.click()}>
                  {form.fotoPreview ? (
                    <img src={form.fotoPreview} alt="Preview"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', margin: '0 auto', display: 'block' }} />
                  ) : (
                    <div>
                      <div style={{ fontSize: '1.5rem', color: '#b0bec5', marginBottom: '6px' }}>⊕</div>
                      <div style={{ fontSize: '0.8rem', color: '#b0bec5' }}>Clique para adicionar foto</div>
                    </div>
                  )}
                  <input id="foto-input" type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) setForm({ ...form, fotoFile: file, fotoPreview: URL.createObjectURL(file) })
                    }} />
                </div>
                {form.fotoPreview && (
                  <button type="button" onClick={() => setForm({ ...form, fotoFile: null, fotoPreview: '' })}
                    style={{ marginTop: '6px', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>
                    ✕ Remover foto
                  </button>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2535', display: 'block', marginBottom: '5px' }}>Nome *</label>
                <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: formErrors.nome ? '1.5px solid #ef4444' : '1.5px solid #e8edf2', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                {formErrors.nome && <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '3px' }}>{formErrors.nome}</p>}
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2535', display: 'block', marginBottom: '5px' }}>Sexo</label>
                <select value={form.sexo} onChange={e => setForm({ ...form, sexo: e.target.value })}
                  style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' as const }}>
                  <option value="M">Macho</option>
                  <option value="F">Fêmea</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2535', display: 'block', marginBottom: '5px' }}>Porte</label>
                <select value={form.porte} onChange={e => setForm({ ...form, porte: e.target.value })}
                  style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' as const }}>
                  <option value="PEQUENO">Pequeno</option>
                  <option value="MEDIO">Médio</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2535', display: 'block', marginBottom: '5px' }}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' as const }}>
                  <option value="NO_ABRIGO">No Abrigo</option>
                  <option value="ADOTADO">Adotado</option>
                  <option value="FALECIDO">Falecido</option>
                  <option value="DESAPARECIDO">Desaparecido</option>
                  <option value="LT">Lar Temporário</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2535', display: 'block', marginBottom: '8px' }}>Castrado?</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[{ label: 'Sim', value: true }, { label: 'Não', value: false }].map(opt => (
                    <button key={opt.label} type="button" onClick={() => setForm({ ...form, castrado: opt.value })}
                      style={{
                        padding: '9px 24px', borderRadius: '8px', cursor: 'pointer',
                        fontSize: '0.875rem', fontWeight: 600,
                        border: form.castrado === opt.value ? 'none' : '1.5px solid #e8edf2',
                        background: form.castrado === opt.value ? '#3dbdb0' : '#fff',
                        color: form.castrado === opt.value ? '#fff' : '#4a5568',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2535', display: 'block', marginBottom: '5px' }}>
                  Aparência <span style={{ color: '#b0bec5', fontWeight: 400 }}>(opcional)</span>
                </label>
                <textarea value={form.aparencia} onChange={e => setForm({ ...form, aparencia: e.target.value })}
                  placeholder="Descreva a aparência do animal..." rows={2}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e8edf2', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', color: '#1a2535', fontFamily: 'inherit' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2535', display: 'block', marginBottom: '5px' }}>
                  Comportamento <span style={{ color: '#b0bec5', fontWeight: 400 }}>(opcional)</span>
                </label>
                <textarea value={form.comportamento} onChange={e => setForm({ ...form, comportamento: e.target.value })}
                  placeholder="Descreva o comportamento do animal..." rows={2}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e8edf2', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', color: '#1a2535', fontFamily: 'inherit' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2535', display: 'block', marginBottom: '5px' }}>
                  Observações <span style={{ color: '#b0bec5', fontWeight: 400 }}>(opcional)</span>
                </label>
                <textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })}
                  placeholder="Alguma observação importante..." rows={2}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e8edf2', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', color: '#1a2535', fontFamily: 'inherit' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', border: '1.5px solid #e8edf2', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#4a5568' }}>Cancelar</button>
              <button onClick={handleSave} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', background: '#3dbdb0', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                {editAnimal ? 'Salvar alterações' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALHES */}
      {viewAnimal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={e => { if (e.target === e.currentTarget) setViewAnimal(null) }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a2535' }}>Detalhes do Animal</h2>
              <button onClick={() => setViewAnimal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#8a9ab0' }}>✕</button>
            </div>

            {/* Foto + Nome */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: '#e8f9f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                {(viewAnimal as any).foto_url ? <img src={(viewAnimal as any).foto_url} alt={viewAnimal.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} /> : '🐾'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a2535' }}>{viewAnimal.nome}</div>
                <div style={{ fontSize: '0.75rem', color: '#b0bec5', marginBottom: '6px' }}>ID: #VL-{String(viewAnimal.id).padStart(3, '0')}</div>
                <span style={{
                  backgroundColor: (STATUS_COLORS[viewAnimal.status] || { bg: '#f1f5f9' }).bg,
                  color: (STATUS_COLORS[viewAnimal.status] || { color: '#64748b' }).color,
                  padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                }}>
                  {STATUS_LABELS[viewAnimal.status] || viewAnimal.status}
                </span>
              </div>
            </div>



            {/* Detalhes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Sexo', value: SEXO_LABELS[viewAnimal.sexo] || viewAnimal.sexo },
                { label: 'Porte', value: PORTE_LABELS[viewAnimal.porte] || viewAnimal.porte },
                { label: 'Castrado', value: (viewAnimal as any).castrado ? 'Sim' : 'Não' },
                { label: 'Nascimento', value: (viewAnimal as any).data_nascimento || 'Não informado' },
                { label: 'Cadastrado em', value: (viewAnimal as any).criado_em ? new Date((viewAnimal as any).criado_em).toLocaleDateString('pt-BR') : '—' },
                { label: 'Atualizado em', value: (viewAnimal as any).atualizado_em ? new Date((viewAnimal as any).atualizado_em).toLocaleDateString('pt-BR') : '—' },
              ].map(item => (
                <div key={item.label} style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b0bec5', letterSpacing: '0.08em', marginBottom: '4px', textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a2535' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {(viewAnimal as any).aparencia && (
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b0bec5', letterSpacing: '0.08em', marginBottom: '6px', textTransform: 'uppercase' }}>Aparência</div>
                <div style={{ fontSize: '0.875rem', color: '#4a5568', lineHeight: '1.6' }}>{(viewAnimal as any).aparencia}</div>
              </div>
            )}

            {(viewAnimal as any).comportamento && (
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b0bec5', letterSpacing: '0.08em', marginBottom: '6px', textTransform: 'uppercase' }}>Comportamento</div>
                <div style={{ fontSize: '0.875rem', color: '#4a5568', lineHeight: '1.6' }}>{(viewAnimal as any).comportamento}</div>
              </div>
            )}

            {(viewAnimal as any).observacoes && (
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b0bec5', letterSpacing: '0.08em', marginBottom: '6px', textTransform: 'uppercase' }}>Observações</div>
                <div style={{ fontSize: '0.875rem', color: '#4a5568', lineHeight: '1.6' }}>{(viewAnimal as any).observacoes}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setViewAnimal(null)} style={{ flex: 1, padding: '12px', border: '1.5px solid #e8edf2', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#4a5568' }}>
                Fechar
              </button>
              <button onClick={() => { setViewAnimal(null); openEdit(viewAnimal) }} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', background: '#3dbdb0', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                ✏️ Editar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}