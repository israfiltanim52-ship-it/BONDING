# BONDING — হৃদয়ের বন্ধন ❤️

**Where Hearts Connect.**  
প্রতিষ্ঠাতা ও অ্যাপ নির্মাতা: **ইস্রাফিল তানিম (Israfil Tanim)**

এটি আপনার আপলোড করা Bondhu Chat Web কোডকে ভিত্তি করে তৈরি BONDING-এর প্রাথমিক রূপান্তর। পুরোনো Firebase project `bondhu-chat-b76d6` থেকে এই সংস্করণকে নতুন Firebase project `bonding-1aab9`-এ নির্দেশ করা হয়েছে। পুরোনো Firebase project বা তার ডেটা মুছে ফেলা হয়নি।

## এই সংস্করণে প্রস্তুত
- BONDING নাম, হৃদয়ের বন্ধন পরিচয় এবং নীল-সাদা ব্র্যান্ডিং
- Firebase Email/Password account creation, login, logout ও password reset
- ব্যবহারকারীর প্রাথমিক profile Firestore-এ সংরক্ষণ
- Firestore-এ text post প্রকাশ ও সর্বশেষ ৩০টি পোস্টের live feed
- ইমেইল দিয়ে ব্যবহারকারী খোঁজা এবং one-to-one text chat
- বাংলা/ইংরেজি UI toggle, light/dark theme
- PWA manifest ও service worker
- প্রাথমিক Firestore security rules

## এখনো তৈরি হয়নি
ছবি/ভিডিও পোস্ট, Storage upload, লাইক/কমেন্ট/শেয়ার, friend request/follow, stories/reels, group chat, audio/video call, push notification, marketplace, pages/groups, Tanim AI এবং পূর্ণাঙ্গ admin/moderation panel এখনো এই সংস্করণে নেই। এগুলো পরবর্তী ধাপে তৈরি হবে।

## চালুর আগে Firebase Console-এ করণীয়
1. `bonding-1aab9` project খুলুন।
2. **Authentication → Get started → Sign-in method → Email/Password → Enable → Save** করুন।
3. **Firestore Database** তৈরি করুন। Standard edition ব্যবহার করুন। Scheduled backups আপাতত বন্ধ রাখুন; Blaze billing plan লাগতে পারে।
4. Firestore-এর **Rules** ট্যাবে এই ZIP-এর `firestore.rules` ফাইলের সম্পূর্ণ কোড বসিয়ে **Publish** করুন।
5. Hosting-এ deploy করার পর দুইটি test account খুলে login, text post এবং one-to-one chat পরীক্ষা করুন।

## Deploy
এই ফোল্ডারের ভেতরের ফাইলগুলো Netlify বা অন্য static hosting-এর site root-এ আপলোড করুন। `index.html`, `app.js`, `style.css`, `manifest.json`, `sw.js` একই root-এ থাকতে হবে।

## গুরুত্বপূর্ণ সতর্কতা
- `app.js`-এ নতুন Firebase Web App config বসানো আছে। Web config client app-এ ব্যবহারের জন্য; ডেটার নিরাপত্তা নিশ্চিত করবে Authentication ও Firestore Security Rules।
- Service Account JSON, private key বা password কখনো website-এ রাখবেন না।
- এই build-এ Firebase Storage ব্যবহার করা হয়নি। ছবি/ভিডিও upload পরে আলাদা storage পরিকল্পনা ও খরচ যাচাই করে যোগ করতে হবে।
- পুরোনো Bondhu Chat Firebase project `bondhu-chat-b76d6` মুছবেন না। পুরোনো ব্যবহারকারীর অ্যাকাউন্ট নতুন project-এ স্বয়ংক্রিয়ভাবে স্থানান্তর হয় না।
- Firestore rules publish না করা পর্যন্ত production mode-এর default rules client access বন্ধ রাখবে।
