"use client"

import { create } from "zustand"
import type { TrackState } from "@/types"

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
