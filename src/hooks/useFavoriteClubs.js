import { useEffect, useState } from "react";

const STORAGE_KEY = "copalive_favorite_clubs";

export default function useFavoriteClubs() {
  const [favoriteClubs, setFavoriteClubs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favoriteClubs)
    );
  }, [favoriteClubs]);

  function toggleFavoriteClub(club) {
    setFavoriteClubs((currentFavorites) => {
      const alreadyFavorited = currentFavorites.some(
        (favorite) => String(favorite.id) === String(club.id)
      );

      if (alreadyFavorited) {
        return currentFavorites.filter(
          (favorite) => String(favorite.id) !== String(club.id)
        );
      }

      return [...currentFavorites, club];
    });
  }

  function isFavoriteClub(clubId) {
    return favoriteClubs.some(
      (club) => String(club.id) === String(clubId)
    );
  }

  return {
    favoriteClubs,
    toggleFavoriteClub,
    isFavoriteClub,
  };
}