export default function FeaturedCard({
    title,
    subtitle,
    image,
    type,

}) {
    return (
        <article className="relative h-64 rounded-3xl overflow-hidden shadow-lg cursor-pointer group">
            {/* imagem */}

            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Orverlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />


            {/* Conteudo */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                    className={`
                            inline-flex
                            items-center
                            rounded-full
                            px-3
                            py-1
                            mb-3
                            text-xs
                            font-bold
                            ${type === "news"
                            ? "bg-blue-500 text-white"
                            : "bg-lime-500 text-black"
                        }
  `}
                >
                    {type === "news" ? "NOTÍCIA" : "JOGO"}
                </span>

                <h2 className="text-white text- md:text-3xl font-bold leading-tight">
                    {title}
                </h2>

                <p className="text-zinc-300 text-sm mt-2 line-clamp-2">
                    {subtitle}
                </p>

                <div className="mt-5 flex items-center gap-2 text-lime-400 font-semibold">
                    <span>Ver detalhes</span>

                    <span>→</span>
                </div>
            </div>

        </article>
    )
}