# Archive project: current behaviour and proposal

Owner: Projects squad. Status: proposal, not built.

## How it works today

- Every project card has an overflow menu with **Archive project**.
- Clicking it archives the project straight away. No dialog.
- The project leaves the Active tab and appears in the **Archived** tab.
- Archived projects are read-only. Tasks, files, comments and member access are all kept.
- Any project admin can open the Archived tab and click **Restore**. The project returns to Active exactly as it was. There is no time limit on restoring.
- After archiving, a toast reads "Project archived" with an Undo button for 6 seconds. Undo does the same thing as Restore.
- Archiving does not change billing. Seats are per member, not per project.

## Delete forever (already shipped, shown for context)

- Only available from the Archived tab, admins only.
- Opens a dialog titled "Delete Riverside Fit-out forever?" using the project's own name.
- Body: "This removes 214 tasks, 61 files and all comments for all 14 members. This cannot be undone."
- The admin types the project name to enable the **Delete project** button. The other button is **Keep project**.
- Deleted projects cannot be recovered by support.

## The proposal

Support logged 9 tickets last quarter from people who archived a project by accident and did not know where it went. All 9 were resolved by pointing the person at the Archived tab.

Proposed change:

1. Add a confirm dialog to Archive project: "Are you sure you want to archive this project?" with OK and Cancel.
2. For projects with more than 50 tasks, also require typing the project name, the same as Delete forever.

## Question for design

Do we need the confirm dialog on Archive, and is the typed step worth adding for big projects?
