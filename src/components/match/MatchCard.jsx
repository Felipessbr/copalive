import { Star } from "lucide-react";

export default function MatchCard({
    competition,
    home,
    away,
    homeLogo,
    awayLogo,
    homeScore,
    awayScore,
    minute,
    status,
    channel,
}) {
    const live = status === "AO VIVO";

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4 shadow-md">

            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                    {competition}
                </span>

                <span
                    className={`flex items-center text-xs gap-2 px-3 py-1 rounded-full font-bold ${live
                        ? "bg-red-600 text-white"
                        : "bg-zinc-700 text-zinc-300"
                        }`}
                >
                    {live && (
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    )}
                    {status}
                </span>
            </div>

            {/* Times */}
            <div className="flex items-center justify-between my-6">

                {/* Casa */}
                <div className="flex flex-col items-center w-24">

                    <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700">

                        {homeLogo ? (
                            <img
                                src={homeLogo}
                                alt={home}
                                className="w-12 h-12 object-contain"
                            />
                        ) : (
                            <span className="text-2xl">⚽</span>
                        )}

                    </div>

                    <span className="mt-3 font-semibold text-center">
                        {home}
                    </span>

                </div>

                {/* Placar */}
                <div className="flex flex-col items-center">

                    <span className="text-5xl font-extrabold">
                        {homeScore}
                        <span className="mx-3 text-zinc-600">
                            -
                        </span>
                        {awayScore}
                    </span>

                    <span className="mt-3  text-lime-400 px-2  py-1 rounded-sm text-sm font-bold">
                        {minute}
                    </span>

                </div>

                {/* Visitante */}
                <div className="flex flex-col items-center w-24">

                    <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700">

                        {awayLogo ? (
                            <img
                                src={awayLogo}
                                alt={away}
                                className="w-12 h-12 object-contain"
                            />
                        ) : (
                            <span className="text-2xl">⚽</span>
                        )}

                    </div>

                    <span className="mt-3 font-semibold text-center">
                        {away}
                    </span>

                </div>

            </div>


            {/* Rodapé */}
            <div className="flex justify-between items-center mt-8 border-t border-zinc-800 pt-4">

                <span className="bg-zinc-800 px-4 py-2 rounded-xl text-sm">
                    📺 {channel}
                </span>

                <button className="w-12 h-12 rounded-xl border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition">

                    <Star size={20} />

                </button>

            </div>

        </div>
    );
}