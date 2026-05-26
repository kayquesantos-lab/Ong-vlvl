import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />
}

interface TableSkeletonProps {
  rows?: number
  columns?: Array<'avatar' | 'text' | 'badge' | 'actions' | 'short' | 'value'>
}

const DEFAULT_COLUMNS: TableSkeletonProps['columns'] = [
  'avatar',
  'text',
  'short',
  'short',
  'badge',
  'actions',
]

export function TableSkeleton({ rows = 6, columns = DEFAULT_COLUMNS }: TableSkeletonProps) {
  return (
    <tbody className="divide-y divide-line-subtle">
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
          {columns!.map((kind, j) => (
            <td key={j} className="px-6 py-3.5">
              {kind === 'avatar' && <Skeleton className="w-10 h-10 rounded-lg" />}
              {kind === 'text' && (
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              )}
              {kind === 'short' && <Skeleton className="h-3.5 w-16" />}
              {kind === 'value' && <Skeleton className="h-3.5 w-20" />}
              {kind === 'badge' && <Skeleton className="h-5 w-20 rounded-full" />}
              {kind === 'actions' && (
                <div className="flex justify-end gap-1">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export function StatSkeleton() {
  return (
    <div className="bg-white rounded-card border border-line shadow-card flex items-center gap-4 p-5">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  )
}
