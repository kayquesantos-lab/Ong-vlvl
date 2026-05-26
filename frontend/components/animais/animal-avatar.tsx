import Image from 'next/image'
import { PawPrint } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Animal } from '@/lib/types'

interface Props {
  animal: Pick<Animal, 'nome' | 'foto_url'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-10 h-10 rounded-lg',
  md: 'w-12 h-12 rounded-lg',
  lg: 'w-16 h-16 rounded-xl',
}

const iconSizeMap = {
  sm: 'w-5 h-5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

export function AnimalAvatar({ animal, size = 'md', className }: Props) {
  const klass = cn(
    'overflow-hidden border border-line bg-brand-50 flex items-center justify-center text-brand-500 shrink-0',
    sizeMap[size],
    className,
  )

  if (animal.foto_url) {
    return (
      <div className={klass}>
        <Image
          src={animal.foto_url}
          alt={animal.nome}
          width={64}
          height={64}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    )
  }

  return (
    <div className={klass}>
      <PawPrint className={iconSizeMap[size]} />
    </div>
  )
}
