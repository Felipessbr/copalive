
const dates = [
    { day: "SEG", number: 21 },
    { day: "TER", number: 22 },
    { day: "QUA", number: 23 },
    { day: "QUI", number: 24 },
    { day: "SEX", number: 25 },
]
export default function DateSelector() {
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
            {dates.map((date, index) => (
                <button
                    key={index}
                    className={`min-w-[70px] rounded-2xl  p-3 transition-all
                    ${index === 0
                            ? "bg-lime-500 text-black "
                            : " text-white"
                        }`
                    }>

                    <p className="text-xs font-medium">
                        {date.day}
                    </p>
                    <p className="text-xl font-bold">
                        {date.number}
                    </p>

                </button>
            ))
            }
        </div >
    )
}