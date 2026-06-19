export type Database = {
  public: {
    Tables: {
      sellers: {
        Row: {
          id: string
          name: string
          phone: string | null
          whatsapp: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          whatsapp?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          whatsapp?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          id: string
          seller_id: string
          latitude: number
          longitude: number
          speed: number | null
          accuracy: number | null
          created_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          latitude: number
          longitude: number
          speed?: number | null
          accuracy?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          accuracy?: number | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
  }
}

export type Tables = Database["public"]["Tables"]
export type Seller = Tables["sellers"]["Row"]
export type Location = Tables["locations"]["Row"]
