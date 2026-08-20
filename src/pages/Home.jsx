import Header from "../components/navigation/Header";
import SectionTitle from "../components/common/SectionTitle";
import DateSelector from "../components/home/DateSelector";
import FilterTabs from "../components/home/FilterTabs";
import CompetitionSection from "../components/home/CompetitionSection";
import MatchCard from "../components/match/MatchCard";
import BottomNav from "../components/navigation/BottomNav";
import useMatches from "../hooks/useMatches";
import SkeletonCard from "../components/ui/SkeletonCard";
import FeaturedCarousel from "../components/home/FeaturedCarousel";
import LeagueFilter from "../components/home/LeagueFilter";

import { useState } from "react";

export default function Home() {

  function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  const leagues = [
    { id: 71, name: "Brasileirão" },
    { id: 39, name: "Premier League" },
    { id: 140, name: "La Liga" },
    { id: 135, name: "Serie A" },
    { id: 78, name: "Bundesliga" },
    { id: 2, name: "Champions League" },
    { id: 13, name: "Libertadores" },
  ];

  const [selectedDate, setSelectedDate] = useState(
    getToday()
  );

  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);


  const {
    groupedMatches,
    loading,
    error,
    filter,
    setFilter,
  } = useMatches(selectedDate, selectedLeague);

  const selectedLeagueName = leagues.find(
    (league) => league.id === selectedLeague
  )?.name;

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-red-500">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-24">

      <Header />

      <section className="px-5 mt-6">

        <FeaturedCarousel />

        <SectionTitle
          title="⚡ Jogos"
          subtitle={
            selectedLeagueName
              ? `Explorar ${selectedLeagueName}`
              : "Explorar eventos de hoje"
          }
          onFilter={() => setShowFilters(true)}
        />
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <FilterTabs
          filter={filter}
          setFilter={setFilter}
        />

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

      {showFilters && (
        <LeagueFilter
          selectedLeague={selectedLeague}
          onLeagueChange={(leagueId) => {
            setSelectedLeague(leagueId);
            setShowFilters(false);
          }}
          onClose={() => setShowFilters(false)}
        />
      )}

    </main>
  );
}