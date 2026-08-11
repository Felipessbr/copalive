import Team from "./Team";
import ScoreBoard from "./ScoreBoard";
import LiveBadge from "./LiveBadge";
import MatchFooter from "./MatchFooter";

import useFavorites from "../../hooks/useFavorites";
import FavoriteButton from "../team/FavoriteButton";

export default function MatchCard({
  competition,

  home,
  away,

  homeId,
  awayId,

  homeLogo,
  awayLogo,

  homeScore,
  awayScore,

  minute,
  status,
  channel,
}) {
  const {
    toggleFavorite,
    isFavorite,
  } = useFavorites();

  const homeTeam = {
    id: homeId,
    name: home,
    logo: homeLogo,
  };

  const awayTeam = {
    id: awayId,
    name: away,
    logo: awayLogo,
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">

      {/* Competição */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">
          {competition}
        </span>

        <LiveBadge status={status} />
      </div>

      {/* Times + placar */}
      <div className="grid grid-cols-3 items-center mt-6">

        {/* Mandante */}
        <div className="flex flex-col items-center gap-2">
          <Team
            logo={homeLogo}
            name={home}
          />

          <FavoriteButton
            favorite={isFavorite(homeId)}
            onClick={() => toggleFavorite(homeTeam)}
          />
        </div>

        {/* Placar */}
        <ScoreBoard
          homeScore={homeScore}
          awayScore={awayScore}
          minute={minute}
        />

        {/* Visitante */}
        <div className="flex flex-col items-center gap-2">
          <Team
            logo={awayLogo}
            name={away}
          />

          <FavoriteButton
            favorite={isFavorite(awayId)}
            onClick={() => toggleFavorite(awayTeam)}
          />
        </div>

      </div>

      <MatchFooter channel={channel} />

    </div>
  );
}