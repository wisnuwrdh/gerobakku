"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-full p-4 max-w-md mx-auto pt-20">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-3">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-red-800 mb-2">Gagal Memuat Dashboard</h2>
        <p className="text-sm text-red-600 mb-4">
          {error.message || "Tidak bisa mengambil data dashboard"}
        </p>
        <Button variant="danger" onClick={reset}>
          Coba Lagi
        </Button>
      </div>
    </div>
  )
}
