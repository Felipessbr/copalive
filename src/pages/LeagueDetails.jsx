import { useParams } from "react-router-dom";
import useLeagueDetails from "../hooks/useLeagueDetails";


export default function LeagueDetails() {
    const { id } = useParams();

    const {
        league,
        loading,
        error,
    } = useLeagueDetails(id);

    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white">
                <p>
                    Carregando...
                </p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white" >
                <p>
                    {error}
                </p>
            </main>
        )
    }

    return (

        <main className="min-h-screen bg-zinc-950 text-white p-5">
            <h1 className="m-6 text-2xl font-bold">
                Detalhes da Liga
            </h1>

            {league && (
                <div className="rounded-xl bg-zinc-900 text-white p-5">
                    <img
                        src={league.logo}
                        alt={league.name}
                        className="mb-4 text-sm h-20 w-20 object-contain"
                    />

                    <h2 className="text-xl font-bold">
                        {league.name}
                    </h2>
                    <p className="mt-2  text-zinc-400">
                        {league.country}
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">
                        ID: {league.id}
                    </p>
                </div>
            )

            }

        </main>
    )
}