import { z } from "zod";
import {
  createWorkItem,
  getWorkItem,
  getWorkItems,
  updateWorkItem,
  updateLinkToWorkItem,
  queryWorkItems,
  addWorkItemComment,
  getWorkItemComments,
  getWorkItemRevisions,
  getWorkItemTypes,
  getCurrentIteration,
  getIterations,
} from "../tools/workItem.js";

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
  {
    toolName: "get_workitem",
    details: {
      description: "Get a work item by ID from Azure DevOps",
      inputSchema: z.object({
        id: z.number().describe("The ID of the work item to retrieve"),
        fields: z
          .array(z.string())
          .optional()
          .describe("Optional list of fields to retrieve"),
        expand: z
          .string()
          .optional()
          .describe("Expand options (e.g., 'All', 'Relations', 'Fields')"),
      }),
    },
    execute: getWorkItem,
  },
  {
    toolName: "get_workitems",
    details: {
      description: "Get multiple work items by their IDs from Azure DevOps",
      inputSchema: z.object({
        ids: z
          .array(z.number())
          .describe("Array of work item IDs to retrieve"),
        fields: z
          .array(z.string())
          .optional()
          .describe("Optional list of fields to retrieve"),
        expand: z
          .string()
          .optional()
          .describe("Expand options (e.g., 'All', 'Relations', 'Fields')"),
      }),
    },
    execute: getWorkItems,
  },
  {
    toolName: "update_workitem",
    details: {
      description: "Update an existing work item in Azure DevOps",
      inputSchema: z.object({
        id: z.number().describe("The ID of the work item to update"),
        title: z.string().optional().describe("The new title of the work item"),
        assignedTo: z
          .string()
          .optional()
          .describe("The user to assign the work item to"),
        state: z.string().optional().describe("The state of the work item"),
        fields: z
          .record(z.any())
          .optional()
          .describe("Additional fields to update on the work item"),
      }),
    },
    execute: updateWorkItem,
  },
  {
    toolName: "update_workitem_link",
    details: {
      description: "Add a link from one work item to another in Azure DevOps",
      inputSchema: z.object({
        sourceId: z.number().describe("The ID of the work item to add the link to"),
        targetId: z.number().describe("The ID of the work item to link to"),
        linkType: z
          .enum(["Parent", "Child", "Related", "Predecessor", "Successor"])
          .describe("The type of link relationship"),
      }),
    },
    execute: updateLinkToWorkItem,
  },
  {
    toolName: "query_workitems",
    details: {
      description: "Query work items using WIQL (Work Item Query Language)",
      inputSchema: z.object({
        query: z
          .string()
          .describe("The WIQL query string to execute (e.g., \"SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.WorkItemType] = 'Task'\")"),
        top: z
          .number()
          .optional()
          .describe("Maximum number of results to return"),
      }),
    },
    execute: queryWorkItems,
  },
  {
    toolName: "add_workitem_comment",
    details: {
      description: "Add a comment to a work item in Azure DevOps",
      inputSchema: z.object({
        workItemId: z.number().describe("The ID of the work item to comment on"),
        text: z.string().describe("The comment text"),
      }),
    },
    execute: addWorkItemComment,
  },
  {
    toolName: "get_workitem_comments",
    details: {
      description: "Get comments for a work item in Azure DevOps",
      inputSchema: z.object({
        workItemId: z.number().describe("The ID of the work item to get comments for"),
        top: z
          .number()
          .optional()
          .describe("Maximum number of comments to return"),
      }),
    },
    execute: getWorkItemComments,
  },
  {
    toolName: "get_workitem_revisions",
    details: {
      description: "Get revision history for a work item in Azure DevOps",
      inputSchema: z.object({
        id: z.number().describe("The ID of the work item to get revisions for"),
        top: z
          .number()
          .optional()
          .describe("Maximum number of revisions to return"),
        skip: z
          .number()
          .optional()
          .describe("Number of revisions to skip for pagination"),
      }),
    },
    execute: getWorkItemRevisions,
  },
  {
    toolName: "get_workitem_types",
    details: {
      description: "Get available work item types for a project in Azure DevOps",
      inputSchema: z.object({
        project: z
          .string()
          .optional()
          .describe("The project name (defaults to the configured project)"),
      }),
    },
    execute: getWorkItemTypes,
  },
  {
    toolName: "get_current_iteration",
    details: {
      description: "Get the current iteration for the default team in Azure DevOps",
      inputSchema: z.object({}),
    },
    execute: getCurrentIteration,
  },
  {
    toolName: "get_iterations",
    details: {
      description: "Get all iterations (past, current, and future) for the default team in Azure DevOps",
      inputSchema: z.object({}),
    },
    execute: getIterations,
  },
];
