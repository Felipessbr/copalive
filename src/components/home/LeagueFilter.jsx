import { X } from "lucide-react";

const leagues = [
    { id: 71, name: "Brasileirão" },
    { id: 39, name: "Premier League" },
    { id: 140, name: "La Liga" },
    { id: 135, name: "Serie A" },
    { id: 78, name: "Bundesliga" },
    { id: 2, name: "Champions League" },
    { id: 13, name: "Libertadores" },
];

export default function LeagueFilter({
    selectedLeague,
    onLeagueChange,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-[100]">

            {/* Fundo */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Painel */}
            <div
                className="
           absolute
      bottom-0
      left-0
      right-0
      z-[101]
      max-h-[80vh]
      overflow-y-auto
      overscroll-contain
      touch-pan-y
      rounded-t-3xl
      bg-zinc-900
      p-5
        "
                onClick={(e) => e.stopPropagation()}
            >

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Filtrar partidas
                        </h2>

                        <p className="text-sm text-zinc-400 mt-1">
                            Escolha uma competição
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-zinc-800
              text-zinc-400
              hover:text-white
            "
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Ligas */}
                <div className="flex flex-col gap-2">

                    {leagues.map((league) => (
                        <button
                            key={league.id}
                            onClick={() => onLeagueChange(league.id)}
                            className={`
                w-full
                rounded-xl
                px-4
                py-3
                text-left
                transition

                ${selectedLeague === league.id
                                    ? "bg-lime-500 text-black font-semibold"
                                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                                }
              `}
                        >
                            {league.name}
                        </button>
                    ))}

                </div>

            </div>

        </div>
    );
}