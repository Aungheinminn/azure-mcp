import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { workItemTools } from "./workItemTools.js";
import { pullRequestTools } from "./pullRequestTools.js";
import { formatResult, formatError } from "../utils.js";

export function registerWorkItemTools(server: McpServer) {
  workItemTools.forEach((tool) => {
    server.registerTool(
      tool.toolName,
      {
        description: tool.details.description,
        inputSchema: tool.details.inputSchema,
      },
      async (args: any) => {
        try {
          const toolResult = await tool.execute(args);
          return formatResult(toolResult);
        } catch (error) {
          return formatError(error);
        }
      },
    );
  });
}

export function registerPullRequestTools(server: McpServer) {
  pullRequestTools.forEach((tool) => {
    server.registerTool(
      tool.toolName,
      {
        description: tool.details.description,
        inputSchema: tool.details.inputSchema,
      },
      async (args: any) => {
        try {
          const toolResult = await tool.execute(args);
          return formatResult(toolResult);
        } catch (error) {
          return formatError(error);
        }
      },
    );
  });
}
