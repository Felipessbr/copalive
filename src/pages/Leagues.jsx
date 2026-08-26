import Header from "../components/navigation/Header";
import BottomNav from "../components/navigation/BottomNav";
import useLeagues from "../hooks/useLeagues";
import { useState } from "react";

export default function Leagues() {
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const {
        leagues,
        loading,
        error,
    } = useLeagues();

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            setSearchTerm(search);
        }
    };

    const normalizeText = (text) => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    };

    const filteredLeagues = leagues.filter((league) => {
        const name = normalizeText(league.name);
        const country = normalizeText(league.country);
        const searchTermNormalized = normalizeText(searchTerm);

        return (
            name.includes(searchTermNormalized) ||
            country.includes(searchTermNormalized)
        );
    });

    return (
        <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-24">

            <Header />

            <section className="px-5 mt-6">

                {/* TITULO */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        LIGAS
                    </h1>
                </div>

                {/* BUSCA */}
                <div className="mb-8">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Buscar ligas, times..."
                        className="w-full rounded-full border border-zinc-800 px-5 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-lime-400"
                    />
                </div>

                {/* MINHAS LIGAS */}
                <div className="mb-8">

                    <div className="mb-4 flex items-center justify-between">
                        <h2>
                            Minhas Ligas
                        </h2>

                        <button className="text-sm font-medium text-lime-400">
                            Editar
                        </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">

                        {leagues.slice(0, 3).map((league) => (

                            <div
                                key={league.id}
                                className="min-w-[120px] rounded-xl border border-zinc-900 p-4"
                            >

                                <div className="mb-3 flex justify-between">
                                    <span className="text-lime-500">
                                        ★
                                    </span>
                                </div>

                                <div className="flex h-10 items-center justify-center">

                                    <img
                                        src={league.logo}
                                        alt={league.name}
                                        className="h-10 w-10 object-contain"
                                    />

                                </div>

                                <p className="mt-3 text-center text-sm font-semibold">
                                    {league.name}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

                {/* TODAS AS LIGAS */}
                <div>

                    <h2 className="mb-4 text-sm font-semibold">
                        Todas as ligas
                    </h2>

                    <div className="flex flex-col gap-3">

                        {filteredLeagues.length > 0 ? (

                            filteredLeagues.map((league) => (

                                <button
                                    key={league.id}
                                    className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-left transition hover:bg-zinc-800"
                                >

                                    {/* LOGO */}
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-800">

                                        <img
                                            src={league.logo}
                                            alt={league.name}
                                            className="h-8 w-8 object-contain"
                                        />

                                    </div>

                                    {/* INFORMAÇÕES */}
                                    <div className="flex-1">

                                        <p className="font-semibold">
                                            {league.name}
                                        </p>

                                        <span className="font-semibold text-zinc-500">
                                            {league.country}
                                        </span>

                                    </div>

                                    {/* FAVORITO */}
                                    <span className="text-xl text-zinc-500">
                                        ☆
                                    </span>

                                    {/* SETA */}
                                    <span className="text-3xl text-zinc-500">
                                        ›
                                    </span>

                                </button>

                            ))

                        ) : (

                            <p className="py-8 text-center text-sm text-zinc-500">
                                Nenhuma liga encontrada.
                            </p>

                        )}

                    </div>

                </div>

            </section>

            <BottomNav />

        </main>
    );
}