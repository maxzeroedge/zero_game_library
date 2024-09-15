import { json, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Game, SubDetail } from '~/models/igdb';

const getGameById = async (gameId: string): Promise<Game> => {
    const response = await fetch('http://localhost:8080/game/' + gameId);
    const data = await response.json();
    return data.game as Game;
}

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
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex flex-row gap-4 mb-6">
                {game.cover && (
                    <img src={game.cover.url} alt={`${game.name} cover`} className="w-24 h-auto rounded-lg shadow-md mx-auto" />
                )}
                <h1 className="text-3xl font-bold w-full self-end">{game.name}</h1>
            </div>
            <details className="mb-4">
                <summary className="text-lg font-semibold cursor-pointer">Summary</summary>
                <p className="text-gray-700 mt-2">{game.summary}</p>
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
    );
}

export default GameCatalogItem;
