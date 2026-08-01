export default function LiveBadge({ status }) {
    const isLive = status === 'AO VIVO'
    return (

         <span
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
        isLive
          ? "bg-red-600 text-white"
          : "bg-zinc-700 text-zinc-300"
      }`}
    >
      {isLive && (
        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
      )}

      {status}
    </span>

    )
}
