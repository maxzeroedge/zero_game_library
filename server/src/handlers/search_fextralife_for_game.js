/**
 * @fileoverview Handler for getting game detail from IGDB
 * @module searchFextraLifeForGame
 */

import { FextraLifeService } from '../services/fextralife.js';

/**
 * Handles the request to get game detail
 * @param {import('aws-lambda').APIGatewayProxyEvent} request - The incoming API Gateway proxy event
 * @param {import('aws-lambda').Context} context - The Lambda function context
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>} The response object with game detail
 */
export default async function searchFextraLifeForGame(request, context) {
    const gameName = request.body?.gameName;
    const searchString = request.body?.searchString;
    const fextraLifeService = new FextraLifeService(gameName);
    const searchResults = fextraLifeService.searchForGame(searchString);
    return {
        statusCode: 200,
        body: JSON.stringify({searchResults})
    };
}