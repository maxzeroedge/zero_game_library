import { json, useLoaderData, LoaderFunctionArgs } from "@remix-run/react";
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

export const GameCatalogItem = () => {
    const { game } = useLoaderData<{ game: Game }>();
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
            <p className="text-gray-700 mb-6">{game.summary}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                {game.genres && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Genres</h2>
                        <ul className="list-disc list-inside">
                            {game.genres.map((genre: SubDetail) => (
                                <li key={genre.id}>{genre.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {game.platforms && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Platforms</h2>
                        <ul className="list-disc list-inside">
                            {game.platforms.map((platform: SubDetail) => (
                                <li key={platform.id}>{platform.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {game.game_modes && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Game Modes</h2>
                        <ul className="list-disc list-inside">
                            {game.game_modes.map((mode) => (
                                <li key={mode.id}>{mode.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {game.themes && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Themes</h2>
                        <ul className="list-disc list-inside">
                            {game.themes.map((theme) => (
                                <li key={theme.id}>{theme.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}