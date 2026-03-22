import { z } from "zod";
import {
  createPullRequest,
  getPullRequest,
  listPullRequests,
  updatePullRequest,
  createPullRequestThread,
  getPullRequestThreads,
  addPullRequestReviewer,
  getPullRequestReviewers,
  getPullRequestStatus,
} from "../tools/pullRequest.js";

export const pullRequestTools = [
  {
    toolName: "create_pullrequest",
    details: {
      description: "Create a pull request in Azure DevOps",
      inputSchema: z.object({
        repositoryId: z
          .string()
          .describe("The ID or name of the repository"),
        sourceRefName: z
          .string()
          .describe("The source branch name (e.g., 'refs/heads/feature-branch')"),
        targetRefName: z
          .string()
          .describe("The target branch name (e.g., 'refs/heads/main')"),
        title: z.string().describe("The title of the pull request"),
        description: z
          .string()
          .optional()
          .describe("The description of the pull request"),
        reviewers: z
          .array(z.string())
          .optional()
          .describe("Array of reviewer IDs or email addresses"),
        isDraft: z
          .boolean()
          .optional()
          .describe("Whether the pull request is a draft"),
        autoComplete: z
          .boolean()
          .optional()
          .describe("Set to true to auto-complete the PR when all policies pass"),
      }),
    },
    execute: createPullRequest,
  },
  {
    toolName: "get_pullrequest",
    details: {
      description: "Get a pull request by ID from Azure DevOps",
      inputSchema: z.object({
        repositoryId: z
          .string()
          .describe("The ID or name of the repository"),
        pullRequestId: z.number().describe("The ID of the pull request to retrieve"),
      }),
    },
    execute: getPullRequest,
  },
  {
    toolName: "list_pullrequests",
    details: {
      description: "List pull requests in a repository with optional filters",
      inputSchema: z.object({
        repositoryId: z
          .string()
          .describe("The ID or name of the repository"),
        project: z
          .string()
          .optional()
          .describe("The project name (defaults to the configured project)"),
        status: z
          .string()
          .optional()
          .describe("Filter by status (abandoned, active, all, completed, notSet)"),
        sourceRefName: z
          .string()
          .optional()
          .describe("Filter by source branch"),
        targetRefName: z
          .string()
          .optional()
          .describe("Filter by target branch"),
        creatorId: z
          .string()
          .optional()
          .describe("Filter by creator ID"),
        reviewerId: z
          .string()
          .optional()
          .describe("Filter by reviewer ID"),
        top: z
          .number()
          .optional()
          .describe("Maximum number of results to return"),
        skip: z
          .number()
          .optional()
          .describe("Number of results to skip"),
      }),
    },
    execute: listPullRequests,
  },
  {
    toolName: "update_pullrequest",
    details: {
      description: "Update an existing pull request in Azure DevOps",
      inputSchema: z.object({
        repositoryId: z
          .string()
          .describe("The ID or name of the repository"),
        pullRequestId: z.number().describe("The ID of the pull request to update"),
        title: z.string().optional().describe("The new title"),
        description: z.string().optional().describe("The new description"),
        status: z
          .string()
          .optional()
          .describe("The new status (active, abandoned, completed)"),
        isDraft: z
          .boolean()
          .optional()
          .describe("Whether the pull request is a draft"),
      }),
    },
    execute: updatePullRequest,
  },
  {
    toolName: "create_pullrequest_thread",
    details: {
      description: "Create a comment thread on a pull request in Azure DevOps",
      inputSchema: z.object({
        repositoryId: z
          .string()
          .describe("The ID or name of the repository"),
        pullRequestId: z.number().describe("The ID of the pull request"),
        content: z.string().describe("The comment content"),
        filePath: z
          .string()
          .optional()
          .describe("The file path for a file-level comment"),
        rightFileStartLine: z
          .number()
          .optional()
          .describe("The start line number (for file comments)"),
        rightFileStartOffset: z
          .number()
          .optional()
          .describe("The start character offset"),
        rightFileEndLine: z
          .number()
          .optional()
          .describe("The end line number"),
        rightFileEndOffset: z
          .number()
          .optional()
          .describe("The end character offset"),
        status: z
          .string()
          .optional()
          .describe("The thread status (active, byDesign, closed, fixed, pending, unknown, wontFix)"),
      }),
    },
    execute: createPullRequestThread,
  },
  {
    toolName: "get_pullrequest_threads",
    details: {
      description: "Get comment threads for a pull request in Azure DevOps",
      inputSchema: z.object({
        repositoryId: z
          .string()
          .describe("The ID or name of the repository"),
        pullRequestId: z.number().describe("The ID of the pull request"),
      }),
    },
    execute: getPullRequestThreads,
  },
  {
    toolName: "add_pullrequest_reviewer",
    details: {
      description: "Add a reviewer to a pull request in Azure DevOps",
      inputSchema: z.object({
        repositoryId: z
          .string()
          .describe("The ID or name of the repository"),
        pullRequestId: z.number().describe("The ID of the pull request"),
        reviewerId: z
          .string()
          .describe("The ID or email of the reviewer"),
        vote: z
          .number()
          .optional()
          .describe("The vote value (10=approved, 5=approvedWithSuggestions, 0=noVote, -5=waitingForAuthor, -10=rejected)"),
      }),
    },
    execute: addPullRequestReviewer,
  },
  {
    toolName: "get_pullrequest_reviewers",
    details: {
      description: "Get reviewers for a pull request in Azure DevOps",
      inputSchema: z.object({
        repositoryId: z
          .string()
          .describe("The ID or name of the repository"),
        pullRequestId: z.number().describe("The ID of the pull request"),
      }),
    },
    execute: getPullRequestReviewers,
  },
  {
    toolName: "get_pullrequest_status",
    details: {
      description: "Get status checks for a pull request in Azure DevOps (build policies, branch policies, required reviewers)",
      inputSchema: z.object({
        repositoryId: z
          .string()
          .describe("The ID or name of the repository"),
        pullRequestId: z.number().describe("The ID of the pull request"),
      }),
    },
    execute: getPullRequestStatus,
  },
];