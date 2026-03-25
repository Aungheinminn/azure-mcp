import {
  JsonPatchDocument,
  Operation,
} from "azure-devops-node-api/interfaces/common/VSSInterfaces.js";
import { getOrganizationName, getProjectName, getWebApi } from "../client.js";
import {
  WorkItem,
  WorkItemDelete,
  Wiql,
  WorkItemQueryResult,
  Comment,
  CommentList,
  WorkItemType,
} from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces.js";

import { TeamSettingsIteration } from "azure-devops-node-api/interfaces/WorkInterfaces.js";

export type CreateWorkItemType = {
  title: string;
  type: string;
  assignedTo?: string;
  fields?: Record<string, any>;
};

/**
 * Creates a new work item in Azure DevOps.
 * @param {CreateWorkItemType} params - The work item creation parameters
 * @param {string} params.title - The title of the work item
 * @param {string} params.type - The type of work item (e.g., Task, Bug, User Story)
 * @param {string} [params.assignedTo] - The user to assign the work item to
 * @param {Record<string, any>} [params.fields] - Additional fields to set on the work item
 * @returns {Promise<WorkItem>} The created work item
 * @throws {Error} If the work item creation fails
 */
export const createWorkItem = async ({
  title,
  type,
  assignedTo,
  fields,
}: CreateWorkItemType): Promise<WorkItem> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();

  const witApi = await webApi.getWorkItemTrackingApi();

  const document: JsonPatchDocument[] = [];

  if (title) {
    document.push({
      op: Operation.Add,
      path: "/fields/System.Title",
      value: title,
    });
  }

  if (assignedTo) {
    document.push({
      op: Operation.Add,
      path: "/fields/System.AssignedTo",
      value: assignedTo,
    });
  }

  if (fields) {
    for (const [field, value] of Object.entries(fields)) {
      document.push({
        op: Operation.Add,
        path: `/fields/${field}`,
        value: value,
      });
    }
  }

  const workItem = await witApi.createWorkItem(null, document, projectId, type);
  return workItem;
};

export type GetWorkItemType = {
  id: number;
  fields?: string[];
  expand?: string;
};

/**
 * Retrieves a work item by its ID.
 * @param {GetWorkItemType} params - The get work item parameters
 * @param {number} params.id - The ID of the work item to retrieve
 * @param {string[]} [params.fields] - Optional list of fields to retrieve
 * @param {string} [params.expand] - Expand options (e.g., 'All', 'Relations', 'Fields')
 * @returns {Promise<WorkItem>} The retrieved work item
 * @throws {Error} If the work item retrieval fails
 */
export const getWorkItem = async ({
  id,
  fields,
  expand,
}: GetWorkItemType): Promise<WorkItem> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const workItem = await witApi.getWorkItem(
    id,
    fields,
    undefined,
    expand as any,
    projectId,
  );
  return workItem;
};

export type GetWorkItemsType = {
  ids: number[];
  fields?: string[];
  expand?: string;
};

/**
 * Retrieves multiple work items by their IDs.
 * @param {GetWorkItemsType} params - The get work items parameters
 * @param {number[]} params.ids - Array of work item IDs to retrieve
 * @param {string[]} [params.fields] - Optional list of fields to retrieve
 * @param {string} [params.expand] - Expand options (e.g., 'All', 'Relations', 'Fields')
 * @returns {Promise<WorkItem[]>} Array of retrieved work items
 * @throws {Error} If the work items retrieval fails
 */
export const getWorkItems = async ({
  ids,
  fields,
  expand,
}: GetWorkItemsType): Promise<WorkItem[]> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const workItems = await witApi.getWorkItems(
    ids,
    fields,
    undefined,
    expand as any,
    undefined,
    projectId,
  );
  return workItems;
};

export type UpdateWorkItemType = {
  id: number;
  title?: string;
  assignedTo?: string;
  state?: string;
  fields?: Record<string, any>;
};

/**
 * Updates a work item's fields.
 * @param {UpdateWorkItemType} params - The update work item parameters
 * @param {number} params.id - The work item ID
 * @param {string} [params.title] - The new title of the work item
 * @param {string} [params.assignedTo] - The user to assign the work item to
 * @param {string} [params.state] - The state of the work item
 * @param {Record<string, any>} [params.fields] - Object containing field names and values to update
 * @returns {Promise<WorkItem>} The updated work item
 * @throws {Error} If the work item update fails
 */
