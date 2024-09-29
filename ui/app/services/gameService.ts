import { config } from "~/config";
import { Game } from "~/models/igdb";

export const fetchGames = async (searchString: string) => {
    const response = await fetch(
        `${config.api.baseUrl}/${config.api.apiType}/games`,
        {
            method: 'POST',


            body: JSON.stringify({ searchString }),
        }
    );
    const data = await response.json();
    return data.games;
}

export const getGameById = async (gameId: string): Promise<Game> => {
    const response = await fetch(`${config.api.baseUrl}/${config.api.apiType}/game/${gameId}`);
    const data = await response.json();

    return data.game as Game;

}

export const searchFextraLifeWiki = async (searchString: string) => {
    const response = await fetch(
        `${config.api.baseUrl}/fextralife/search`,
        {
            method: 'POST',


            body: JSON.stringify({ searchString }),
        }
    );
    const data = await response.json();
    return data.games;
}
