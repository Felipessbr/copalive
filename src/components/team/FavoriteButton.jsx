import { Star } from "lucide-react";

export default function FavoriteButton({
  favorite,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
        favorite
          ? "bg-lime-500 text-black"
          : "bg-zinc-800 text-zinc-400 hover:text-white"
      }`}
      aria-label={
        favorite
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"
      }
    >
      <Star
        size={18}
        fill={favorite ? "currentColor" : "none"}
      />
    </button>
  );
}