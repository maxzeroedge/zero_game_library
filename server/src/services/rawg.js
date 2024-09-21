import { GameResultMapper } from "../utils/mapper.js";
import { SecretService } from "./secrets.js";

/**
 * Service class for interacting with the RAWG API.
 */
export class RAWGService {
    /**
     * Constructs a new RAWGService instance.
     */
    constructor() {
        this.secretService = new SecretService();
    }

    /**
     * Retrieves the RAWG API access token.
     * @returns {Promise<string>} A promise that resolves to the RAWG API key.
     */
    async getAccessToken() {
        const secret = await this.secretService.getClientCredentialsFromSecret();
        return secret.RAWG_API_KEY;
    }

    /**
     * Fetches games from the RAWG API based on a search query.
     * @param {string} searchQuery - The search query to find games.
     * @param {number} [page=1] - The page number for pagination (default is 1).
     * @returns {Promise<Object>} A promise that resolves to the JSON response from the RAWG API.
     */
    async getGames(searchQuery, page = 1) {
        const accessToken = await this.getAccessToken();
        const urlSearchParams = new URLSearchParams({   
            search: searchQuery,
            key: accessToken,
            page_size: 50, 
            page,
        });
        
        const response = await fetch(`https://api.rawg.io/api/games?${urlSearchParams.toString()}`);
        const data = await response.json();
        return GameResultMapper.mapRawgGameResultList(data.results);
    }

    /**
     * Fetches detailed game description from the RAWG API based on the game ID.
     * @param {number|string} id - The unique identifier of the game.
     * @returns {Promise<Object>} A promise that resolves to the mapped game object containing the description.
     */
    async getGameDescription(id) {
        const accessToken = await this.getAccessToken();
        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${accessToken}`);
        const data = await response.json();
        return GameResultMapper.mapRawgGameResult(data);
    }
}