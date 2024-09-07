/**
 * @fileoverview Main handler for AWS Lambda function using aws-lambda-router
 * @module main
 */

import { handler as routerHandler } from 'aws-lambda-router';
import getGameList from "./handlers/get_game_list.js";

/**
 * @type {import('aws-lambda').Handler}
 * @description Lambda handler function configured with aws-lambda-router
 */
export const handler = routerHandler({
    /**
     * @type {import('aws-lambda-router').ProxyIntegrationConfig}
     * @description Configuration for proxy integration with CORS and routes
     */
    proxyIntegration: {
        cors: true,
        routes: [
            /**
             * @type {import('aws-lambda-router').Route}
             * @description Route configuration for getting game list
             */
            {
                path: "/games",
                method: "GET",
                action: getGameList,
                parseQueryString: true,
                parseQueryParams: true,
            },
        ],
    },
});