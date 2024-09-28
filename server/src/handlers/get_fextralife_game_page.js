/**
 * @fileoverview Handler for getting game detail from IGDB
 * @module getFextraLifeGamePage
 */

import { FextraLifeService } from '../services/fextralife';

/**
 * Handles the request to get game detail
 * @param {import('aws-lambda').APIGatewayProxyEvent} request - The incoming API Gateway proxy event
 * @param {import('aws-lambda').Context} context - The Lambda function context
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>} The response object with game detail
 */
export default async function getFextraLifeGamePage(request, context) {
    const gameName = request.body?.gameName;
    const fextraLifeService = new FextraLifeService(gameName);
    const flUrl = fextraLifeService.getGameUrl();
    return {
        statusCode: 200,
        body: JSON.stringify({flUrl})
    };
}