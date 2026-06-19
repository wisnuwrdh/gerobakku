import type { ReactNode, HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: boolean
}

export function Card({ children, padding = true, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-zinc-100
        ${padding ? "p-4" : ""}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mb-3 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`font-semibold text-zinc-700 text-sm ${className}`}>{children}</h3>
}
