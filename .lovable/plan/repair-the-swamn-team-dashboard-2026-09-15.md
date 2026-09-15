# Repair the SWAMN team dashboard

## What will change
- Let signed-in team members read the safe team directory fields needed for names, photos, designations, sharing, and the leaderboard.
- Keep task creation under Aayush's admin controls, improve assignment feedback, and show exact failures instead of silently doing nothing.
- Keep attendance actions visible every day, show the current selection, and allow a member to correct Present or Remote.
- Load identity and directory data separately from Drive files so refresh, preview, download, sharing, and deletion do not unnecessarily reload the whole dashboard.
- Cache downloaded file previews during the session and use separate action loading states so one file action does not block every button.
- Add clear loading, empty, and error states for member lists and dashboard data.

## Technical details
- Add a restricted authenticated directory policy on profiles; no emails or passwords are exposed.
- Refactor the workspace bootstrap and file refresh paths while preserving each member's private Drive folder.
- Update dashboard and admin forms to check database responses and surface useful messages.
- Verify type checking and test the authenticated Aayush dashboard in the browser, including assigning a task, attendance, profile display, and sharing choices.
