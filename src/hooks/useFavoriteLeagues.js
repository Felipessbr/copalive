import { useEffect, useState } from "react";

const STORAGE_kEY = "copalive_favorite_leagues"

export default function useFavoriteLeagues() {
    const [favoriteLeagues, setFavoriteLeagues] = useState(() => {
        const saved = localStorage.getItem(STORAGE_kEY);

        return saved ? JSON.parse(saved) : [];
    })

    useEffect(() => {
        localStorage.setItem(
            STORAGE_kEY,
            JSON.stringify(favoriteLeagues)
        );

    }, [favoriteLeagues]);


    function toggleFavoriteLeague(league) {

        setFavoriteLeagues((currentFavorites) => {

            const alreadyFavorited = currentFavorites.some(
                (favorite) => favorite.id === league.id
            );

            if (alreadyFavorited) {
                return currentFavorites.filter(
                    (favorite) => favorite.id !== league.id
                )
            }

            return [...currentFavorites, league]
        })
    }

    function isFavoriteLeague(leagueId) {
        return favoriteLeagues.some(
            (favorite) => favorite.id === leagueId
        )
    }

    return {
        favoriteLeagues,
        toggleFavoriteLeague,
        isFavoriteLeague
    }
}