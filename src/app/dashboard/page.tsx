import { getActiveSeller, getSellerLocations } from "@/lib/actions"
import { formatTime, calculateDistance, formatDistance } from "@/lib/utils"
import { Card, CardHeader, CardTitle } from "@/components/ui/Card"
import { FileText, Route, Play, StopCircle, Inbox } from "lucide-react"

export default async function DashboardPage() {
  const seller = await getActiveSeller()
  const locations = seller ? await getSellerLocations(seller.id) : []

  let totalDistance = 0
  for (let i = 1; i < locations.length; i++) {
    totalDistance += calculateDistance(
      locations[i - 1].latitude,
      locations[i - 1].longitude,
      locations[i].latitude,
      locations[i].longitude
    )
  }

  const firstLoc = locations[0]
  const lastLoc = locations[locations.length - 1]
  const todayPoints = locations.length
  const startTime = firstLoc ? formatTime(firstLoc.created_at) : "-"
  const endTime = lastLoc ? formatTime(lastLoc.created_at) : "-"

  return (
    <div className="min-h-full p-4 max-w-md mx-auto">
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {seller ? `${seller.name}` : "Belum ada data"}
        </p>
      </div>

      {seller ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <StatCard
              icon={<FileText className="w-4 h-4" />}
              label="Data Hari Ini"
              value={`${todayPoints}`}
              sub="titik"
            />
            <StatCard
              icon={<Route className="w-4 h-4" />}
              label="Jarak Tempuh"
              value={formatDistance(totalDistance)}
              sub="hari ini"
            />
            <StatCard
              icon={<Play className="w-4 h-4" />}
              label="Mulai"
              value={startTime}
              sub="WIB"
            />
            <StatCard
              icon={<StopCircle className="w-4 h-4" />}
              label="Terakhir"
              value={endTime}
              sub="WIB"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rute Hari Ini</CardTitle>
            </CardHeader>
            {locations.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-auto">
                {locations.slice(-20).reverse().map((loc) => (
                  <div
                    key={loc.id}
                    className="flex items-center gap-3 text-xs text-zinc-500 border-b border-zinc-50 pb-2 last:border-0"
                  >
                    <span className="text-zinc-400 w-14 shrink-0">{formatTime(loc.created_at)}</span>
                    <span className="font-mono text-zinc-600">
                      {loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 text-center py-4">
                Belum ada data lokasi hari ini
              </p>
            )}
          </Card>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-100 rounded-full mb-4">
            <Inbox className="w-10 h-10 text-zinc-400" />
          </div>
          <p className="text-zinc-500">Belum ada pedagang yang aktif tracking</p>
          <p className="text-zinc-400 text-sm mt-1">Buka halaman /track untuk mulai</p>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
        {icon}
        <p className="text-xs">{label}</p>
      </div>
      <p className="text-xl font-bold text-zinc-800">{value}</p>
      <p className="text-xs text-zinc-400">{sub}</p>
    </Card>
  )
}
