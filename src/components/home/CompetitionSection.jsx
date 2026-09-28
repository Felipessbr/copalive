import { GrTrophy } from "react-icons/gr";


export default function CompetitionSection({
    competition,
    children,
}) {
    return(
        <section className="mb-8">

      <div className="flex items-center gap-2 mb-4">

        <span className="text-xl">
          <GrTrophy className="h-5 w-5 text-lime-400" />
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