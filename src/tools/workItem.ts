import {
  JsonPatchDocument,
  Operation,
} from "azure-devops-node-api/interfaces/common/VSSInterfaces.js";
import { getProjectName, getWebApi } from "../client.js";
import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces.js";

export type CreateWorkItemType = {
  title: string;
  type: string;
  assignedTo?: string;
  fields?: Record<string, any>;
};

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
