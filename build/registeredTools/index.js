import { workItemTools } from "./workItemTools.js";
import { pullRequestTools } from "./pullRequestTools.js";
import { formatResult, formatError } from "../utils.js";
export function registerWorkItemTools(server) {
    workItemTools.forEach((tool) => {
        server.registerTool(tool.toolName, {
            description: tool.details.description,
            inputSchema: tool.details.inputSchema,
        }, async (args) => {
            try {
                const toolResult = await tool.execute(args);
                return formatResult(toolResult);
            }
            catch (error) {
                return formatError(error);
            }
        });
    });
}
export function registerPullRequestTools(server) {
    pullRequestTools.forEach((tool) => {
        server.registerTool(tool.toolName, {
            description: tool.details.description,
            inputSchema: tool.details.inputSchema,
        }, async (args) => {
            try {
                const toolResult = await tool.execute(args);
                return formatResult(toolResult);
            }
            catch (error) {
                return formatError(error);
            }
        });
    });
}
