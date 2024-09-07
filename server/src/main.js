/**
 * @fileoverview Main handler for AWS Lambda function using aws-lambda-router
 * @module main
 */

import { handler as routerHandler } from 'aws-lambda-router';
import getGameList from "./handlers/get_game_list.js";

/**
 * @typedef {Object} Route
 * @property {string} path - The API endpoint path
 * @property {string} method - The HTTP method for the endpoint
 * @property {Function} action - The handler function for the endpoint
 */

/**
 * @type {import('aws-lambda').Handler}
 * @description Lambda handler function configured with aws-lambda-router
 */
export const handler = routerHandler({
    proxyIntegration: {
        cors: true,
        routes: [
            /**
             * @type {Route}
             * @description Route configuration for fetching game list
             */
            {
                path: "/games",
                method: "GET",
                action: getGameList,
            },
        ],
    },
});