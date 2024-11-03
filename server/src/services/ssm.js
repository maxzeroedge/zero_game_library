import {SSMClient, GetParameterCommand} from '@aws-sdk/client-ssm';

const PARAMETER_NAME = "ZeroGameLibraryParameters";

export class ParameterService {
    async getClientCredentialsFromParameters() {
        const client = new SSMClient({ region: "ap-south-1" });
        const command = new GetParameterCommand({ NAME: PARAMETER_NAME });
        const response = await client.send(command);
        return JSON.parse(response.Parameter.Value);
    }
}
