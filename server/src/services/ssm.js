import {SSMClient, GetParameterCommand} from '@aws-sdk/client-ssm';

const PARAMETER_NAME = "zero-game-library-secrets";

export class ParameterService {
    async getClientCredentialsFromParameters() {
        const client = new SSMClient({ region: "ap-south-1" });
        const command = new GetParameterCommand({ Name: PARAMETER_NAME });
        const response = await client.send(command);
        return JSON.parse(response.Parameter.Value);
    }
}
