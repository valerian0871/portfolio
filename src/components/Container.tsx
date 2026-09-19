import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** One container width for the whole site, so nothing drifts between sections. */
export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1120px] px-6 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  )
}