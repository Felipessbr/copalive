import Header from "../components/navigation/Header";
import BottomNav from "../components/navigation/BottomNav";
import SectionTitle from "../components/common/SectionTitle";
import FilterTabs from "../components/common/FilterTabs";
import DateSelector from "../components/common/DateSelector";
import CompetitionSection from "../components/common/CompetitionSection";
import MatchCard from "../components/match/MatchCard";
import groupMatches from "../utils/groupMatches";

import matches from "../data/matches";

export default function Home() {
  const brasileirao = matches.filter(
    (match) => match.competition === "Brasileirão"
  );

  const copaDoBrasil = matches.filter(
    (match) => match.competition === "Copa do Brasil"
  );

  const groupedMatches = groupMatches(matches)

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <Header />

      <section className="px-5 mt-6">
        <SectionTitle
          title="🔥 Jogos ao Vivo"
          subtitle="Acompanhe todas as partidas do dia."
        />

        <DateSelector />

        <FilterTabs />

        {Object.entries(groupedMatches).map(([competition, games]) => (
          <CompetitionSection
            key={competition}
            competition={competition}
          >
            {games.map((match) => (
              <MatchCard
                key={match.id}
                {...match}
              />
            ))}
          </CompetitionSection>
        ))}
      </section>

      <BottomNav />
    </main>
  );
}