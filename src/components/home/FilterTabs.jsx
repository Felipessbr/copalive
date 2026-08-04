export default function FilterTabs({ filter, setFilter }) {
  const tabs = [
    {
      label: "Todos",
      value: "ALL",
    },
    {
      label: "Ao Vivo",
      value: "LIVE",
    },
    {
      label: "Finalizados",
      value: "FINISHED",
    },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto mb-4 ">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setFilter(tab.value)}
          className={`px-4 py-2 rounded-full transition ${
            filter === tab.value
              ? "bg-lime-500 text-black"
              : "bg-zinc-900 text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}