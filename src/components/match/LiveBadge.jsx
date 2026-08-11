export default function LiveBadge({ status }) {
  if (status === "AO VIVO") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold text-red-500">
        <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
        AO VIVO
      </span>
    );
  }

  if (status === "ENCERRADO") {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-400">
        ENCERRADO
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
      PROXIMO
    </span>
  );
}