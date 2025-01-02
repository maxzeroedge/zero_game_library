/**
 * @fileoverview Handler for getting game list from IGDB
 * @module getIgdbGameList
 */


import { IGDBService } from "../services/igdb.js";

/**
 * Handles the request to get game list
 * @param {import('aws-lambda').APIGatewayProxyEvent} request - The incoming API Gateway proxy event
 * @param {import('aws-lambda').Context} context - The Lambda function context
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>} The response object with game list
 */
export default async function getIgdbGameList(request, context) {
    const searchString = request.body?.searchString;
    const igdbService = new IGDBService();
    const games = await igdbService.getGames(searchString);
    return {
        statusCode: 200,
        body: JSON.stringify({searchResults: games})
    };
}
