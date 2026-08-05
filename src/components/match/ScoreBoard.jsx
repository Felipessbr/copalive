export default function ScoreBoard({
    homeScore,
    awayScore,
    minute,
}) {
    
    return (
        <div className="flex flex-col items-center">

                <h2 className="text-4xl font-black">

                    {homeScore}

                    <span className="mx-2 text-zinc-500">
                        x
                    </span>

                    {awayScore}

                </h2>

                <span className="inline-block mt-3 text-lime-400 px-3 py-1 rounded-full text-sm font-semibold">
                    {minute}
                </span>

            </div>
    )
}
