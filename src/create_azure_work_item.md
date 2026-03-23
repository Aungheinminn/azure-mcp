---
name: create-azure-workitem
description:  Automated Azure DevOps Logging from Git Changes
license: MIT
compatibility: opencode
---

## 1. Source Data & Filtering
- **Primary Source:** Git Patch/Diff of commits in the specified branch.
- **Author Filter:** Only process changes where Author is `author name&email`.
- **Constraint:** Do NOT use the Git commit message as the Work Item Title. Use only the code diff.

## 2. AI Content Generation (From Code Only)
Analyze the raw code changes to generate:
- **Title Formatting:** `[REPO-NAME-UPPERCASE] Concise Title`
  - *Example:* `[JWT-API] Implement JWT Refresh Logic`
- **Description:** A technical breakdown of the files modified and the logic implemented.
- **Effort:** Numeric value (1, 2, 3, 5, 8) based on complexity.

## 3. Standardized Fields
- **AssignedTo:** `author email`
- **State:** Done
- **Area:** `area name`
- **Iteration:** Call `getCurrentIteration` to set the iteration path  (Example Format: `add actual iteration name`)
- **Priority:** 2

## 4. Execution Workflow
For each logical group of changes found in the diff:
1. **Create PBI:** Use the formatted Title (with Repo tag) and Description.
2. **Create Task:** Use the identical formatted Title and Description.
3. **Link:** Call `updateLinkToWorkItem` to set the PBI as the **Parent** of the Task.
