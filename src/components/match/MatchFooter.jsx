import { Star } from "lucide-react";

export default function MatchFooter({ channel }) {
  return (
    <div className="border-t border-zinc-800 mt-6 pt-4 flex justify-between items-center">

      <span className="text-zinc-400 text-sm">
        📺 {channel}
      </span>

      <button className="text-zinc-500 hover:text-lime-400 transition">
        <Star size={20} />
      </button>

    </div>
  );
}