"use client"

import { useState } from "react"
import { Store } from "lucide-react"
import { createSeller } from "@/lib/actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle } from "@/components/ui/Card"

interface Props {
  onRegister: (id: string, name: string, whatsapp: string) => void
}

export function SellerForm({ onRegister }: Props) {
  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const seller = await createSeller(name.trim(), whatsapp.trim())
      onRegister(seller.id, seller.name, seller.whatsapp || "")
    } catch (e: any) {
      setError(e.message || "Gagal mendaftar, coba lagi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-2">
            <Store className="w-6 h-6 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-800">Daftar Gerobak</h2>
          <p className="text-sm text-zinc-500 mt-1">Isi data biar pembeli bisa nemuin kamu</p>
        </div>

        <Input
          label="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Misal: Bang Udin"
          required
        />

        <Input
          label="Nomor WhatsApp (opsional)"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="08123456789"
          hint="Pembeli bisa langsung hubungi kamu via WA"
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Mendaftarkan..." : "Daftar"}
        </Button>
      </Card>
    </form>
  )
}
