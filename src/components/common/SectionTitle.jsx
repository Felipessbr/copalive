export default function SectionTitle({
    title,
    subtitle,
    onFilter,
}) {
    return (
        <div className="mb-5">

            <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold text-white">
                    {title}
                </h2>

                <button
                    onClick={onFilter}
                    className="flex items-center gap-2 text-sm font-medium text-lime-400"
                >
                    <span>☷</span>
                    Filtrar
                </button>

            </div>

            <p className="mt-1 text-sm text-zinc-400">
                {subtitle}
            </p>

        </div>
    );
}