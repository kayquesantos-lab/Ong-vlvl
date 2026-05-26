import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface PageHeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ breadcrumbs, title, description, actions }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          {breadcrumbs.map((item, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <div key={i} className="flex items-center gap-1.5">
                <span className={isLast ? 'text-ink font-semibold' : 'text-ink-faint'}>
                  {item.label}
                </span>
                {!isLast && <ChevronRight className="w-3 h-3 text-line-strong" />}
              </div>
            )
          })}
        </nav>
      )}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-ink-muted mt-1 text-sm md:text-base">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
