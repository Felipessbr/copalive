import Header from './../components/navigation/Header';
import BottomNav from './../components/navigation/BottomNav';
import { leagues } from '../components/constants/leagues';

export default function Leagues() {
    return (
        <main className='min-h-screen bg-zinc-950 text-white pt-24 pb-24'>

            <Header />

            <section className='px-5 mt-6'>

                {/* TITULO */}
                <div className="mb-6">
                    <h1 className='text-2xl font-bold'>
                        LIGAS
                    </h1>
                </div>

                {/* BUSCA */}
                <div className="mb-8">
                    <input type="text" placeholder='Buscar ligas, times...'
                        className='w-full rounded-full border border-zinc-800 px-5 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-lime-400 ' />
                </div>

                {/* MINHAS LIGAS */}

                <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2>Minhas Ligas</h2>

                        <button className='text-sm font-medium text-lime-400'>
                            Editar
                        </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">


                        {leagues.slice(0, 3).map((league) => (
                            <div
                                key={league.id}
                                className="min-w-[120px] rounded-xl border border-zinc-900 p-4">

                                <div className="bm-3 flex justify-between">
                                    <span className='text-lime-500'>
                                        ★
                                    </span>
                                </div>

                                <div className="flex h-2 items-center justify-center">
                                    <span className="text-3xl">
                                        🏆
                                    </span>
                                </div>

                                <p className='mt-3 text-center text-sm font-semibold'>
                                    {league.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TODAS AS LIGAS */}

                <div>
                    <h2 className='mb-4 text-sm font-semibold'>
                        Todas as ligas
                    </h2>

                    <div className="flex flex-col gap-3">

                        {leagues.map((league) => (
                            <button
                                key={league.id}
                                className='flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-left transition hove:bg-zinc-800 '>


                                {/* LOGO TEMPORARIO */}

                                <div className="flex h-11 w-11
                                shrink-0 items-center justify-center rounded-full bg-zinc-800">
                                    🏆
                                </div>

                                {/* INFORMAÇÕES */}
                                <div className="flex-1">
                                    <p className='font-semibold'>
                                        {league.name}
                                    </p>
                                    <span className='font-semibold text-zinc-500'>
                                        {league.country}
                                    </span>
                                </div>

                                {/* FAVORITO */}
                                <span className='text-zinc-500 text-2xl'>
                                          ☆
                                </span>

                                 {/* Seta */}

                                 <span className='text-zinc-500 text-2xl'>
                                         ›
                                 </span>
                                
                            </button>

                        
                        ))}
                    </div>
                </div>
                <BottomNav />
            </section>

        </main>
    )
}
