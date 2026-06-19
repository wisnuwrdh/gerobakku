"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import { useRealtimeLocation } from "@/lib/use-realtime-location"
import { formatTime, timeAgo } from "@/lib/utils"

const cartIcon = L.divIcon({
  html: createMarkerHTML("#F97316", "cart"),
  className: "",
  iconSize: [44, 44],
  iconAnchor: [22, 40],
  popupAnchor: [0, -40],
})

function createMarkerHTML(color: string, type: "cart" | "user") {
  const size = type === "cart" ? 32 : 16
  const padding = type === "cart" ? 6 : 4
  const border = type === "cart" ? 3 : 2
  return `<div style="background:${color};border-radius:50%;padding:${padding}px;box-shadow:0 2px 12px ${color}40;border:${border}px solid white"><div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center">${getIconSVG(type)}</div></div>`
}

function getIconSVG(type: "cart" | "user") {
  if (type === "cart") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"/></svg>`
}

function MapContent({ sellerId }: { sellerId: string }) {
  const { latest, pathPositions, loading, error, mapCenter } = useRealtimeLocation(sellerId)
  const map = useMap()
  const centeredRef = useRef(false)

  useEffect(() => {
    if (!centeredRef.current && mapCenter) {
      map.setView(mapCenter, 16)
      centeredRef.current = true
    }
  }, [mapCenter, map])

  useEffect(() => {
    if (latest) {
      map.setView([latest.latitude, latest.longitude], map.getZoom(), { animate: true })
    }
  }, [latest, map])

  const displayPosition = latest
    ? ([latest.latitude, latest.longitude] as [number, number])
    : pathPositions.length > 0
    ? pathPositions[pathPositions.length - 1]
    : null

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pathPositions.length > 1 && (
        <Polyline positions={pathPositions} color="#F97316" weight={4} opacity={0.5} />
      )}
      {displayPosition && (
        <Marker position={displayPosition} icon={cartIcon}>
          <Popup>
            <div className="text-sm font-medium min-w-[160px]">
              {latest ? (
                <>
                  <p className="text-orange-600 mb-1">
                    Terakhir: {timeAgo(latest.created_at)}
                  </p>
                  <p className="text-zinc-500 text-xs">Jam {formatTime(latest.created_at)}</p>
                  {latest.speed != null && (
                    <p className="text-zinc-500 text-xs">
                      Kecepatan {latest.speed.toFixed(1)} m/s
                    </p>
                  )}
                </>
              ) : (
                <p className="text-zinc-500">Riwayat posisi hari ini</p>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </>
  )
}

export default function MapView({ sellerId }: { sellerId: string }) {
  return (
    <MapContainer
      center={[-6.2088, 106.8456]}
      zoom={15}
      className="w-full h-full"
      zoomControl={false}
    >
      <MapContent sellerId={sellerId} />
    </MapContainer>
  )
}
