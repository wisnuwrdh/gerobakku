"use client"

import { create } from "zustand"
import type { TrackState } from "@/types"

const STORAGE_KEY = "gerobakku-seller"

export function getStoredSeller() {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.id && parsed?.name) return parsed as { id: string; name: string; whatsapp: string }
    return null
  } catch {
    return null
  }
}

export function setStoredSeller(id: string, name: string, whatsapp: string) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, name, whatsapp }))
  } catch {}
}

export function clearStoredSeller() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export const useTrackerStore = create<TrackState>((set) => ({
  isTracking: false,
  sellerId: null,
  sellerName: "",
  whatsapp: "",
  currentPosition: null,

  startTracking: () => set({ isTracking: true }),
  stopTracking: () => set({ isTracking: false }),

  setSellerInfo: (id, name, whatsapp) =>
    set({ sellerId: id, sellerName: name, whatsapp }),
}))
