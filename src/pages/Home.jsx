import Header from "../components/navigation/Header";
import SectionTitle from "../components/common/SectionTitle";
import DateSelector from "../components/home/DateSelector";
import FilterTabs from "../components/home/FilterTabs";
import CompetitionSection from "../components/home/CompetitionSection";
import MatchCard from "../components/match/MatchCard";
import BottomNav from "../components/navigation/BottomNav";
import useMatches from "../hooks/useMatches";
import SkeletonCard from "../components/ui/SkeletonCard";
import FeaturedCard from "../components/home/FeaturedCard";
import FeaturedCarousel from "../components/home/FeaturedCarousel";

import { useState } from "react";

export default function Home() {

  function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const [selectedDate, setSelectedDate] = useState(
    getToday()
  );
  const {
    groupedMatches,
    loading,
    error,
    stats,
    filter,
    setFilter,
  } = useMatches(selectedDate);

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

        {/* <SectionTitle
          title="🔥 Jogos"
          subtitle="Acompanhe todas as partidas."
        /> */}
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

    </main>
  );
}