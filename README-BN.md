# BONDING — হৃদয়ের বন্ধন

BONDING v0.5 directory and assistant UI update.

## এই সংস্করণে
- Facebook-inspired mobile layout refresh.
- পাঁচটি bottom navigation: হোম, বন্ধু, চ্যাট, সেটিংস, প্রোফাইল.
- বন্ধু অনুসন্ধান, friend requests এবং friends list আলাদা Friends পেজে.
- Friends ও Chats—দুই পেজেই সব নিবন্ধিত ব্যবহারকারীর searchable directory যোগ করা হয়েছে।
- ডিরেক্টরি থেকে friend request পাঠানো/গ্রহণ এবং সরাসরি নতুন chat শুরু করা যায়।
- Tanim AI প্যানেলে Project Assistant ও Personal Assistant-এর পৃথক পরিচিতি যোগ করা হয়েছে; AI backend এখনো সংযুক্ত নয়।
- Profile editing, profile photo এবং cover photo আগের Firebase/Cloudinary implementation-এ রাখা হয়েছে.
- Settings পেজে verification request, language, logout এবং developer information.
- ছয়টি accent palette: Ocean Blue, Emerald, Royal Purple, Rose, Sunset, Midnight.
- Floating Tanim AI launcher UI. AI উত্তর তৈরি করতে নিরাপদ server-side model integration এখনো প্রয়োজন।

## গুরুত্বপূর্ণ
- Firebase project/config আগের `bonding-1aab9`-ই রাখা হয়েছে.
- Cloudinary cloud name এবং unsigned preset আগের মতো রাখা হয়েছে.
- Firestore schema/rules এই UI সংস্করণে পরিবর্তন করা হয়নি; নতুন rules publish করার দরকার নেই.
- আগের Firebase Authentication account ও Firestore data মুছবেন না.

## GitHub-এ আপডেট
ZIP Extract করে `BONDING-main` ফোল্ডারের ভেতরের ফাইলগুলো repository root-এ upload/replace করুন। `BONDING-main` নামে nested folder তৈরি করবেন না। Commit changes দিন। GitHub Pages আপডেট হলে Ctrl+Shift+R দিয়ে refresh করুন।
