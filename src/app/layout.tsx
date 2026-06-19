import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gerobakku — Lacak Gerobak Keliling",
  description: "Lacak lokasi gerobak keliling favoritmu secara realtime",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Gerobakku",
    statusBarStyle: "black-translucent",
  },
}

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${geist.variable} h-full`}>
      <body className="h-full antialiased font-sans bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  )
}
