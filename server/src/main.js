/**
 * @fileoverview Main handler for AWS Lambda function using aws-lambda-router
 * @module main
 */

import { handler as routerHandler } from 'aws-lambda-router';
import getIgdbGameList from "./handlers/get_igdb_game_list.js";
import getIgdbGameDetail from "./handlers/get_igdb_game_detail.js";
import getRawgGameList from "./handlers/get_rawg_game_list.js";
import getRawgGameDetail from "./handlers/get_rawg_game_detail.js";
import searchFextraLifeForGame from './handlers/search_fextralife_for_game.js';


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
                path: "/v1/health",
                method: "GET",
                action: (_) => ({
                    statusCode: 200
                })
            },
            {
                path: "/v1/completions",
                method: "GET",
                action: (_) => ({
                    statusCode: 200
                })
            },
            {
                path: "/igdb/games",
                method: "POST",
                action: getIgdbGameList,
                parseQueryString: true,
                parseQueryParams: true,
            },
            {
                path: "/igdb/game/:gameId",
                method: "GET",
                action: getIgdbGameDetail,
                parseQueryString: true,
                parseQueryParams: true,
            },
            {
                path: "/rawg/games",
                method: "POST",
                action: getRawgGameList,
                parseQueryString: true,
                parseQueryParams: true,
            },
            {
                path: "/rawg/game/:gameId",
                method: "GET",
                action: getRawgGameDetail,
                parseQueryString: true,
                parseQueryParams: true,
            },
            {
                path: "/fextralife/search",
                method: "POST",
                action: searchFextraLifeForGame,
                parseQueryString: true,
                parseQueryParams: true,
            },
        ],
    },
});