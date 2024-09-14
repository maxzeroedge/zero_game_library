/**
 * @fileoverview Handler for getting game detail from IGDB
 * @module getGameDetail
 */
import { IGDBService } from "../services/igdb";

/**
 * Handles the request to get game detail
 * @param {import('aws-lambda').APIGatewayProxyEvent} request - The incoming API Gateway proxy event
 * @param {import('aws-lambda').Context} context - The Lambda function context
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>} The response object with game detail
 */
export default getGameDetail =  async (request, context) => {
    const gameId = request.pathParameters?.gameId;
    const igdbService = new IGDBService();
    const game = await igdbService.getGameDescription(gameId);
    return {
        statusCode: 200,
        body: JSON.stringify({game})
    };
}