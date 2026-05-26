'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  User,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Switch } from '@/components/ui/switch'
import { AuthHero } from '@/components/auth/auth-hero'
import { login } from '@/lib/auth'

function getSaudacao() {
  const h = new Date().getHours()
  if (h < 5) return 'Boa madrugada'
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '', remember: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saudacao, setSaudacao] = useState('Bem-vindo(a)')

  useEffect(() => {
    setSaudacao(getSaudacao())
  }, [])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.username) e.username = 'Usuário obrigatório'
    if (form.password.length < 6) e.password = 'Senha deve ter ao menos 6 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.username, form.password)
      router.push('/animais')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao entrar.'
      setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-elevated border border-line-subtle overflow-hidden grid grid-cols-1 lg:grid-cols-2 animate-slide-up"
      style={{ animationDelay: '0.05s', animationFillMode: 'both' }}
    >
      {/* HERO (visível apenas em lg+) */}
      <div className="hidden lg:block p-2">
        <AuthHero />
      </div>

      {/* FORM */}
      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
        {/* Logo compacta — só em mobile/tablet */}
        <div className="lg:hidden flex items-center gap-3 mb-5">
          <div className="relative w-12 h-12 rounded-xl bg-white shadow-card p-1.5 ring-1 ring-line-subtle">
            <Image
              src="/logo.png"
              alt="Vira Lata Vira Luxo"
              width={48}
              height={48}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">
              Portal Institucional
            </p>
            <p className="text-sm font-extrabold text-ink leading-tight">
              Vira Lata Vira Luxo
            </p>
          </div>
        </div>

        <h1 className="text-xl lg:text-2xl font-extrabold text-ink mb-1">
          {saudacao}, <span className="text-brand-700">amigo</span>!
        </h1>
        <p className="text-sm text-ink-muted mb-6">
          Entre com seus dados para acessar o portal.
        </p>

        {errors.general && (
          <div
            role="alert"
            className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-danger-50 border border-danger-500/30 text-danger-700 text-sm animate-slide-down"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 animate-wiggle" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <Input
            label="Usuário"
            placeholder="Digite seu usuário"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            error={errors.username}
            icon={<User className="w-4 h-4" />}
            autoComplete="username"
            autoFocus
          />

          <PasswordInput
            label="Senha"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between text-sm">
            <Switch
              checked={form.remember}
              onChange={(v) => setForm({ ...form, remember: v })}
              label="Lembrar de mim"
            />
            <a
              href="#"
              className="text-accent-500 font-semibold hover:text-accent-600 hover:underline underline-offset-4"
            >
              Esqueceu a senha?
            </a>
          </div>

          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="w-full group/btn"
          >
            {loading ? (
              'Entrando...'
            ) : (
              <>
                Entrar no Portal
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </>
            )}
          </Button>
        </form>

        {/* Trust + footer agrupados */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-faint">
            <ShieldCheck className="w-3.5 h-3.5 text-success-500" />
            <span>Conexão segura · seus dados estão protegidos</span>
          </div>
          <p className="text-center text-sm text-ink-subtle">
            Ainda não faz parte?{' '}
            <Link
              href="/cadastro"
              className="text-accent-500 font-semibold hover:text-accent-600 hover:underline underline-offset-4"
            >
              Crie sua conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
