import { useState, useEffect } from "react";

const STORAGE_KEY = "copalive_favorite_teams";

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEY);

    return savedFavorites
      ? JSON.parse(savedFavorites)
      : [];
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  function toggleFavorite(team) {
    setFavorites((currentFavorites) => {
      const alreadyFavorited = currentFavorites.some(
        (fav) => fav.id === team.id
      );

      if (alreadyFavorited) {
        return currentFavorites.filter(
          (fav) => fav.id !== team.id
        );
      }

      return [...currentFavorites, team];
    });
  }

  function isFavorite(teamId) {
    return favorites.some(
      (fav) => fav.id === teamId
    );
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}