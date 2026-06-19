import { Store, MessageCircle, MapPin } from "lucide-react"
import { getActiveSeller, getLatestLocation } from "@/lib/actions"
import MapViewPublic from "@/components/MapViewPublic"
import { timeAgo } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const seller = await getActiveSeller()
  const location = seller ? await getLatestLocation(seller.id) : null

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        {seller ? (
          <MapViewPublic sellerId={seller.id} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
            <div className="text-center px-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                <Store className="w-10 h-10 text-orange-400" />
              </div>
              <h1 className="text-xl font-bold text-zinc-800 mb-2">Belum Ada Gerobak Aktif</h1>
              <p className="text-zinc-500 text-sm">
                Pedagang belum mulai jualan nih. Coba cek lagi nanti ya!
              </p>
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 z-[1000]">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg shadow-zinc-200/50 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-zinc-800 text-sm truncate">Gerobakku</h1>
              {seller ? (
                <p className="text-xs text-zinc-500 flex items-center gap-1">
                  {seller.name}
                  <span className="text-zinc-300">•</span>
                  {location ? (
                    <span className="text-emerald-600">
                      <MapPin className="w-3 h-3 inline mr-0.5" />
                      Online {timeAgo(location.created_at)}
                    </span>
                  ) : (
                    <span className="text-zinc-400">Menunggu lokasi...</span>
                  )}
                </p>
              ) : (
                <p className="text-xs text-zinc-400">Belum ada gerobak aktif</p>
              )}
            </div>
            {seller?.whatsapp && (
              <a
                href={`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
