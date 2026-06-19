"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App error:", error)
  }, [error])

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-zinc-800 mb-2">Ada yang error nih</h2>
        <p className="text-sm text-zinc-500 mb-4">
          {error.message || "Terjadi kesalahan yang tidak terduga"}
        </p>
        <Button onClick={reset}>Coba Lagi</Button>
      </div>
    </div>
  )
}
