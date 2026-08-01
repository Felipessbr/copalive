import Header from "../components/navigation/Header";
import HomeHero from "../components/home/HomeHero";
import SectionTitle from "../components/common/SectionTitle";
import DateSelector from "../components/home/DateSelector";
import FilterTabs from "../components/home/FilterTabs";
import CompetitionSection from "../components/home/CompetitionSection";
import MatchCard from "../components/match/MatchCard";
import BottomNav from "../components/navigation/BottomNav";

import { useEffect, useState } from "react";
import { getLiveMatches } from "../services/footballApi"
import groupMatches from "../utils/groupMatches";
import mapMatches from "../utils/mapMatches";


export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      const data = await getLiveMatches();

      const formattedMatches = mapMatches(data);

      setMatches(formattedMatches);

      setLoading(false);
    }

    loadMatches();
  }, []);

  const groupedMatches = groupMatches(matches);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Carregando partidas...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-24">

      <Header />

      <HomeHero />

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
                match={match}
              />
            ))}
          </CompetitionSection>
        ))}

      </section>

      <BottomNav />

    </main>
  );
}