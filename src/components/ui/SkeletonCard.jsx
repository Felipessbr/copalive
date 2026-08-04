export default function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4 animate-pulse">

      <div className="flex justify-between mb-6">
        <div className="w-28 h-4 bg-zinc-700 rounded" />
        <div className="w-16 h-6 bg-zinc-700 rounded-full" />
      </div>

      <div className="grid grid-cols-3 items-center">

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-zinc-700" />
          <div className="w-20 h-4 bg-zinc-700 rounded mt-3" />
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-8 bg-zinc-700 rounded" />
          <div className="w-12 h-4 bg-zinc-700 rounded mt-3" />
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-zinc-700" />
          <div className="w-20 h-4 bg-zinc-700 rounded mt-3" />
        </div>

      </div>

      <div className="w-full h-10 bg-zinc-700 rounded-xl mt-6" />

    </div>
  );
}