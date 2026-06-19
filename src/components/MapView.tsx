"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import { Store, Lock, Unlock, MapPin } from "lucide-react"
import { useRealtimeLocation } from "@/lib/use-realtime-location"
import { formatTime, timeAgo, calculateDistance, formatDistance, formatDuration } from "@/lib/utils"
import type { Location } from "@/types"

import "leaflet/dist/leaflet.css"

const cartIcon = L.divIcon({
  html: `<div style="background:#F97316;border-radius:50%;padding:6px;box-shadow:0 0 16px rgba(249,115,22,0.5), 0 0 4px rgba(249,115,22,0.3);border:3px solid white;display:flex;align-items:center;justify-content:center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg></div>`,
  className: "",
  iconSize: [44, 44],
  iconAnchor: [22, 40],
  popupAnchor: [0, -40],
})

const startIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;background:#A1A1AA;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg></div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -14],
})

function RouteStats({
  locations,
  latest,
  sellerName,
}: {
  locations: Location[]
  latest: Location | null
  sellerName: string
}) {
  let totalDistance = 0
  for (let i = 1; i < locations.length; i++) {
    totalDistance += calculateDistance(
      locations[i - 1].latitude,
      locations[i - 1].longitude,
      locations[i].latitude,
      locations[i].longitude
    )
  }

  const firstTime =
    locations.length > 0
      ? formatTime(locations[0].created_at)
      : "--:--"
  const lastTime = latest ? formatTime(latest.created_at) : "--:--"
  const duration =
    locations.length > 1
      ? new Date(locations[locations.length - 1].created_at).getTime() -
        new Date(locations[0].created_at).getTime()
      : 0
  const avgSpeed =
    duration > 0 && totalDistance > 0
      ? (totalDistance * 1000) / (duration / 1000)
      : null

  return (
    <div className="absolute top-0 left-0 right-0 z-[2000] pointer-events-none">
      <div className="mx-3 mt-3 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg shadow-zinc-200/50 px-4 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-zinc-800 text-xs truncate">{sellerName}</p>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    {latest ? `Online ${timeAgo(latest.created_at)}` : "Menunggu lokasi"}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                <span>{formatDistance(totalDistance)}</span>
                <span>{formatDuration(duration)}</span>
                <span className="text-zinc-300 hidden sm:inline">
                  {avgSpeed != null ? `${avgSpeed.toFixed(1)} m/s` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FollowToggle({
  following,
  onToggle,
}: {
  following: boolean
  onToggle: () => void
}) {
  return (
    <div className="absolute bottom-0 right-0 z-[2000] pointer-events-none">
      <div className="m-3 pointer-events-auto">
        <button
          onClick={onToggle}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
            transition-all duration-200 shadow-lg
            ${
              following
                ? "bg-orange-500 text-white shadow-orange-200"
                : "bg-white/90 backdrop-blur text-zinc-600 shadow-zinc-200"
            }
          `}
        >
          {following ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          {following ? "Follow" : "Free"}
        </button>
      </div>
    </div>
  )
}

function MapContent({
  sellerId,
  sellerName,
}: {
  sellerId: string
  sellerName: string
}) {
  const { latest, pathPositions, locations, loading, error, mapCenter } =
    useRealtimeLocation(sellerId)
  const map = useMap()
  const centeredRef = useRef(false)
  const [following, setFollowing] = useState(true)

  useEffect(() => {
    if (!centeredRef.current && mapCenter) {
      map.setView(mapCenter, 16)
      centeredRef.current = true
    }
  }, [mapCenter, map])

  useEffect(() => {
    if (following && latest) {
      map.setView([latest.latitude, latest.longitude], map.getZoom(), { animate: true, duration: 0.6 })
    }
  }, [latest, following, map])

  const displayPosition = latest
    ? ([latest.latitude, latest.longitude] as [number, number])
    : pathPositions.length > 0
    ? pathPositions[pathPositions.length - 1]
    : null

  const startPosition =
    pathPositions.length > 0 ? pathPositions[0] : null

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {pathPositions.length > 1 && (
        <>
          <Polyline
            positions={pathPositions}
            color="#F97316"
            weight={8}
            opacity={0.08}
            lineCap="round"
            lineJoin="round"
          />
          <Polyline
            positions={pathPositions}
            color="#F97316"
            weight={4}
            opacity={0.7}
            lineCap="round"
            lineJoin="round"
          />
        </>
      )}

      {startPosition && (
        <Marker position={startPosition} icon={startIcon}>
          <Popup>
            <span className="text-xs font-medium text-zinc-500">Mulai</span>
          </Popup>
        </Marker>
      )}

      {displayPosition && (
        <Marker position={displayPosition} icon={cartIcon}>
          <Popup>
            <div className="text-sm font-medium min-w-[120px]">
              {latest ? (
                <>
                  <p className="text-orange-600 mb-1">Sekarang</p>
                  <p className="text-zinc-500 text-xs">
                    Jam {formatTime(latest.created_at)}
                  </p>
                  {latest.speed != null && (
                    <p className="text-zinc-400 text-xs">
                      {latest.speed.toFixed(1)} m/s
                    </p>
                  )}
                </>
              ) : (
                <p className="text-zinc-500">Posisi terakhir</p>
              )}
            </div>
          </Popup>
        </Marker>
      )}

      <RouteStats locations={locations} latest={latest} sellerName={sellerName} />
      <FollowToggle following={following} onToggle={() => setFollowing((f) => !f)} />
    </>
  )
}

export default function MapView({
  sellerId,
  sellerName,
}: {
  sellerId: string
  sellerName: string
}) {
  return (
    <div className="w-full h-full relative">
      <style jsx global>{`
        .leaflet-container {
          background: #fafafa !important;
          outline: 0 !important;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
      `}</style>
      <MapContainer
        center={[-6.2088, 106.8456]}
        zoom={16}
        className="w-full h-full rounded-lg"
        zoomControl={false}
        attributionControl={false}
        dragging={true}
        scrollWheelZoom={true}
      >
        <MapContent sellerId={sellerId} sellerName={sellerName} />
      </MapContainer>
    </div>
  )
}
