/**
 * @fileoverview Handler for getting game list from IGDB
 * @module getGameList
 */

import { IGDBService } from "../services/igdb.js";

/**
 * Handles the request to get game list
 * @param {import('aws-lambda').APIGatewayProxyEvent} request - The incoming API Gateway proxy event
 * @param {import('aws-lambda').Context} context - The Lambda function context
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>} The response object with game list
 */
export default async function getGameList(request, context) {
    console.log('Request object:', JSON.stringify(request, null, 2));
    const searchString = request.queryStringParameters?.searchString;
    const igdbService = new IGDBService();
    const games = await igdbService.getGames(searchString);
    return {
        statusCode: 200,
        body: JSON.stringify({games})
    };
}
