"use server"

import { getServerSupabase } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Seller, Location } from "@/types"

export async function createSeller(name: string, whatsapp: string) {
  const supabase = getServerSupabase()
  if (!supabase) throw new Error("Supabase belum dikonfigurasi")
  const { data, error } = await supabase
    .from("sellers")
    .insert({ name, whatsapp: whatsapp || null, is_active: false })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Seller
}

export async function updateSellerStatus(sellerId: string, isActive: boolean) {
  const supabase = getServerSupabase()
  if (!supabase) return
  const { error } = await supabase
    .from("sellers")
    .update({ is_active: isActive })
    .eq("id", sellerId)

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard")
}

export async function insertLocation(
  sellerId: string,
  latitude: number,
  longitude: number,
  speed: number | null,
  accuracy: number | null
) {
  const supabase = getServerSupabase()
  if (!supabase) return
  const { error } = await supabase
    .from("locations")
    .insert({
      seller_id: sellerId,
      latitude,
      longitude,
      speed,
      accuracy,
    })

  if (error) throw new Error(error.message)
}

export async function getSeller(sellerId: string): Promise<Seller | null> {
  const supabase = getServerSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", sellerId)
    .single()

  if (error || !data) return null
  return data as Seller
}

export async function getLatestSeller(): Promise<Seller | null> {
  const supabase = getServerSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return data as Seller
}

export async function getActiveSeller(): Promise<Seller | null> {
  const supabase = getServerSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return data as Seller
}

export async function getSellerLocations(
  sellerId: string,
  limit = 500
): Promise<Location[]> {
  const supabase = getServerSupabase()
  if (!supabase) return []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("seller_id", sellerId)
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: true })
    .limit(limit)

  if (error) return []
  return (data as Location[]) || []
}

export async function getLatestLocation(
  sellerId: string
): Promise<Location | null> {
  const supabase = getServerSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return data as Location
}
