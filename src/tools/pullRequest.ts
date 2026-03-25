import { getProjectName, getWebApi } from "../client.js";
import {
  GitPullRequest,
  GitPullRequestChange,
  GitPullRequestCommentThread,
  GitPullRequestStatus,
} from "azure-devops-node-api/interfaces/GitInterfaces.js";
import { PullRequestStatus } from "azure-devops-node-api/interfaces/GitInterfaces.js";

export type CreatePullRequestType = {
  repositoryId: string;
  sourceRefName: string;
  targetRefName: string;
  title: string;
  description?: string;
  reviewers?: string[];
  workItemRefs?: {
    id: string;
    url: string;
  }[];
  isDraft?: boolean;
  autoComplete?: boolean;
};

/**
 * Creates a new pull request in Azure DevOps.
 * @param {CreatePullRequestType} params - The pull request creation parameters
 * @param {string} params.repositoryId - The ID or name of the repository
 * @param {string} params.sourceRefName - The source branch name (e.g., 'refs/heads/feature-branch')
 * @param {string} params.targetRefName - The target branch name (e.g., 'refs/heads/main')
 * @param {string} params.title - The title of the pull request
 * @param {string} [params.description] - The description of the pull request
 * @param {string[]} [params.reviewers] - Array of reviewer IDs or email addresses
 * @param {Object[]} [params.workItemRefs] - Array of work items to associate with the PR
 * @param {string} params.workItemRefs[].id - The work item ID
 * @param {string} params.workItemRefs[].url - The work item URL
 * @param {boolean} [params.isDraft] - Whether the pull request is a draft
 * @param {boolean} [params.autoComplete] - Set to true to auto-complete the PR when all policies pass
 * @returns {Promise<GitPullRequest>} The created pull request
 * @throws {Error} If the pull request creation fails
 */
export const createPullRequest = async ({
  repositoryId,
  sourceRefName,
  targetRefName,
  title,
  description,
  reviewers,
  workItemRefs,
  isDraft,
  autoComplete,
}: CreatePullRequestType): Promise<GitPullRequest> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const gitApi = await webApi.getGitApi();

  const pullRequest: GitPullRequest = {
    sourceRefName,
    targetRefName,
    title,
    description,
    isDraft,
  };

  if (reviewers && reviewers.length > 0) {
    pullRequest.reviewers = reviewers.map((reviewerId) => ({
      id: reviewerId,
    }));
  }

  // setting empty string id will use current authenticated user
  if (autoComplete) {
    pullRequest.autoCompleteSetBy = {
      id: "",
    };
  }

  if(workItemRefs && workItemRefs.length > 0) {
    pullRequest.workItemRefs = workItemRefs;
  }

  const createdPR = await gitApi.createPullRequest(pullRequest, repositoryId, projectId);
  return createdPR;
};

export type GetPullRequestType = {
  repositoryId: string;
  pullRequestId: number;
};

/**
 * Retrieves a pull request by its ID.
 * @param {GetPullRequestType} params - The get pull request parameters
 * @param {string} params.repositoryId - The ID or name of the repository
 * @param {number} params.pullRequestId - The ID of the pull request to retrieve
 * @returns {Promise<GitPullRequest>} The retrieved pull request
 * @throws {Error} If the pull request retrieval fails
 */
export const getPullRequest = async ({
  repositoryId,
  pullRequestId,
}: GetPullRequestType): Promise<GitPullRequest> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const gitApi = await webApi.getGitApi();

  const pullRequest = await gitApi.getPullRequest(repositoryId, pullRequestId, projectId);
  return pullRequest;
};

export type ListPullRequestsType = {
  repositoryId: string;
  project?: string;
  status?: string;
  sourceRefName?: string;
  targetRefName?: string;
  creatorId?: string;
  reviewerId?: string;
  top?: number;
  skip?: number;
};

/**
 * Lists pull requests in a repository with optional filters.
 * @param {ListPullRequestsType} params - The list pull requests parameters
 * @param {string} params.repositoryId - The ID or name of the repository
 * @param {string} [params.project] - The project name
 * @param {string} [params.status] - Filter by status (abandoned, active, all, completed, notSet)
 * @param {string} [params.sourceRefName] - Filter by source branch
 * @param {string} [params.targetRefName] - Filter by target branch
 * @param {string} [params.creatorId] - Filter by creator ID
 * @param {string} [params.reviewerId] - Filter by reviewer ID
 * @param {number} [params.top] - Maximum number of results to return
 * @param {number} [params.skip] - Number of results to skip
 * @returns {Promise<GitPullRequest[]>} Array of pull requests
 * @throws {Error} If the pull request listing fails
 */
