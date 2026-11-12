# BONDING — হৃদয়ের বন্ধন

BONDING v0.4 UI update.

## এই সংস্করণে
- Facebook-inspired mobile layout refresh.
- পাঁচটি bottom navigation: হোম, বন্ধু, চ্যাট, সেটিংস, প্রোফাইল.
- বন্ধু অনুসন্ধান, friend requests এবং friends list আলাদা Friends পেজে.
- Chat list আলাদা Chats পেজে; conversation flow আগের মতো.
- Profile editing, profile photo এবং cover photo আগের Firebase/Cloudinary implementation-এ রাখা হয়েছে.
- Settings পেজে verification request, language, logout এবং developer information.
- ছয়টি accent palette: Ocean Blue, Emerald, Royal Purple, Rose, Sunset, Midnight.
- Floating Tanim AI launcher UI. এই সংস্করণে AI backend/উত্তর জেনারেশন যুক্ত নয়; সেটি পরবর্তী ধাপ.

## গুরুত্বপূর্ণ
- Firebase project/config আগের `bonding-1aab9`-ই রাখা হয়েছে.
- Cloudinary cloud name এবং unsigned preset আগের মতো রাখা হয়েছে.
- Firestore schema/rules এই UI সংস্করণে পরিবর্তন করা হয়নি; নতুন rules publish করার দরকার নেই.
- আগের Firebase Authentication account ও Firestore data মুছবেন না.

## GitHub-এ আপডেট
ZIP Extract করে `BONDING-main` ফোল্ডারের ভেতরের ফাইলগুলো repository root-এ upload/replace করুন। `BONDING-main` নামে nested folder তৈরি করবেন না। Commit changes দিন। GitHub Pages আপডেট হলে Ctrl+Shift+R দিয়ে refresh করুন।
