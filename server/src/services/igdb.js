/**
 * @fileoverview IGDB Service for interacting with the IGDB API
 * @module IGDBService
 */

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

/** @constant {string} */
const AUTH_BASE_URL = "https://id.twitch.tv/oauth2/token";
/** @constant {string} */
const API_BASE_URL = "https://api.igdb.com/v4";
/** @constant {string|undefined} */
const AUTH_CLIENT_ID = process.env.IGDB_CLIENT_ID;
/** @constant {string|undefined} */
const AUTH_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

/**
 * Service class for interacting with the IGDB API
 */
export class IGDBService {
    /** @private */
    #clientId;
    /** @private */
    #clientSecret;
    /** @private */
    #accessToken;

    /**
     * Creates an instance of IGDBService
     * @param {string} [clientId=AUTH_CLIENT_ID] - The client ID for IGDB API
     * @param {string} [clientSecret=AUTH_CLIENT_SECRET] - The client secret for IGDB API
     */
    constructor(clientId = AUTH_CLIENT_ID, clientSecret = AUTH_CLIENT_SECRET) {
        this.#clientId = clientId || "";
        this.#clientSecret = clientSecret || "";
    }

    /**
     * Retrieves client credentials from AWS Secrets Manager
     * @returns {Promise<Object>} The secret containing client credentials
     */
    async getClientCredentialsFromSecret() {
        const client = new SecretsManagerClient({ region: "ap-south-1" });
        const command = new GetSecretValueCommand({ SecretId: "zero_game_library_secrets" });
        const response = await client.send(command);
        const secret = JSON.parse(response.SecretString);
        return secret;
    }
    
    /**
     * Gets the access token, refreshing if necessary
     * @returns {Promise<string>} The access token
     */
    async getAccessToken() {
        if(!this.#accessToken || parseInt(this.#accessToken.expires_at) <= Math.floor(Date.now() / 1000)) {
            const data = await this.fetchAccessToken();
            this.#accessToken = data;
        }
        return this.#accessToken.access_token;
    }

    /**
     * Fetches a new access token from the IGDB API
     * @returns {Promise<Object>} The access token data
     */
    async fetchAccessToken() {
        if (!this.#clientId || !this.#clientSecret) {
            const secret = await this.getClientCredentialsFromSecret();
            this.#clientId = secret.IGDB_CLIENT_ID;
            this.#clientSecret = secret.IGDB_CLIENT_SECRET;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        const response = await fetch(AUTH_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: this.#clientId,
                client_secret: this.#clientSecret,
                grant_type: "client_credentials",
                scope: "user:read:email",
            }),
        });

        const data = await response.json();
        return {
            "access_token": data.access_token,
            "expires_at": (currentTime + data.expires_in).toString(),
        };
    }

    /**
     * Retrieves games from the IGDB API
     * @param {string} [searchString=""] - The search string for the games
     * @returns {Promise<Object>} The games data
     */
    async getGames(searchString = "") {
        const accessToken = await this.getAccessToken();
        const fields = "id,name,cover,genres,rating,summary,first_release_date";
        const search = searchString ? `search "${searchString}";` : "";
        const response = await fetch(`${API_BASE_URL}/games`, {
            method: "POST",
            headers: {
                "Client-ID": this.#clientId,
                "Authorization": `Bearer ${accessToken}`
            },
            body: `fields ${fields}; ${search} limit 20; where version_parent = null;`,
        });

        const data = await response.json();
        return data;
    }

    /**
     * Retrieves a game's description and related parameters from the IGDB API based on the game's ID
     * @param {number} gameId - The IGDB game ID
     * @returns {Promise<Object>} The game data including description and related parameters
     */
    async getGameDescription(gameId) {
        const accessToken = await this.getAccessToken();
        const fields = "id,name,summary,storyline,genres.name,platforms.name,themes.name,game_modes.name,player_perspectives.name,keywords.name,cover.url";
        
        const response = await fetch(`${API_BASE_URL}/games`, {
            method: "POST",
            headers: {
                "Client-ID": this.#clientId,
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json"
            },
            body: `fields ${fields}; where id = ${gameId};`,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.length === 0) {
            throw new Error(`No game found with ID ${gameId}`);
        }

        return data[0];
    }
}
