/**
 * @fileoverview Handler for getting game detail from RAWG
 * @module getRawgGameDetail
 */
import { RAWGService } from "../services/rawg.js";



/**
 * Handles the request to get game detail
 * @param {import('aws-lambda').APIGatewayProxyEvent} request - The incoming API Gateway proxy event
 * @param {import('aws-lambda').Context} context - The Lambda function context
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>} The response object with game detail
 */
export default async function getRawgGameDetail(request, context) {
    const gameId = request.paths?.gameId;
    const rawgService = new RAWGService();
    const game = await rawgService.getGameDescription(gameId);

    return {
        statusCode: 200,
        body: JSON.stringify({game})
    };
}