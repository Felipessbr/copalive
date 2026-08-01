import Team from "./Team";
import ScoreBoard from "./ScoreBoard";
import LiveBadge from "./LiveBadge";
import MatchFooter from "./MatchFooter";

export default function MatchCard({ match }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-5 shadow-lg">

      <div className="flex justify-between items-center">

        <span className="text-sm text-zinc-400">
          {match.competition}
        </span>

        <LiveBadge status={match.status} />

      </div>

      <div className="grid grid-cols-3 items-center mt-6">

        <Team
          logo={match.homeLogo}
          name={match.home}
        />

        <ScoreBoard
          homeScore={match.homeScore}
          awayScore={match.awayScore}
          minute={match.minute}
        />

        <Team
          logo={match.awayLogo}
          name={match.away}
        />

      </div>

      <MatchFooter channel={match.channel} />

    </div>
  );
}