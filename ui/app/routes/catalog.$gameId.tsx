import { json, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Game, SubDetail } from '~/models/igdb';
import { getGameById, searchFextraLifeWiki } from "~/services/gameService";
import SearchComponent from "~/components/Search";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const gameId = params.gameId;
    if (!gameId) {
        return json({ error: 'Game ID is required' }, { status: 404 });
    }
    const game = await getGameById(gameId);
    return json({ game });
};

const GameCatalogItem = () => {
    const { game } = useLoaderData<{ game: Game }>();

    return (
        <div className="bg-white">
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mb-6">
                <div className="flex flex-row gap-4 mb-6">
                    {game.image && (
                        <img src={game.image} alt={`${game.name} cover`} className="w-24 h-auto rounded-lg shadow-md mx-auto" />
                    )}
                    <h1 className="text-3xl font-bold w-full self-end">{game.name}</h1>
                </div>
                {game.releaseDate && (
                    <div className="flex gap-4 mb-4">
                        <h2 className="text-xl font-semibold">Release Date</h2>
                        <p className="text-gray-700 self-end">
                            {new Date(game.releaseDate * 1000).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                )}
                {game.rating && (
                    <div className="flex gap-4 mb-4">
                        <h2 className="text-xl font-semibold">Rating</h2>
                        <div className="flex items-center self-end">
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    className={`w-6 h-6 ${
                                        index < Math.round(game.rating!! / 20)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="ml-2 text-gray-600">
                                {(game.rating).toFixed(1)} %
                            </span>
                        </div>
                    </div>
                )}
                <details className="mb-4">
                    <summary className="text-lg font-semibold cursor-pointer">Summary</summary>
                    <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: game.summary || '' }} />
                </details>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {game.genres && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Genres</h2>
                            <div className="flex flex-wrap gap-2">
                                {game.genres.map((genre: SubDetail) => (
                                    <span key={genre.id} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {game.platforms && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Platforms</h2>
                            <div className="flex flex-wrap gap-2">
                                {game.platforms.map((platform: SubDetail) => (
                                    <span key={platform.id} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                                        {platform.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {game.game_modes && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Game Modes</h2>
                            <div className="flex flex-wrap gap-2">
                                {game.game_modes.map((mode) => (
                                    <span key={mode.id} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                                        {mode.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {game.themes && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Themes</h2>
                            <div className="flex flex-wrap gap-2">
                                {game.themes.map((theme) => (
                                    <span key={theme.id} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                                        {theme.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="max-w-6xl mx-auto">
                <SearchComponent 
                    apiToCall={searchFextraLifeWiki}
                    searchName={game.name!!}
                />
            </div>
        </div>
    );
}

export default GameCatalogItem;
