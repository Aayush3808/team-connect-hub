# SWAMN Layout and Private Member Files

## Page updates
- Move the photo gallery and the three-phase prototype-to-fleet roadmap higher on the homepage.
- Remove the Algae-to-Value Chain, commercial throughput figures, and competitive comparison blocks shown in the screenshots.
- Update Aggregation Bot pricing to ₹60k–70k for rivers/lakes and ₹2 Lakh for the ocean variant.
- Combine “The river funds its own cleanup” and “Built to actually pay for itself” into one Impact & Commercial Viability heading and remove the duplicate heading.
- Place Recognition & Achievements near the end, followed by Team, with Future Scope last among these sections.
- Update roles:
  - Vaibhav Raj — Electronics, Mechanics & Website
  - Manan — Mechatronics & Documentation
  - Annapurna — Pitching & Presentation

## Private team login
- Add a Team Login action in the top navigation and a dedicated sign-in page.
- Use username-only accounts with secure passwords and no public registration.
- Store a protected member profile for each account, including username, display name, and assigned Drive folder.
- Keep roles in the existing separate roles table; do not store authorization roles in profiles.
- Add signed-in and signed-out states, logout, invalid-login feedback, and route protection.
- Because username-only accounts use internal synthetic email addresses, email password reset will not be available.

## Google Drive member workspace
- Link one workspace-owned Google Drive account to the project.
- Add a private member files page where each signed-in member can list, upload, download, and delete files only inside their assigned Drive folder.
- Make Drive requests from protected server functions; credentials and folder IDs never reach the browser.
- Validate every request against the signed-in member’s protected profile before accessing Drive.
- Initially show a clear “folder not assigned” state until the Drive account and each member folder are provided.

## Technical details
- Add a protected `profiles` table linked to the authentication user, with unique normalized usernames and member-owned read access.
- Add an automatic profile-creation path compatible with the username-only login model.
- Add protected server functions for Drive listing, upload, download, and deletion using the linked Google Drive connection.
- Update routing and navigation without changing the public Join flow.
- Verify desktop/mobile section order, member login protection, and Drive isolation behavior.

## Needed during setup
- Connect the shared Google Drive account through the secure connection card.
- After the Gmail/Drive account is known, assign one Drive folder per member and create their initial credentials securely.
