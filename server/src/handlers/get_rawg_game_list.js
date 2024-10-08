/**
 * @fileoverview Handler for getting game list from RAWG
 * @module getRawgGameList

 */

import { RAWGService } from "../services/rawg.js";

/**

 * Handles the request to get game list
 * @param {import('aws-lambda').APIGatewayProxyEvent} request - The incoming API Gateway proxy event
 * @param {import('aws-lambda').Context} context - The Lambda function context
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>} The response object with game list
 */
export default async function getRawgGameList(request, context) {
    const searchString = request.body?.searchString;
    const rawgService = new RAWGService();

    const games = await rawgService.getGames(searchString);
    return {

        statusCode: 200,
        body: JSON.stringify({games})
    };
}
