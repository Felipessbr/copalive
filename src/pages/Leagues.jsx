import Header from "../components/navigation/Header";
import BottomNav from "../components/navigation/BottomNav";
import useLeagues from "../hooks/useLeagues";
import useFavoriteLeagues from "../hooks/useFavoriteLeagues";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Leagues() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const {
        leagues,
        loading,
        error,
    } = useLeagues();

    const {
        favoriteLeagues,
        toggleFavoriteLeague,
        isFavoriteLeague,
    } = useFavoriteLeagues();

    const myLeagues = favoriteLeagues;

    // Normaliza o texto para facilitar a busca
    // Exemplo: "Itália" também pode ser encontrada digitando "italia"
    const normalizeText = (text) => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    };

    // Filtra as ligas conforme o usuário digita
    const filteredLeagues = leagues.filter((league) => {
        const name = normalizeText(league.name);
        const country = normalizeText(league.country);
        const searchTermNormalized = normalizeText(search);

        return (
            name.includes(searchTermNormalized) ||
            country.includes(searchTermNormalized)
        );
    });

    const handleLeagueClick = (league) => {
            navigate(`/leagues/${league.id}`); 
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-24">

            <Header />

            <section className="px-5 mt-6">

                {/* TÍTULO */}
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
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.currentTarget.blur();
                            }
                        }}
                        placeholder="Buscar ligas, times..."
                        className="w-full rounded-full border border-zinc-800 px-5 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-lime-400"
                    />
                </div>

                {/* MINHAS LIGAS */}
                <div className="mb-8">

                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Minhas Ligas
                        </h2>

                        <button className="text-sm font-medium text-lime-400">
                            Editar
                        </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">

                        {myLeagues.length > 0 ? (

                            myLeagues.map((league) => (

                                <button
                                    key={league.id}
                                    onClick={() => handleLeagueClick(league)}
                                    className="min-w-[120px] rounded-xl border border-zinc-900 bg-zinc-900 p-4"
                                >

                                    {/* FAVORITO */}
                                    <div className="mb-3 flex justify-between">
                                        <span className="text-lime-500">
                                            ★
                                        </span>
                                    </div>

                                    {/* LOGO */}
                                    <div className="flex items-center justify-center">
                                        <img
                                            src={league.logo}
                                            alt={league.name}
                                            className="h-10 w-10 object-contain"
                                        />
                                    </div>

                                    {/* NOME */}
                                    <p className="mt-3 text-center text-sm font-semibold">
                                        {league.name}
                                    </p>

                                </button>

                            ))

                        ) : (

                            <div className="w-full rounded-xl border border-dashed border-zinc-800 px-5 py-6 text-center">

                                <p className="text-sm text-zinc-400">
                                    Você ainda não adicionou nenhuma liga.
                                </p>

                                <p className="mt-1 text-xs text-zinc-600">
                                    Toque na ☆ para adicionar uma liga aos favoritos.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

                {/* TODAS AS LIGAS */}
                <div>

                    <h2 className="mb-4 text-sm font-semibold">
                        Todas as ligas
                    </h2>

                    {/* CARREGANDO */}
                    {loading && (
                        <p className="py-8 text-center text-sm text-zinc-500">
                            Carregando ligas...
                        </p>
                    )}

                    {/* ERRO */}
                    {error && !loading && (
                        <p className="py-8 text-center text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    {/* LISTA */}
                    {!loading && !error && (
                        <div className="flex flex-col gap-3">

                            {filteredLeagues.length > 0 ? (

                                filteredLeagues.map((league) => (

                                    <button
                                        key={league.id}
                                        onClick={() =>
                                            navigate(`/leagues/${league.id}`)
                                        }
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
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                toggleFavoriteLeague(league);
                                            }}
                                            className={`cursor-pointer text-xl ${
                                                isFavoriteLeague(league.id)
                                                    ? "text-lime-400"
                                                    : "text-zinc-500"
                                            }`}
                                        >
                                            {isFavoriteLeague(league.id)
                                                ? "★"
                                                : "☆"}
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
                    )}

                </div>

            </section>

            <BottomNav />

        </main>
    );
}