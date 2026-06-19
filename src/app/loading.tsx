export default function Loading() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-zinc-500 mt-3 text-sm">Memuat...</p>
      </div>
    </div>
  )
}
