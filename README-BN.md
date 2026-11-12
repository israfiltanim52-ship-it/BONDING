# BONDING — হৃদয়ের বন্ধন

## Admin Dashboard build
এই build-এ মোবাইল-উপযোগী Admin Dashboard যোগ করা হয়েছে। প্রতিষ্ঠাতা Super Admin; ভবিষ্যতে Admin, Moderator ও Verification Manager নিয়োগ করতে পারবেন।

### নিরাপত্তা ও সেটআপ
- প্রতিষ্ঠাতার UID Firebase Authentication থেকে নিয়ে Firestore `system/adminConfig` ডকুমেন্টে `superAdminUid` হিসেবে একবার সেট করুন।
- `firestore.rules` Firebase Console-এ Publish করুন।
- Founder config client-side write থেকে বন্ধ; admin role পরিবর্তন শুধু Super Admin করতে পারবেন।
- Dashboard অ্যাপের Settings থেকে অনুমোদিত অ্যাকাউন্টে দেখা যাবে; ফোন/কম্পিউটার উভয়েই ব্যবহারযোগ্য।

### বর্তমান ফিচার
- ব্যবহারকারী তালিকা ও সার্চ
- পোস্ট moderation (পোস্ট মুছে ফেলা)
- ভেরিফিকেশন আবেদন অনুমোদন/প্রত্যাখ্যান
- একাধিক Admin/Moderator/Verification Manager নিয়োগ ও পদ বাতিল
- Super Admin-এর জন্য admin action log

### এখনো বাকি
অ্যাকাউন্ট suspend/delete (সার্ভার-সাইড Auth Admin SDK/Cloud Functions প্রয়োজন), রিপোর্টিং workflow, comment moderation UI, advanced analytics, এবং পূর্ণ audit-log viewer।

Firebase project ও Cloudinary configuration অপরিবর্তিত। বিদ্যমান user/post/chat ডেটা migration বা delete করা হয় না।
