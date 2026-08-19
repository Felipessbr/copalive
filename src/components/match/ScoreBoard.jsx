export default function ScoreBoard({
    homeScore,
    awayScore,
    minute,
    time,
}) {
    const isScheduled = time !== null;
    const isLive = minute !== null;

    return (
        <div className="flex flex-col items-center">

            <h2 className="text-4xl font-black">

                {isScheduled ? "-" : homeScore}

                <span className="mx-2 text-zinc-500">
                    x
                </span>

                {isScheduled ? "-" : awayScore}

            </h2>

            <span className="inline-block mt-3 text-lime-400 px-3 py-1 rounded-full text-sm font-semibold">
                {isLive && minute}

                {isScheduled && time}

                {!isLive && !isScheduled && "Finalizado"}
            </span>

        </div>
    );
}