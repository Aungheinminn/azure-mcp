import { Operation, } from "azure-devops-node-api/interfaces/common/VSSInterfaces.js";
import { getOrganizationName, getProjectName, getWebApi } from "../client.js";
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
export const createWorkItem = async ({ title, type, assignedTo, fields, }) => {
    const projectId = getProjectName();
    const webApi = await getWebApi();
    const witApi = await webApi.getWorkItemTrackingApi();
    const document = [];
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
/**
 * Retrieves a work item by its ID.
 * @param {GetWorkItemType} params - The get work item parameters
 * @param {number} params.id - The ID of the work item to retrieve
 * @param {string[]} [params.fields] - Optional list of fields to retrieve
 * @param {string} [params.expand] - Expand options (e.g., 'All', 'Relations', 'Fields')
 * @returns {Promise<WorkItem>} The retrieved work item
 * @throws {Error} If the work item retrieval fails
 */
export const getWorkItem = async ({ id, fields, expand, }) => {
    const projectId = getProjectName();
    const webApi = await getWebApi();
    const witApi = await webApi.getWorkItemTrackingApi();
    const workItem = await witApi.getWorkItem(id, fields, undefined, expand, projectId);
    return workItem;
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
export const getWorkItems = async ({ ids, fields, expand, }) => {
    const projectId = getProjectName();
    const webApi = await getWebApi();
    const witApi = await webApi.getWorkItemTrackingApi();
    const workItems = await witApi.getWorkItems(ids, fields, undefined, expand, undefined, projectId);
    return workItems;
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
export const updateWorkItem = async ({ id, title, assignedTo, state, fields, }) => {
    const projectId = getProjectName();
    const webApi = await getWebApi();
    const witApi = await webApi.getWorkItemTrackingApi();
    const document = [];
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
/**
 * Adds a link from one work item to another in Azure DevOps.
 * @param {UpdateLinkToWorkItem} params - The link parameters
 * @param {number} params.sourceId - The ID of the work item to add the link to
 * @param {number} params.targetId - The ID of the work item to link to
 * @param {string} params.linkType - The type of link (Parent, Child, Related, Predecessor, Successor)
 * @returns {Promise<WorkItem>} The updated work item with the new link
 * @throws {Error} If adding the link fails
 */
export const updateLinkToWorkItem = async ({ sourceId, targetId, linkType, }) => {
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
    const document = [
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
    const workItem = await witApi.updateWorkItem(null, document, sourceId, projectId);
    return workItem;
};
/**
 * Queries work items using WIQL (Work Item Query Language).
 * @param {QueryWorkItemsType} params - The query parameters
 * @param {string} params.query - The WIQL query string
 * @param {number} [params.top] - Maximum number of results to return
 * @returns {Promise<WorkItemQueryResult>} The query result containing work item references
 * @throws {Error} If the query execution fails
 */
export const queryWorkItems = async ({ query, top, }) => {
    const webApi = await getWebApi();
    const witApi = await webApi.getWorkItemTrackingApi();
    const wiql = { query };
    const result = await witApi.queryByWiql(wiql, undefined, undefined, top);
    return result;
};
/**
 * Adds a comment to a work item.
 * @param {AddWorkItemCommentType} params - The add comment parameters
 * @param {number} params.workItemId - The ID of the work item to comment on
 * @param {string} params.text - The comment text
 * @returns {Promise<Comment>} The created comment
 * @throws {Error} If adding the comment fails
 */
export const addWorkItemComment = async ({ workItemId, text, }) => {
    const projectId = getProjectName();
    const webApi = await getWebApi();
    const witApi = await webApi.getWorkItemTrackingApi();
    const comment = await witApi.addComment({ text }, projectId, workItemId);
    return comment;
};
/**
 * Retrieves comments for a work item.
 * @param {GetWorkItemCommentsType} params - The get comments parameters
 * @param {number} params.workItemId - The ID of the work item to get comments for
 * @param {number} [params.top] - Maximum number of comments to return
 * @returns {Promise<CommentList>} List of comments for the work item
 * @throws {Error} If retrieving comments fails
 */
export const getWorkItemComments = async ({ workItemId, top, }) => {
    const projectId = getProjectName();
    const webApi = await getWebApi();
    const witApi = await webApi.getWorkItemTrackingApi();
    const comments = await witApi.getComments(projectId, workItemId, top);
    return comments;
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
export const getWorkItemRevisions = async ({ id, top, skip, }) => {
    const projectId = getProjectName();
    const webApi = await getWebApi();
    const witApi = await webApi.getWorkItemTrackingApi();
    const revisions = await witApi.getRevisions(id, top, skip, undefined, projectId);
    return revisions;
};
/**
 * Retrieves available work item types for a project.
 * @param {GetWorkItemTypesType} [params={}] - The get work item types parameters
 * @param {string} [params.project] - The project name (defaults to the configured project)
 * @returns {Promise<WorkItemType[]>} Array of work item types
 * @throws {Error} If retrieving work item types fails
 */
export const getWorkItemTypes = async ({ project, } = {}) => {
    const projectId = project || getProjectName();
    const webApi = await getWebApi();
    const witApi = await webApi.getWorkItemTrackingApi();
    const workItemTypes = await witApi.getWorkItemTypes(projectId);
    return workItemTypes;
};
