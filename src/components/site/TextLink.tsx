import type { AnchorHTMLAttributes, ReactNode } from 'react'

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  arrow?: '↗' | '→'
}

export function TextLink({ children, arrow = '↗', className = '', ...rest }: TextLinkProps) {
  return (
    <a
      {...rest}
      className={`text-link group inline-flex min-h-10 items-center gap-2 border-b py-2 text-[14px] font-medium text-text sm:text-[15px] ${className}`}
    >
      {children}
      <span aria-hidden="true" className={`text-link-arrow inline-block ${arrow === '→' ? 'is-forward' : ''}`}>
        {arrow}
      </span>
    </a>
  )
}
