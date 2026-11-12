# BONDING — হৃদয়ের বন্ধন ❤️
**Where Hearts Connect.**  
প্রতিষ্ঠাতা ও অ্যাপ নির্মাতা: **ইস্রাফিল তানিম (Israfil Tanim)**

## v0.3-এ যা যুক্ত হয়েছে
- Email/Password account creation, login, logout ও password reset
- Firestore profile: নাম, bio, প্রোফাইল ছবি, কভার ছবি
- Cloudinary unsigned image upload (`y6ujmcob` / `bonding_upload`)
- ইমেইল দিয়ে ব্যবহারকারী খোঁজা
- Friend request পাঠানো, গ্রহণ, প্রত্যাখ্যান ও বাতিল
- বন্ধু তালিকা, চ্যাটে যাওয়া এবং বন্ধু সরানো
- Verification আবেদন; অনুমোদনের পরে verified badge
- Text post feed, reaction, comments, share এবং copy link
- One-to-one text chat
- বাংলা/ইংরেজি, light/dark theme, PWA

## Deploy করার আগে অবশ্যই
1. ZIP extract করে এর ভেতরের সব ফাইল GitHub repository root-এ upload/replace করুন।
2. Firebase Console → `bonding-1aab9` → Firestore Database → Rules খুলুন।
3. এই ZIP-এর `firestore.rules` ফাইলের সম্পূর্ণ কোড Rules editor-এ বসিয়ে **Publish** করুন।
4. GitHub Pages/hosting-এ নতুন ফাইল deploy হওয়ার পর ওয়েবসাইটে `Ctrl + Shift + R` দিন।
5. দুইটি test account দিয়ে profile edit, photo upload, friend request/accept, feed ও chat পরীক্ষা করুন।

## Cloudinary
- Cloud name: `y6ujmcob`
- Upload preset: `bonding_upload`
- Signing mode: Unsigned
- Folder: `bonding`
- App code শুধু JPG, PNG, WebP এবং 5 MB-এর কম ছবি গ্রহণ করে।
- Unsigned preset public endpoint; API Secret কখনো frontend-এ যোগ করবেন না। Cloudinary settings-এ allowed formats এবং max file size সীমাবদ্ধ করা থাকলে সেটি বজায় রাখুন।

## Verification approval
এই build-এ আবেদন জমা ও verified badge দেখানোর ব্যবস্থা আছে; পূর্ণ admin dashboard এখনো নেই।
1. Firebase Console → Firestore → `verificationRequests` collection খুলুন।
2. আবেদনকারীর UID-যুক্ত document যাচাই করুন।
3. অনুমোদন করলে `users/{UID}` document-এ boolean field `verified: true` যোগ করুন।
4. প্রত্যাখ্যান করলে `verificationRequests/{UID}`-এর `status`-কে `rejected` করুন।
এটি Firebase Console-এর মাধ্যমে অ্যাডমিন করবেন; সাধারণ ব্যবহারকারী নিজের verified field পরিবর্তন করতে পারে না।

## গুরুত্বপূর্ণ
- Firebase project `bonding-1aab9`-ই ব্যবহার করা হয়েছে। পুরোনো `bondhu-chat-b76d6` project পরিবর্তন/মুছবেন না।
- Firebase Web config client-side app-এ আছে; নিরাপত্তা নিশ্চিত করতে Firestore Rules Publish করা আবশ্যক।
- Firebase Storage ব্যবহার করা হয়নি; ছবি Cloudinary-তে যায়।
- Audio/video calls, voice messages, groups, stories/reels, push notifications, admin dashboard এবং moderation tools এখনো পরবর্তী ধাপের কাজ।
