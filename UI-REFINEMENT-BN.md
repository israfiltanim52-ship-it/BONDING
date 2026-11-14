# BONDING — UI Refinement Update

## Changes in this build
1. Home: removed the Recent Chats block and the inactive Calling is coming notice. Chats remain on the Chat page.
2. Friends: grouped existing user directory, incoming requests, sent requests, and friends list into four tabs. Existing data element IDs are preserved.
3. Chat: removed the non-functional Your Note strip and Channels tab/placeholder. The Requests shortcut now navigates to Friends. New Chat directory is collapsed by default and expands from the compose button.
4. Settings: clarified that the separate mode toggle changes Dark/Light appearance, while the six-color palette changes accent theme.
5. Service worker cache name bumped so deployed clients can fetch the new UI.

## Safety / validation
- Existing Firebase collections and user data are not migrated or deleted by these UI changes.
- Existing data target IDs for friend lists and chat directory are preserved.
- `node --check app.js` passed.
- Duplicate HTML IDs check passed.
- No Firebase Rules were changed in this UI-only update.
- This archive has not been deployed to GitHub Pages or tested against the live Firebase project yet.
