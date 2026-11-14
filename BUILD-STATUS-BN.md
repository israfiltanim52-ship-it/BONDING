# BONDING 2.0 — Build Status (বাংলা)

## এই ZIP-এ বাস্তবায়িত
- Founder identity card, education/location details, UID-based Super Admin recognition and Gold Founder badge.
- Founder public avatar loads from the founder's BONDING profile photo.
- Communities page with Public/Private group creation, 3-group ordinary-user limit, public join, private join request, member list count, member text/image posts, like and share link.
- Verification application type: Personal/Blue or Organization/Purple; reviewer approval assigns the corresponding badge type.
- Tanim AI chat UI with text and image input, Firebase ID-token forwarding, server-side Netlify Function scaffold, and no API secret in browser code.
- Updated Firestore rules and service worker cache name.

## এই ZIP-এ এখনো অসম্পূর্ণ
- Private group join request approval/rejection UI; group profile/cover image; group comments; group moderator role controls.
- Full Admin Dashboard 2.0 report center, community controls, advanced analytics, full audit viewer, and server-side account suspension/deletion.
- Chat typing indicator, online presence, voice message, file attachment, pin/mute, and full unread-count workflow.
- Full end-to-end testing against the user's live Firebase/Netlify accounts. This build was syntax-checked locally, but not deployed to the user's services.
- Tanim AI is not live until Netlify Functions are deployed and the required server secrets are configured.

## Local checks
- `app.js`: Node syntax check passed.
- `netlify/functions/tanim-ai.mjs`: Node syntax check passed.
- HTML duplicate-ID scan: no duplicate IDs found.
- Firestore Rules still need publishing and testing in Firebase Console / Rules Playground.