export const listPullRequests = async ({
  repositoryId,
  project,
  status,
  sourceRefName,
  targetRefName,
  creatorId,
  reviewerId,
  top,
  skip,
}: ListPullRequestsType): Promise<GitPullRequest[]> => {
  const projectId = project || getProjectName();
  const webApi = await getWebApi();
  const gitApi = await webApi.getGitApi();

  const statusEnum = status ? (PullRequestStatus[status as keyof typeof PullRequestStatus]) : undefined;

  const pullRequests = await gitApi.getPullRequests(
    repositoryId,
    {
      status: statusEnum,
      sourceRefName,
      targetRefName,
      creatorId,
      reviewerId,
    },
    projectId,
    undefined,
    skip,
    top
  );
  return pullRequests || [];
};

export type UpdatePullRequestType = {
  repositoryId: string;
  pullRequestId: number;
  title?: string;
  description?: string;
  status?: string;
  isDraft?: boolean;
};

/**
 * Updates a pull request.
 * @param {UpdatePullRequestType} params - The update pull request parameters
 * @param {string} params.repositoryId - The ID or name of the repository
 * @param {number} params.pullRequestId - The ID of the pull request to update
 * @param {string} [params.title] - The new title
 * @param {string} [params.description] - The new description
 * @param {string} [params.status] - The new status (active, abandoned, completed)
 * @param {boolean} [params.isDraft] - Whether the pull request is a draft
 * @returns {Promise<GitPullRequest>} The updated pull request
 * @throws {Error} If the pull request update fails
 */
export const updatePullRequest = async ({
  repositoryId,
  pullRequestId,
  title,
  description,
  status,
  isDraft,
}: UpdatePullRequestType): Promise<GitPullRequest> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const gitApi = await webApi.getGitApi();

  const pullRequest: GitPullRequest = {};

  if (title !== undefined) {
    pullRequest.title = title;
  }

  if (description !== undefined) {
    pullRequest.description = description;
  }

  if (status !== undefined) {
    pullRequest.status = PullRequestStatus[status as keyof typeof PullRequestStatus];
  }

  if (isDraft !== undefined) {
    pullRequest.isDraft = isDraft;
  }

  const updatedPR = await gitApi.updatePullRequest(pullRequest, repositoryId, pullRequestId, projectId);
  return updatedPR;
};

export type CreatePullRequestThreadType = {
  repositoryId: string;
  pullRequestId: number;
  content: string;
  filePath?: string;
  rightFileStartLine?: number;
  rightFileStartOffset?: number;
  rightFileEndLine?: number;
  rightFileEndOffset?: number;
  status?: string;
};

/**
 * Creates a comment thread on a pull request.
 * @param {CreatePullRequestThreadType} params - The create thread parameters
 * @param {string} params.repositoryId - The ID or name of the repository
 * @param {number} params.pullRequestId - The ID of the pull request
 * @param {string} params.content - The comment content
 * @param {string} [params.filePath] - The file path for a file-level comment
 * @param {number} [params.rightFileStartLine] - The start line number (for file comments)
 * @param {number} [params.rightFileStartOffset] - The start character offset
 * @param {number} [params.rightFileEndLine] - The end line number
 * @param {number} [params.rightFileEndOffset] - The end character offset
 * @param {string} [params.status] - The thread status (active, byDesign, closed, fixed, pending, unknown, wontFix)
 * @returns {Promise<GitPullRequestCommentThread>} The created comment thread
 * @throws {Error} If the thread creation fails
 */
