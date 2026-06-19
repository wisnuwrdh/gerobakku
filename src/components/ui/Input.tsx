import { forwardRef, type InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className = "", ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border border-zinc-200
            focus:outline-none focus:ring-2 focus:ring-orange-400
            placeholder:text-zinc-400 text-sm min-h-[44px]
            ${error ? "border-red-300 focus:ring-red-400" : ""}
            ${className}
          `.trim()}
          {...props}
        />
        {hint && !error && <p className="text-xs text-zinc-400 mt-1">{hint}</p>}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"
