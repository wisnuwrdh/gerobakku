import type { ReactNode } from "react"

type BadgeVariant = "success" | "warning" | "danger" | "default"

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  default: "bg-zinc-100 text-zinc-600",
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
        text-xs font-medium ${variantStyles[variant]} ${className}
      `.trim()}
    >
      {children}
    </span>
  )
}
