import Link from "next/link"
import { SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-100 rounded-full mb-4">
          <SearchX className="w-10 h-10 text-zinc-400" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-800 mb-2">404</h1>
        <p className="text-zinc-500 mb-6">Halaman gak ketemu nih</p>
        <Link
          href="/"
          className="inline-block bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-600 transition-all"
        >
          Ke Halaman Utama
        </Link>
      </div>
    </div>
  )
}
