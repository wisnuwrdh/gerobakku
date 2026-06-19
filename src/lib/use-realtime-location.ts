"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { getSupabase } from "@/lib/supabase/client"
import type { Location } from "@/types"

export function useRealtimeLocation(sellerId: string | null) {
  const [locations, setLocations] = useState<Location[]>([])
  const [latest, setLatest] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(false)
  const mapCenterRef = useRef<[number, number] | null>(null)

  useEffect(() => {
    if (!sellerId) {
      setLoading(false)
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setError("Supabase belum dikonfigurasi")
      setLoading(false)
      return
    }

    supabase
      .from("locations")
      .select("*")
      .eq("seller_id", sellerId)
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
      .order("created_at", { ascending: true })
      .limit(500)
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message)
        } else if (data && data.length > 0) {
          setLocations(data)
          const last = data[data.length - 1]
          mapCenterRef.current = [last.latitude, last.longitude]
          setLatest(last)
        }
        setLoading(false)
      })

    const channel = supabase
      .channel(`locations-${sellerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "locations",
          filter: `seller_id=eq.${sellerId}`,
        },
        (payload) => {
          const loc = payload.new as Location
          setLocations((prev) => [...prev, loc])
          setLatest(loc)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sellerId])

  const pathPositions: [number, number][] = useMemo(
    () => locations.map((l) => [l.latitude, l.longitude]),
    [locations]
  )

  return {
    locations,
    latest,
    pathPositions,
    loading,
    error,
    mapCenter: mapCenterRef.current,
  }
}
