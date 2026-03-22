import * as vm from "azure-devops-node-api";
function getEnv(name) {
    const env = process.env[name];
    if (!env) {
        throw new Error(`Environment variable ${name} not found`);
    }
    return env;
}
export async function getWebApi(serverUrl) {
    serverUrl = serverUrl || getEnv("AZURE_DEVOPS_SERVER_URL");
    return await getApi(serverUrl);
}
export async function getApi(serverUrl) {
    try {
        let token = getEnv("AZURE_DEVOPS_PAT");
        let authHandler = vm.getPersonalAccessTokenHandler(token);
        let vsts = new vm.WebApi(serverUrl, authHandler);
        await vsts.connect();
        return vsts;
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create Azure DevOps WebApi client: ${errorMessage}`);
    }
}
export function getProjectName() {
    return getEnv("AZURE_DEVOPS_PROJECT_NAME");
}
export function getOrganizationName() {
    return getEnv("AZURE_DEVOPS_ORGANIZATION_NAME");
}
