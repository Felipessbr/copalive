import Header from "../components/navigation/Header";
import HomeHero from "../components/home/HomeHero";
import SectionTitle from "../components/common/SectionTitle";
import DateSelector from "../components/home/DateSelector";
import FilterTabs from "../components/home/FilterTabs";
import CompetitionSection from "../components/home/CompetitionSection";
import MatchCard from "../components/match/MatchCard";
import BottomNav from "../components/navigation/BottomNav";
import useMatches from "../hooks/useMatches";
import SkeletonCard from "../components/ui/SkeletonCard";

export default function Home() {
  const {
    groupedMatches,
    loading,
    error,
    stats,
    filter,
    setFilter,
  } = useMatches();

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
  <main className="min-h-screen bg-zinc-950 text-white pb-24">

    <Header />

    <section className="px-5 mt-6">

      <HomeHero stats={stats} />

      <SectionTitle
        title="🔥 Jogos"
        subtitle="Acompanhe todas as partidas."
      />

      <DateSelector />

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