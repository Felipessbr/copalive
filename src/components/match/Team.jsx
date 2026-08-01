export default function Team({ logo, name }) {
  return (
    <div className="flex flex-col items-center gap-3">

      <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">

        <img
          src={logo}
          alt={name}
          className="w-12 h-12 object-contain"
        />

      </div>

      <span className="font-semibold text-center">
        {name}
      </span>

    </div>
  );
}