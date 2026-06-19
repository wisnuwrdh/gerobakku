import { Store, HelpCircle, Smartphone } from "lucide-react"
import { TrackerControls } from "@/components/TrackerControls"
import { Card } from "@/components/ui/Card"

export default function TrackPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pt-12 pb-6 bg-gradient-to-b from-orange-500 to-orange-400 text-white text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-2">
          <Store className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Gerobakku</h1>
        <p className="text-orange-100 text-sm mt-1">Tracking lokasi gerobak</p>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <TrackerControls />

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <h3 className="font-semibold text-zinc-700 text-sm">Cara Pakai</h3>
          </div>
          <ol className="text-sm text-zinc-500 space-y-2 list-decimal list-inside">
            <li>Daftar dengan nama & nomor WA kamu</li>
            <li>Izinkan akses GPS saat diminta browser</li>
            <li>Tekan <strong>Mulai Jualan</strong> untuk mulai tracking</li>
            <li>Biarkan HP menyala & jangan tutup browser</li>
            <li>Tekan <strong>Selesai Jualan</strong> kalau udah beres</li>
          </ol>
        </Card>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="w-4 h-4 text-amber-600" />
            <p className="text-xs text-amber-700 font-medium">Tips</p>
          </div>
          <p className="text-xs text-amber-600">
            Tambahin halaman ini ke Home Screen HP biar gampang aksesnya.
            Buka di Chrome/Safari → klik menu → <strong>&quot;Add to Home Screen&quot;</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
