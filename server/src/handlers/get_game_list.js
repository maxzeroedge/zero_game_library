/**
 * @fileoverview Handler for getting game list from IGDB
 * @module getGameList
 */

import { IGDBService } from "../services/igdb.js";

/**
 * Handles the request to get game list
 * @param {Object} request - The incoming request object
 * @param {Object} context - The context object
 * @returns {Promise<Object>} The response object with game list
 */
export default async function getGameList(request, context) {
    const igdbService = new IGDBService();
    const games = await igdbService.getGames();
    return {
        statusCode: 200,
        body: JSON.stringify({games})
    };
}
