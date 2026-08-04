import Team from "./Team";
import ScoreBoard from "./ScoreBoard";
import LiveBadge from "./LiveBadge";
import MatchFooter from "./MatchFooter";

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
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">
          {competition}
        </span>

        <LiveBadge status={status} />
      </div>

      <div className="grid grid-cols-3 items-center mt-6">
        <Team
          logo={homeLogo}
          name={home}
        />

        <ScoreBoard
          homeScore={homeScore}
          awayScore={awayScore}
          minute={minute}
        />

        <Team
          logo={awayLogo}
          name={away}
        />
      </div>

      <MatchFooter channel={channel} />
    </div>
  );
}