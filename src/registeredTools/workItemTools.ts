import { z } from "zod";
import { createWorkItem } from "../tools/workItem.js";

export const workItemTools = [
  {
    toolName: "create_workitem",
    details: {
      description: "Create a work item in Azure DevOps",
      inputSchema: z.object({
        title: z.string().describe("The title of the work item"),
        type: z
          .string()
          .describe("The type of work item (e.g., Task, Bug, User Story)"),
        assignedTo: z
          .string()
          .optional()
          .describe("The user to assign the work item to"),
        fields: z
          .record(z.any())
          .optional()
          .describe("Additional fields to set on the work item"),
      }),
    },
    execute: createWorkItem,
  },
];
