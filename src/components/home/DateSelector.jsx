const weekDays = [
    "DOM",
    "SEG",
    "TER",
    "QUA",
    "QUI",
    "SEX",
    "SÁB",
]

function formaDate(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
function generateDates(){
    const dates = []
    
    for(let i = 0; i < 5; i++){
        const date = new Date();

        date.setDate(date.getDate() + i);

        dates.push({
            day:weekDays[date.getDay()],
            number: date.getDate(),
            value: formaDate(date)
        })
    }

    return dates;
}
export default function DateSelector({
    selectedDate,
    onDateChange,
}) {

    const dates = generateDates()
    console.log("Data selecionada:", selectedDate);
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
            {dates.map((date) => (
                <button
                    key={date.value}
                    onClick={() => onDateChange(date.value)}
                    className={`min-w-[70px] rounded-2xl  p-3 transition-all
                    ${selectedDate === date.value
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