export const updateWorkItem = async ({
  id,
  title,
  assignedTo,
  state,
  fields,
}: UpdateWorkItemType): Promise<WorkItem> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const document: JsonPatchDocument[] = [];

  if (title !== undefined) {
    document.push({
      op: Operation.Replace,
      path: "/fields/System.Title",
      value: title,
    });
  }

  if (assignedTo !== undefined) {
    document.push({
      op: Operation.Replace,
      path: "/fields/System.AssignedTo",
      value: assignedTo,
    });
  }

  if (state !== undefined) {
    document.push({
      op: Operation.Replace,
      path: "/fields/System.State",
      value: state,
    });
  }

  if (fields) {
    for (const [field, value] of Object.entries(fields)) {
      document.push({
        op: Operation.Replace,
        path: `/fields/${field}`,
        value: value,
      });
    }
  }

  const workItem = await witApi.updateWorkItem(null, document, id, projectId);
  return workItem;
};

export type UpdateLinkToWorkItem = {
  sourceId: number;
  targetId: number;
  linkType: "Parent" | "Child" | "Related" | "Predecessor" | "Successor";
};

/**
 * Adds a link from one work item to another in Azure DevOps.
 * @param {UpdateLinkToWorkItem} params - The link parameters
 * @param {number} params.sourceId - The ID of the work item to add the link to
 * @param {number} params.targetId - The ID of the work item to link to
 * @param {string} params.linkType - The type of link (Parent, Child, Related, Predecessor, Successor)
 * @returns {Promise<WorkItem>} The updated work item with the new link
 * @throws {Error} If adding the link fails
 */

export const updateLinkToWorkItem = async ({
  sourceId,
  targetId,
  linkType,
}: UpdateLinkToWorkItem): Promise<WorkItem> => {
  const projectId = getProjectName();
  const organizationId = getOrganizationName();
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const linkTypeMap = {
    Parent: "System.LinkTypes.Hierarchy-Reverse",
    Child: "System.LinkTypes.Hierarchy-Forward",
    Related: "System.LinkTypes.Related",
    Predecessor: "System.LinkTypes.Dependency-Reverse",
    Successor: "System.LinkTypes.Dependency-Forward",
  };

  const document: JsonPatchDocument[] = [
    {
      op: Operation.Add,
      path: "/relations/-",
      value: {
        rel: linkTypeMap[linkType],
        url: `https://dev.azure.com/${organizationId}/${projectId}/_apis/wit/workItems/${targetId}`,
        attributes: {
          comment: "Parent work item",
        },
      },
    },
  ];

  const workItem = await witApi.updateWorkItem(
    null,
    document,
    sourceId,
    projectId,
  );
  return workItem;
};

export type QueryWorkItemsType = {
  query: string;
  top?: number;
};

/**
 * Gets the current iteration for the default team in the project.
 * The current iteration is determined by checking the `attributes.timeFrame` property
 * where 1 indicates the current active iteration.
 * @returns {Promise<TeamSettingsIteration>} The current team iteration
 * @throws {Error} If retrieving iterations fails
 * @see {@link getIterations} To get all iterations with their timeFrame values
 *
 * @example
 * // Returns iteration with timeFrame = 1 (current)
 * const currentIteration = await getCurrentIteration();
 * // currentIteration.attributes.timeFrame === 1
 *
 * // TimeFrame values:
 * // 0 = Past (iteration end date is before today)
 * // 1 = Current (today falls within iteration dates)
 * // 2 = Future (iteration start date is after today)
 */
export const getCurrentIteration = async (): Promise<TeamSettingsIteration> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const workApi = await webApi.getWorkApi();
  const coreApi = await webApi.getCoreApi();

  const project = await coreApi.getProject(projectId);
  const teamContext = {
    project: project.name,
    projectId: project.id,
    team: project.defaultTeam?.name,
    teamId: project.defaultTeam?.id,
  };

  const iterations = await workApi.getTeamIterations(teamContext);
  const currentIteration = iterations.find(
    (iteration) => iteration.attributes?.timeFrame === 1,
  );
  return currentIteration as TeamSettingsIteration;
};

/**
 * Gets all iterations for the default team in the project.
 * Returns past, current, and future iterations with their timeFrame indicators.
 * @returns {Promise<TeamSettingsIteration[]>} Array of all team iterations
 * @throws {Error} If retrieving iterations fails
 * @see {@link getCurrentIteration} To get only the current iteration
 *
 * @example
 * const iterations = await getIterations();
 * const current = iterations.find(i => i.attributes?.timeFrame === 1);
 * const past = iterations.filter(i => i.attributes?.timeFrame === 0);
 * const future = iterations.filter(i => i.attributes?.timeFrame === 2);
 *
 * // TimeFrame values:
 * // 0 = Past (iteration end date is before today)
 * // 1 = Current (today falls within iteration dates)
 * // 2 = Future (iteration start date is after today)
 */
