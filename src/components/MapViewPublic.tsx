"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Map } from "lucide-react"

const LazyMap = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-200 rounded-full mb-3">
          <Map className="w-8 h-8 text-zinc-400 animate-pulse" />
        </div>
        <p className="text-zinc-500 text-sm">Memuat peta...</p>
      </div>
    </div>
  ),
})

export default function MapViewPublic({ sellerId }: { sellerId: string }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-200 rounded-full mb-3">
              <Map className="w-8 h-8 text-zinc-400 animate-pulse" />
            </div>
            <p className="text-zinc-500 text-sm">Memuat peta...</p>
          </div>
        </div>
      }
    >
      <div className="w-full h-full">
        <LazyMap sellerId={sellerId} />
      </div>
    </Suspense>
  )
}
