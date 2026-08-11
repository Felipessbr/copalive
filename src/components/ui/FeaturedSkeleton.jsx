export default function FeaturedSkeleton() {
  return (
    <div className="relative h-64 overflow-hidden rounded-3xl bg-zinc-900 animate-pulse">

      <div className="absolute inset-0 bg-zinc-800" />

      <div className="absolute bottom-0 left-0 right-0 p-6">

        <div className="w-20 h-6 rounded-full bg-zinc-700 mb-4" />

        <div className="w-3/4 h-7 rounded bg-zinc-700 mb-3" />

        <div className="w-full h-4 rounded bg-zinc-700 mb-2" />

        <div className="w-2/3 h-4 rounded bg-zinc-700 mb-5" />

        <div className="w-28 h-10 rounded-full bg-zinc-700" />

      </div>

    </div>
  );
}