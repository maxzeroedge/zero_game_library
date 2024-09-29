import fs from 'fs';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export class SecretService {

    /**
     * Retrieves client credentials from AWS Secrets Manager
     * @returns {Promise<Object>} The secret containing client credentials
     */
    async getClientCredentialsFromSecret() {
        const secret = await this.readSecretValuesFromFile();
        if (secret) {
            return secret;
        }
        const client = new SecretsManagerClient({ region: "ap-south-1" });
        const command = new GetSecretValueCommand({ SecretId: "zero_game_library_secrets" });
        const response = await client.send(command);
        await this.writeSecretValues(response);
        return JSON.parse(response.SecretString);
    }
    /**
     * Reads client credentials from the local secrets file
     * @returns {Promise<Object|null>} The secret containing client credentials or null if file doesn't exist
     */
    async readSecretValuesFromFile() {
        const homeDir = process.env.HOME || process.env.USERPROFILE;
        const filePath = `${homeDir}/.zero_game_library_secrets.json`;
        console.log(filePath);

        try {
            const fileContent = await fs.promises.readFile(filePath, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('Secret file does not exist. Falling back to other methods.');
                return null;
            }
            console.error('Error reading secret file:', error);
            throw error;
        }
    }
    
    async writeSecretValues(response) {
        if (response.SecretString) {
            const secretContent = JSON.parse(response.SecretString);
            const homeDir = process.env.HOME || process.env.USERPROFILE;
            const filePath = `${homeDir}/.zero_game_library_secrets.json`;

            await fs.promises.writeFile(filePath, JSON.stringify(secretContent, null, 2), {
                encoding: 'utf8'
            });
        } else {
            console.error('No secret string found in the response');
        }
    }
}