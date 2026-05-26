'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { AuthHero } from '@/components/auth/auth-hero'
import api from '@/lib/api'

export default function CadastroPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!form.first_name) e.first_name = 'Nome obrigatório'
    if (!form.username) e.username = 'Usuário obrigatório'
    if (!form.email) e.email = 'E-mail obrigatório'
    if (form.password.length < 6) e.password = 'Senha deve ter ao menos 6 caracteres'
    if (form.password !== form.confirm_password)
      e.confirm_password = 'Senhas não coincidem'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await api.post('/usuarios/cadastrar/', {
        username: form.username,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
      })
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2200)
    } catch (err: any) {
      const msg = err.response?.data?.erro || 'Erro ao cadastrar. Tente novamente.'
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-elevated border border-line-subtle overflow-hidden grid grid-cols-1 lg:grid-cols-2 animate-slide-up"
      style={{ animationDelay: '0.05s', animationFillMode: 'both' }}
    >
      {/* HERO (lg+) */}
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
          Crie sua <span className="text-brand-700">conta</span>
        </h1>
        <p className="text-sm text-ink-muted mb-5">
          Preencha os dados para se cadastrar no portal.
        </p>

        {success && (
          <div
            role="status"
            className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-success-50 border border-success-500/30 text-success-700 text-sm animate-slide-down"
          >
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Conta criada! Aguarde a aprovação do administrador. Redirecionando...
            </span>
          </div>
        )}

        {errors.general && (
          <div
            role="alert"
            className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-danger-50 border border-danger-500/30 text-danger-700 text-sm animate-slide-down"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 animate-wiggle" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nome"
              placeholder="João"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              error={errors.first_name}
              autoComplete="given-name"
              autoFocus
            />
            <Input
              label="Sobrenome"
              placeholder="Silva"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              autoComplete="family-name"
            />
          </div>

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Usuário"
            placeholder="joaosilva"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            error={errors.username}
            autoComplete="username"
          />

          <div className="grid grid-cols-2 gap-3">
            <PasswordInput
              label="Senha"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              autoComplete="new-password"
              showLockIcon={false}
            />
            <PasswordInput
              label="Confirmar"
              placeholder="••••••••"
              value={form.confirm_password}
              onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
              error={errors.confirm_password}
              autoComplete="new-password"
              showLockIcon={false}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="w-full group/btn"
          >
            {loading ? (
              'Cadastrando...'
            ) : (
              <>
                Criar conta
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-faint">
            <ShieldCheck className="w-3.5 h-3.5 text-success-500" />
            <span>Seus dados ficam protegidos e nunca são compartilhados</span>
          </div>
          <p className="text-center text-sm text-ink-subtle">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="text-accent-500 font-semibold hover:text-accent-600 hover:underline underline-offset-4"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
