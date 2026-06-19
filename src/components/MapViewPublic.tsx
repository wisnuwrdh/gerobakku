"use client"

import dynamic from "next/dynamic"
import { Map } from "lucide-react"

const LazyMap = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 rounded-full mb-3">
          <Map className="w-8 h-8 text-zinc-300 animate-pulse" />
        </div>
        <p className="text-zinc-400 text-sm">Memuat peta...</p>
      </div>
    </div>
  ),
})

export default function MapViewPublic({
  sellerId,
  sellerName,
}: {
  sellerId: string
  sellerName: string
}) {
  return <LazyMap sellerId={sellerId} sellerName={sellerName} />
}
