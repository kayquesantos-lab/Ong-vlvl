// ─── Animais ──────────────────────────────────────────────────────────────────

export type Sexo = 'M' | 'F'
export type Porte = 'PEQUENO' | 'MEDIO' | 'GRANDE'
export type StatusAnimal = 'NO_ABRIGO' | 'ADOTADO' | 'FALECIDO' | 'DESAPARECIDO' | 'LT'

export interface Animal {
  id: number
  nome: string
  sexo: Sexo | null
  porte: Porte | null
  data_nascimento: string | null
  castrado: boolean
  status: StatusAnimal
  observacoes: string
  aparencia: string
  comportamento: string
  foto: string | null
  foto_url: string | null
  criado_em: string
  atualizado_em: string
}

export const SEXO_LABEL: Record<Sexo, string> = {
  M: 'Macho',
  F: 'Fêmea',
}

export const PORTE_LABEL: Record<Porte, string> = {
  PEQUENO: 'Pequeno',
  MEDIO: 'Médio',
  GRANDE: 'Grande',
}

export const STATUS_ANIMAL_LABEL: Record<StatusAnimal, string> = {
  NO_ABRIGO: 'No Abrigo',
  ADOTADO: 'Adotado',
  FALECIDO: 'Falecido',
  DESAPARECIDO: 'Desaparecido',
  LT: 'Lar Temporário',
}


// ─── Saude ────────────────────────────────────────────────────────────────────

export type TipoSaude = 'ANTIRABICA' | 'V10' | 'OUTRA_VACINA' | 'VERMIFUGO' | 'CARRAPATICIDA'
export type StatusDose = 'APLICADO' | 'EM_DIA' | 'VENCENDO' | 'VENCIDA' | 'SEM_RECORRENCIA'

export interface RegistroSaude {
  id: number
  animal: number
  animal_nome: string
  tipo: TipoSaude
  tipo_display: string
  nome_produto: string
  data_aplicacao: string
  proxima_dose: string | null
  observacoes: string
  status_dose: StatusDose
  criado_em: string
}

export interface AlertaSaude {
  animal_id: number
  animal_nome: string
  animal_foto_url: string | null
  tipo: TipoSaude
  tipo_display: string
  proxima_dose: string
  status: 'VENCIDA' | 'VENCENDO'
  dias_restantes: number
}

export const TIPO_SAUDE_LABEL: Record<TipoSaude, string> = {
  ANTIRABICA: 'Vacina Antirrábica',
  V10: 'Vacina V10',
  OUTRA_VACINA: 'Outra Vacina',
  VERMIFUGO: 'Vermífugo',
  CARRAPATICIDA: 'Carrapaticida',
}


// ─── Financeiro ───────────────────────────────────────────────────────────────

export type CategoriaConta =
  | 'ALIMENTACAO'
  | 'VETERINARIO'
  | 'MEDICAMENTO'
  | 'HIGIENE'
  | 'INFRAESTRUTURA'
  | 'TRANSPORTE'
  | 'OUTROS'

export type StatusConta = 'PENDENTE' | 'PAGO' | 'VENCIDO'

export interface Conta {
  id: number
  descricao: string
  fornecedor: string
  categoria: CategoriaConta
  categoria_display: string
  valor: string
  vencimento: string
  status: StatusConta
  status_display: string
  observacoes: string
  pagamento: Pagamento | null
  dias_vencimento: number
  criado_em: string
  atualizado_em: string
}

export interface Pagamento {
  id: number
  conta: number
  data_pagamento: string
  valor_pago: string
  observacoes: string
  criado_em: string
}

export interface ResumoFinanceiro {
  total_pago: number
  total_pendente: number
  total_vencido: number
  qtd_vencidas: number
  por_mes: Array<{ mes: string; pago: number; pendente: number; vencido: number }>
}

export const CATEGORIA_LABEL: Record<CategoriaConta, string> = {
  ALIMENTACAO: 'Alimentação',
  VETERINARIO: 'Veterinário',
  MEDICAMENTO: 'Medicamento',
  HIGIENE: 'Higiene',
  INFRAESTRUTURA: 'Infraestrutura',
  TRANSPORTE: 'Transporte',
  OUTROS: 'Outros',
}

export const STATUS_CONTA_LABEL: Record<StatusConta, string> = {
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
  VENCIDO: 'Vencido',
}


// ─── Paginacao DRF ────────────────────────────────────────────────────────────

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