export const getIterations = async (): Promise<TeamSettingsIteration[]> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const workApi = await webApi.getWorkApi();
  const coreApi = await webApi.getCoreApi();

  const project = await coreApi.getProject(projectId);
  const teamContext = {
    project: project.name,
    projectId: project.id,
    team: project.defaultTeam?.name,
    teamId: project.defaultTeam?.id,
  };

  const iterations = await workApi.getTeamIterations(teamContext);
  return iterations;
};
/**
 * Queries work items using WIQL (Work Item Query Language).
 * @param {QueryWorkItemsType} params - The query parameters
 * @param {string} params.query - The WIQL query string
 * @param {number} [params.top] - Maximum number of results to return
 * @returns {Promise<WorkItemQueryResult>} The query result containing work item references
 * @throws {Error} If the query execution fails
 */
export const queryWorkItems = async ({
  query,
  top,
}: QueryWorkItemsType): Promise<WorkItemQueryResult> => {
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const wiql: Wiql = { query };

  const result = await witApi.queryByWiql(wiql, undefined, undefined, top);
  return result;
};

export type AddWorkItemCommentType = {
  workItemId: number;
  text: string;
};

/**
 * Adds a comment to a work item.
 * @param {AddWorkItemCommentType} params - The add comment parameters
 * @param {number} params.workItemId - The ID of the work item to comment on
 * @param {string} params.text - The comment text
 * @returns {Promise<Comment>} The created comment
 * @throws {Error} If adding the comment fails
 */
export const addWorkItemComment = async ({
  workItemId,
  text,
}: AddWorkItemCommentType): Promise<Comment> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const comment = await witApi.addComment({ text }, projectId, workItemId);
  return comment;
};

export type GetWorkItemCommentsType = {
  workItemId: number;
  top?: number;
};

/**
 * Retrieves comments for a work item.
 * @param {GetWorkItemCommentsType} params - The get comments parameters
 * @param {number} params.workItemId - The ID of the work item to get comments for
 * @param {number} [params.top] - Maximum number of comments to return
 * @returns {Promise<CommentList>} List of comments for the work item
 * @throws {Error} If retrieving comments fails
 */
export const getWorkItemComments = async ({
  workItemId,
  top,
}: GetWorkItemCommentsType): Promise<CommentList> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const comments = await witApi.getComments(projectId, workItemId, top);
  return comments;
};

export type GetWorkItemRevisionsType = {
  id: number;
  top?: number;
  skip?: number;
};

/**
 * Retrieves revision history for a work item.
 * @param {GetWorkItemRevisionsType} params - The get revisions parameters
 * @param {number} params.id - The ID of the work item to get revisions for
 * @param {number} [params.top] - Maximum number of revisions to return
 * @param {number} [params.skip] - Number of revisions to skip for pagination
 * @returns {Promise<WorkItem[]>} Array of work item revisions
 * @throws {Error} If retrieving revisions fails
 */
export const getWorkItemRevisions = async ({
  id,
  top,
  skip,
}: GetWorkItemRevisionsType): Promise<WorkItem[]> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const revisions = await witApi.getRevisions(
    id,
    top,
    skip,
    undefined,
    projectId,
  );
  return revisions;
};

export type GetWorkItemTypesType = {
  project?: string;
};

/**
 * Retrieves available work item types for a project.
 * @param {GetWorkItemTypesType} [params={}] - The get work item types parameters
 * @param {string} [params.project] - The project name (defaults to the configured project)
 * @returns {Promise<WorkItemType[]>} Array of work item types
 * @throws {Error} If retrieving work item types fails
 */
export const getWorkItemTypes = async ({
  project,
}: GetWorkItemTypesType = {}): Promise<WorkItemType[]> => {
  const projectId = project || getProjectName();
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const workItemTypes = await witApi.getWorkItemTypes(projectId);
  return workItemTypes;
};

export type DeleteWorkItemType = {
  id: number;
};

/**
 * Deletes a work item by its ID.
 * @param {DeleteWorkItemType} params - The delete work item parameters
 * @param {number} params.id - The ID of the work item to delete
 * @returns {Promise<WorkItemDelete>} The deleted work item information
 * @throws {Error} If the work item deletion fails
 */
export const deleteWorkItem = async ({
  id,
}: DeleteWorkItemType): Promise<WorkItemDelete> => {
  const projectId = getProjectName();
  const webApi = await getWebApi();
  const witApi = await webApi.getWorkItemTrackingApi();

  const workItem = await witApi.deleteWorkItem(id, projectId);
  return workItem;
}
