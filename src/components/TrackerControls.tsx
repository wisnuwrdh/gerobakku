"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Circle, MapPin, Play, Square, Loader2 } from "lucide-react"
import { useTrackerStore, getStoredSeller, clearStoredSeller } from "@/lib/store"
import { insertLocation, updateSellerStatus, getSeller } from "@/lib/actions"
import { calculateDistance } from "@/lib/utils"
import { SellerForm } from "./SellerForm"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

export function TrackerControls() {
  const { isTracking, sellerId, sellerName, startTracking, stopTracking, setSellerInfo } =
    useTrackerStore()
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [restoringSession, setRestoringSession] = useState(true)
  const watchIdRef = useRef<number | null>(null)
  const lastSentRef = useRef(0)

  useEffect(() => {
    const stored = getStoredSeller()
    if (!stored) {
      setRestoringSession(false)
      return
    }

    getSeller(stored.id).then((seller) => {
      if (seller) {
        setSellerInfo(seller.id, seller.name, seller.whatsapp || "")
      } else {
        clearStoredSeller()
      }
      setRestoringSession(false)
    }).catch(() => {
      setRestoringSession(false)
    })
  }, [setSellerInfo])

  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null)

  const sendLocation = useCallback(
    async (lat: number, lng: number, speed: number | null, accuracy: number | null) => {
      if (!sellerId) return
      if (accuracy != null && accuracy > 50) return

      const now = Date.now()
      if (now - lastSentRef.current < 4000) return

      if (lastCoordsRef.current) {
        const dist = calculateDistance(lastCoordsRef.current.lat, lastCoordsRef.current.lng, lat, lng)
        if (dist < 0.005) return
      }

      lastSentRef.current = now
      lastCoordsRef.current = { lat, lng }

      try {
        await insertLocation(sellerId, lat, lng, speed, accuracy)
        setStatus(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      } catch (e) {
        console.error("Gagal kirim lokasi:", e)
        setError("Gagal mengirim lokasi")
      }
    },
    [sellerId]
  )

  useEffect(() => {
    if (!isTracking || !sellerId) return

    if (!navigator.geolocation) {
      setError("GPS tidak didukung di HP ini")
      return
    }

    updateSellerStatus(sellerId, true).catch(() => {})

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        sendLocation(
          pos.coords.latitude,
          pos.coords.longitude,
          pos.coords.speed,
          pos.coords.accuracy
        )
      },
      (err) => {
        setError(`GPS error: ${err.message}`)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [isTracking, sellerId, sendLocation])

  const handleStop = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    stopTracking()
    if (sellerId) {
      await updateSellerStatus(sellerId, false)
    }
    setStatus("Berhenti tracking")
  }

  if (restoringSession) {
    return (
      <Card className="p-6 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
        <span className="text-sm text-zinc-500">Memulihkan sesi...</span>
      </Card>
    )
  }

  if (!sellerId) {
    return <SellerForm onRegister={setSellerInfo} />
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Circle
          className={`w-3 h-3 ${isTracking ? "fill-green-500 stroke-green-500 animate-pulse" : "fill-zinc-300 stroke-zinc-300"}`}
        />
        <span className="font-semibold text-zinc-800">
          {isTracking ? "Tracking aktif" : "Tracking nonaktif"}
        </span>
      </div>

      {sellerName && (
        <p className="text-sm text-zinc-500">
          Pedagang: <span className="font-medium text-zinc-700">{sellerName}</span>
        </p>
      )}

      {status && (
        <p className="text-xs text-zinc-400 font-mono bg-zinc-50 rounded-lg p-2">
          <MapPin className="w-3 h-3 inline mr-1" />
          {status}
        </p>
      )}
      {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">{error}</p>}

      <div className="flex gap-2">
        {!isTracking ? (
          <Button icon={<Play className="w-4 h-4" />} className="flex-1" onClick={startTracking}>
            Mulai Jualan
          </Button>
        ) : (
          <Button icon={<Square className="w-4 h-4" />} className="flex-1" variant="secondary" onClick={handleStop}>
            Selesai Jualan
          </Button>
        )}
      </div>
    </Card>
  )
}
