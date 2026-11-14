# BONDING 2.0 — হৃদয়ের বন্ধন

এই ZIP হলো BONDING 2.0 Foundation Build। আগের Firebase Authentication, Feed, Friends, Stories, Direct Chat ও Admin Dashboard ধরে রেখে Founder পরিচয়, Communities-এর প্রাথমিক কার্যকর ব্যবস্থা, Verification badge type এবং Tanim AI-এর নিরাপদ সার্ভার-সাইড integration scaffold যুক্ত করা হয়েছে।

## এই প্যাকেজে যা যুক্ত/আপডেট হয়েছে
- Founder পরিচিতি: ইস্রাফিল তানিম, Founder & Super Admin, পিরোজপুর ফাজিল (ডিগ্রি) মাদরাসা, আলিম দ্বিতীয় বর্ষ, পিরোজপুর, বাংলাদেশ।
- Gold Founder badge কেবল Firebase `system/adminConfig.superAdminUid`-এর UID মিলে গেলে দেখায়। Founder-এর ছবি তাঁর নিজের BONDING profile photo থেকে নেওয়া হয়।
- Communities: Public/Private group তৈরি, সাধারণ সদস্যের জন্য ৩টি group limit, public join, private join request, সদস্যদের text/image post, like ও share link।
- Verification: Personal Blue Verified এবং Organization Purple Official আবেদন শ্রেণি। Gold Founder পরিচয় Super Admin UID-নির্ভর।
- Tanim AI: বাংলা/ইংরেজি text assistant ও image input-এর UI; Netlify Function-এ Firebase ID token যাচাই করে OpenAI Responses API কল করার server scaffold।
- Service worker cache version update।

## এখনো সম্পূর্ণ নয় / বাইরের সেটআপ দরকার
- Tanim AI বাস্তবে চালু করতে Netlify Functions deploy এবং `OPENAI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT_JSON` secret যোগ করতে হবে। AI API ব্যবহারে খরচ হতে পারে। GitHub Pages একা Netlify Function চালাতে পারে না।
- Founder profile photo এই ZIP-এ নেই; প্রতিষ্ঠাতার BONDING account থেকে profile photo upload করতে হবে।
- Private group join request approve/reject UI, full group moderator tools, group comments, reports workflow এবং advanced analytics এখনো অসম্পূর্ণ।
- Chat-এর বিদ্যমান text/image/video path বজায় আছে; typing indicator, online presence, voice message, file attachment, pin/mute এবং পূর্ণ unread controls এই build-এ সম্পূর্ণ বাস্তবায়িত নয়। Video Stories আগের সিদ্ধান্ত অনুযায়ী নেই।
- Admin Dashboard-এ আগের user/post/verification/role tools আছে; full report center, advanced analytics, Auth account suspension/deletion এবং complete audit viewer-এর জন্য server-side functions ও অতিরিক্ত কাজ লাগবে।
- Firebase Rules প্রকাশ না করলে Communities/Verification-এর নতুন অংশ কাজ করবে না।

## প্রকাশের আগে
1. `BONDING-main` ফোল্ডারের ভেতরের সব ফাইল GitHub repository root-এ upload/replace করুন।
2. Firebase Console → Firestore Database → Rules-এ এই ZIP-এর `firestore.rules` সম্পূর্ণ বসিয়ে Publish করুন।
3. Firebase Console → Authentication → Users থেকে প্রতিষ্ঠাতার UID নিয়ে Firestore `system/adminConfig` ডকুমেন্টে `superAdminUid` field নিশ্চিত করুন। আগের সেটিং থাকলে পরিবর্তন করবেন না।
4. Founder account-এ login করে profile photo upload করুন।
5. AI চালাতে Netlify-তে এই repository deploy করুন এবং নিচের Environment Variables যোগ করুন:
   - `OPENAI_API_KEY` = OpenAI API key (secret; browser code-এ দেবেন না)
   - `FIREBASE_SERVICE_ACCOUNT_JSON` = Firebase Admin service account JSON-এর সম্পূর্ণ JSON string (secret)
   - `OPENAI_MODEL` = ঐচ্ছিক; default `gpt-4.1-mini`
6. Netlify deploy সম্পন্ন হলে AI panel থেকে text ও image prompt পরীক্ষা করুন।

## নিরাপত্তা
- Firebase web config-এর API key frontend-এ থাকলেও সেটি Firebase security rules-এর বিকল্প নয়।
- OpenAI key বা Firebase service account JSON কখনো GitHub-এ commit করবেন না এবং কাউকে chat-এ পাঠাবেন না।
- Service account key তৈরি/সংরক্ষণে project owner-এর অনুমতি ও নিরাপদ সংরক্ষণ জরুরি।
- প্রথমবার Super Admin সেটআপ Firebase Console থেকে project owner করবেন।
- পুরোনো user/post/chat data delete বা migrate করা হয় না।
