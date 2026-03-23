# azure-mcp

MCP server for Azure DevOps. Lets AI assistants interact with your Azure DevOps work items and pull requests.

## What it does

Connects MCP clients (like Claude Desktop or OpenCode) to Azure DevOps so you can:
- Create/manage work items
- Handle pull requests
- Add comments
- Query stuff with WIQL
- Manage sprint iterations

## Setup

Set these env vars:
```bash
AZURE_DEVOPS_SERVER_URL=https://dev.azure.com/your-org
AZURE_DEVOPS_PAT=your-personal-access-token
AZURE_DEVOPS_PROJECT_NAME=your-project
AZURE_DEVOPS_ORGANIZATION_NAME=your-org
```

Then build:
```bash
npm install
npm run build
```

## Available Tools

### Work Items
- `create_workitem` - Create tasks/bugs/user stories
- `get_workitem` / `get_workitems` - Get by ID(s)
- `update_workitem` - Update title/state/assignment
- `update_workitem_link` - Link items (Parent/Child/Related/etc)
- `query_workitems` - WIQL queries
- `add_workitem_comment` / `get_workitem_comments` - Comments
- `get_workitem_revisions` - Change history
- `get_workitem_types` - List work item types

### Iterations
- `get_current_iteration` - Get the current sprint iteration
- `get_iterations` - Get all iterations (past, current, future)

### Pull Requests
- `create_pullrequest` - Create PRs
- `get_pullrequest` / `list_pullrequests` - Get PRs
- `update_pullrequest` - Update title/description/status
- `create_pullrequest_thread` / `get_pullrequest_threads` - PR comments
- `add_pullrequest_reviewer` / `get_pullrequest_reviewers` - Reviewers
- `get_pullrequest_status` - Check build/branch policies


