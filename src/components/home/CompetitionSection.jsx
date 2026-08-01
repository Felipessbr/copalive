export default function CompetitionSection({
    competition,
    children,
}) {
    return(
        <section className="mb-8">

      <div className="flex items-center gap-2 mb-4">

        <span className="text-xl">
          🏆
        </span>

        <h2 className="text-lg font-bold text-white">
          {competition}
        </h2>

      </div>

      <div className="space-y-4">
        {children}
      </div>

    </section>
    )
}