export const createPullRequestThread = async ({
  repositoryId,
  pullRequestId,
  content,
  filePath,
  rightFileStartLine,
  rightFileStartOffset,
  rightFileEndLine,
  rightFileEndOffset,
  status,
}: CreatePullRequestThreadType): Promise<GitPullRequestCommentThread> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const gitApi = await webApi.getGitApi();

  const thread: GitPullRequestCommentThread = {
    comments: [
      {
        content,
        commentType: 1, // Text comment
      },
    ],
  };

  if (filePath) {
    thread.threadContext = {
      filePath,
    };

    if (rightFileStartLine !== undefined) {
      thread.threadContext.rightFileStart = {
        line: rightFileStartLine,
        offset: rightFileStartOffset || 1,
      };
    }

    if (rightFileEndLine !== undefined) {
      thread.threadContext.rightFileEnd = {
        line: rightFileEndLine,
        offset: rightFileEndOffset || 1,
      };
    }
  }

  if (status) {
    thread.status = status as any;
  }

  const createdThread = await gitApi.createThread(thread, repositoryId, pullRequestId, projectId);
  return createdThread;
};

export type GetPullRequestThreadsType = {
  repositoryId: string;
  pullRequestId: number;
};

/**
 * Retrieves comment threads for a pull request.
 * @param {GetPullRequestThreadsType} params - The get threads parameters
 * @param {string} params.repositoryId - The ID or name of the repository
 * @param {number} params.pullRequestId - The ID of the pull request
 * @returns {Promise<GitPullRequestCommentThread[]>} Array of comment threads
 * @throws {Error} If the thread retrieval fails
 */
export const getPullRequestThreads = async ({
  repositoryId,
  pullRequestId,
}: GetPullRequestThreadsType): Promise<GitPullRequestCommentThread[]> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const gitApi = await webApi.getGitApi();

  const threads = await gitApi.getThreads(repositoryId, pullRequestId, projectId);
  return threads || [];
};

export type AddPullRequestReviewerType = {
  repositoryId: string;
  pullRequestId: number;
  reviewerId: string;
  vote?: number;
};

/**
 * Adds a reviewer to a pull request.
 * @param {AddPullRequestReviewerType} params - The add reviewer parameters
 * @param {string} params.repositoryId - The ID or name of the repository
 * @param {number} params.pullRequestId - The ID of the pull request
 * @param {string} params.reviewerId - The ID or email of the reviewer
 * @param {number} [params.vote] - The vote value (10=approved, 5=approvedWithSuggestions, 0=noVote, -5=waitingForAuthor, -10=rejected)
 * @returns {Promise<IdentityRefWithVote>} The added reviewer
 * @throws {Error} If adding the reviewer fails
 */
export const addPullRequestReviewer = async ({
  repositoryId,
  pullRequestId,
  reviewerId,
  vote,
}: AddPullRequestReviewerType): Promise<any> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const gitApi = await webApi.getGitApi();

  const reviewer = {
    id: reviewerId,
    vote: vote || 0,
  };

  const addedReviewer = await gitApi.createPullRequestReviewer(reviewer, repositoryId, pullRequestId, reviewerId, projectId);
  return addedReviewer;
};

export type GetPullRequestReviewersType = {
  repositoryId: string;
  pullRequestId: number;
};

/**
 * Retrieves reviewers for a pull request.
 * @param {GetPullRequestReviewersType} params - The get reviewers parameters
 * @param {string} params.repositoryId - The ID or name of the repository
 * @param {number} params.pullRequestId - The ID of the pull request
 * @returns {Promise<IdentityRefWithVote[]>} Array of reviewers with their votes
 * @throws {Error} If the reviewer retrieval fails
 */
export const getPullRequestReviewers = async ({
  repositoryId,
  pullRequestId,
}: GetPullRequestReviewersType): Promise<any[]> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const gitApi = await webApi.getGitApi();

  const reviewers = await gitApi.getPullRequestReviewers(repositoryId, pullRequestId, projectId);
  return reviewers || [];
};

export type GetPullRequestStatusType = {
  repositoryId: string;
  pullRequestId: number;
};

/**
 * Retrieves status checks for a pull request.
 * @param {GetPullRequestStatusType} params - The get status parameters
 * @param {string} params.repositoryId - The ID or name of the repository
 * @param {number} params.pullRequestId - The ID of the pull request
 * @returns {Promise<GitPullRequestStatus[]>} Array of status checks
 * @throws {Error} If the status retrieval fails
 */
export const getPullRequestStatus = async ({
  repositoryId,
  pullRequestId,
}: GetPullRequestStatusType): Promise<any[]> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const gitApi = await webApi.getGitApi();

  const statuses = await gitApi.getPullRequestStatuses(repositoryId, pullRequestId, projectId);
  return statuses || [];
};
