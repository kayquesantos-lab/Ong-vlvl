'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/card'
import { formatBRL } from '@/lib/utils'
import type { ResumoFinanceiro } from '@/lib/types'

interface Props {
  resumo: ResumoFinanceiro | null
}

const MES_PT: Record<string, string> = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
}

function formatMesLabel(mes: string) {
  const [, m] = mes.split('-')
  return MES_PT[m] ?? mes
}

export function GraficoMensal({ resumo }: Props) {
  const data = (resumo?.por_mes ?? []).map((m) => ({
    mes: formatMesLabel(m.mes),
    Pago: m.pago,
    Pendente: m.pendente,
    Vencido: m.vencido,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimentação mensal</CardTitle>
      </CardHeader>
      <CardBody className="pt-2">
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-ink-muted">
            Sem dados para exibir.
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="mes"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    fontSize: 12,
                  }}
                  formatter={(value) => formatBRL(Number(value))}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Pago" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pendente" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Vencido" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
