export interface Seller {
  id: string
  name: string
  phone: string | null
  whatsapp: string | null
  is_active: boolean
  created_at: string
}

export interface Location {
  id: string
  seller_id: string
  latitude: number
  longitude: number
  speed: number | null
  accuracy: number | null
  created_at: string
}

export interface TrackState {
  isTracking: boolean
  sellerId: string | null
  sellerName: string
  whatsapp: string
  currentPosition: [number, number] | null
  startTracking: () => void
  stopTracking: () => void
  setSellerInfo: (id: string, name: string, whatsapp: string) => void
}
