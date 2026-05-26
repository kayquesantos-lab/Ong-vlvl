import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand — verde-agua (mantem identidade do logo)
        brand: {
          50:  '#E6F8F8',
          100: '#CFF1F2',
          200: '#A5E3E5',
          300: '#74D2D5',
          400: '#4FC4C6',
          500: '#40BFC1', // primary
          600: '#2FA8AA',
          700: '#258588',
          800: '#1E696B',
          900: '#184F51',
        },
        // Accent — terracota/laranja quente (acolhedor)
        accent: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F59E0B', // CTA secundario
          600: '#EA580C',
          700: '#C2410C',
        },
        // Surface neutras
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          subtle: '#F1F5F9',
        },
        // Borda / texto
        line: {
          DEFAULT: '#E2E8F0',
          subtle: '#F1F5F9',
          strong: '#CBD5E1',
        },
        ink: {
          DEFAULT: '#0F172A',
          subtle: '#334155',
          muted: '#64748B',
          faint: '#94A3B8',
        },
        // Status semantico
        success: { 50: '#ECFDF5', 500: '#10B981', 700: '#047857' },
        warning: { 50: '#FFFBEB', 500: '#F59E0B', 700: '#B45309' },
        danger:  { 50: '#FEF2F2', 500: '#EF4444', 700: '#B91C1C' },
        info:    { 50: '#EFF6FF', 500: '#3B82F6', 700: '#1D4ED8' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
        elevated: '0 10px 30px -10px rgba(15, 23, 42, 0.15)',
        modal: '0 20px 60px rgba(15, 23, 42, 0.18)',
      },
      borderRadius: {
        card: '12px',
        modal: '16px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pop: {
          '0%':   { opacity: '0', transform: 'scale(0.7)' },
          '60%':  { opacity: '1', transform: 'scale(1.08)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(-8deg)' },
          '75%':      { transform: 'rotate(8deg)' },
        },
      },
      animation: {
        'fade-in':    'fade-in 250ms ease-out',
        'slide-up':   'slide-up 400ms cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-down': 'slide-down 250ms ease-out',
        'scale-in':   'scale-in 250ms cubic-bezier(0.22, 1, 0.36, 1)',
        pop:          'pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        wiggle:       'wiggle 400ms ease-in-out',
      },
      backgroundImage: {
        'gradient-soft':
          'linear-gradient(135deg, #E6F8F8 0%, #F8FAFC 50%, #FFF7ED 100%)',
      },
      backgroundSize: {
        '300': '300% 300%',
      },
    },
  },
  plugins: [],
}

export default config
