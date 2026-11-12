
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/* Firebase configuration */
const firebaseConfig = {
  apiKey: "AIzaSyA4aLbJOFA9OjfE8eWAK8AQzvzqspUSk2Y",
  authDomain: "bonding-1aab9.firebaseapp.com",
  projectId: "bonding-1aab9",
  storageBucket: "bonding-1aab9.firebasestorage.app",
  messagingSenderId: "269759206510",
  appId: "1:269759206510:web:fd40df6143dce18297827f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = id => document.getElementById(id);

const state = {
  mode: "login",
  lang: localStorage.getItem("bc-lang") || "bn",
  theme: localStorage.getItem("bc-theme") || "light",
  user: null,
  peer: null,
  unsubscribeMessages: null,
  unsubscribeChats: null,
  unsubscribeFeed: null,
  postUnsubs: []
};

const translations = {
  bn: {
    tagline: "বন্ধুত্বের কথোপকথন",
    authIntro: "নিরাপদে কথা বলুন, বন্ধুত্ব রাখুন কাছাকাছি।",
    login: "লগইন",
    signup: "নতুন অ্যাকাউন্ট",
    displayNameLabel: "আপনার নাম",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    forgot: "পাসওয়ার্ড ভুলে গেছেন?",
    goodToSee: "আবার দেখা হয়ে ভালো লাগছে",
    yourSpace: "আপনার নিজস্ব জগৎ",
    stayConnected: "বন্ধুদের সঙ্গে যুক্ত থাকুন",
    homeDesc: "এক জায়গায় আপনার কথোপকথন ও বন্ধুদের তালিকা।",
    openChats: "চ্যাট খুলুন",
    recentChats: "সাম্প্রতিক চ্যাট",
    seeAll: "সব দেখুন",
    noChats: "এখনো কোনো চ্যাট নেই।",
    comingSoon: "কল ফিচার আসছে",
    comingDesc: "অডিও ও ভিডিও কল পরবর্তী ধাপে যুক্ত হবে।",
    chats: "চ্যাট",
    searchPlaceholder: "বন্ধুর ইমেইল লিখুন",
    search: "খুঁজুন",
    yourChats: "আপনার চ্যাট",
    directChat: "সরাসরি চ্যাট",
    startConversation: "কথোপকথন শুরু করুন।",
    recording: "ভয়েস রেকর্ডিং এখনো যুক্ত করা হয়নি।",
    messagePlaceholder: "মেসেজ লিখুন…",
    voiceHint: "এখানে টেক্সট মেসেজ পাঠাতে পারবেন।",
    calls: "কল",
    callsSoon: "অডিও ও ভিডিও কল শিগগিরই",
    callsSoonDesc: "এই সংস্করণে টেক্সট চ্যাট চালু করা হয়েছে।",
    callHistory: "কলের ইতিহাস",
    noCalls: "এখনো কোনো কল নেই।",
    profile: "প্রোফাইল",
    signedIn: "সাইন ইন করা আছে",
    language: "ভাষা",
    languageDesc: "বাংলা ও ইংরেজি",
    appearance: "থিম",
    appearanceDesc: "কালো-নীল প্রিমিয়াম",
    change: "পরিবর্তন",
    account: "অ্যাকাউন্ট",
    accountDesc: "আপনার অ্যাকাউন্ট থেকে বের হন",
    logout: "লগআউট",
    madeForFriends: "বন্ধুদের জন্য তৈরি",
    home: "হোম"
  },
  en: {
    tagline: "Conversations with friends",
    authIntro: "Talk privately and stay close to your friends.",
    login: "Log in",
    signup: "Create account",
    displayNameLabel: "Your name",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    goodToSee: "Good to see you again",
    yourSpace: "YOUR SPACE",
    stayConnected: "Stay connected with friends",
    homeDesc: "Your conversations and friends in one place.",
    openChats: "Open chats",
    recentChats: "Recent chats",
    seeAll: "See all",
    noChats: "No chats yet.",
    comingSoon: "Calling is coming",
    comingDesc: "Audio and video calls may be added later.",
    chats: "Chats",
    searchPlaceholder: "Enter your friend's email",
    search: "Search",
    yourChats: "Your chats",
    directChat: "Direct chat",
    startConversation: "Start a conversation.",
    recording: "Voice recording is not implemented yet.",
    messagePlaceholder: "Write a message…",
    voiceHint: "Text messaging is available.",
    calls: "Calls",
    callsSoon: "Audio and video calls coming soon",
    callsSoonDesc: "Text chat is available in this version.",
    callHistory: "Call history",
    noCalls: "No calls yet.",
    profile: "Profile",
    signedIn: "Signed in",
    language: "Language",
    languageDesc: "Bangla and English",
    appearance: "Theme",
    appearanceDesc: "Premium dark blue",
    change: "Change",
    account: "Account",
    accountDesc: "Sign out of your account",
    logout: "Log out",
    madeForFriends: "Made for friends",
    home: "Home"
  }
};

function t(key) {
  return translations[state.lang]?.[key] || translations.bn[key] || key;
}

function status(element, message, error = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = error ? "#ff7777" : "";
}

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3500);
}

function readableError(error) {
  const messages = {
    "auth/api-key-not-valid": "Firebase API key অবৈধ বা অনুমোদিত নয়। Firebase Console-এ Web App config ও API key পরীক্ষা করুন।",
    "auth/invalid-api-key": "Firebase API key সঠিক নয়।",
    "auth/invalid-credential": "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।",
    "auth/invalid-email": "সঠিক ইমেইল লিখুন।",
    "auth/email-already-in-use": "এই ইমেইলে অ্যাকাউন্ট আছে। লগইন করুন।",
    "auth/weak-password": "আরও শক্তিশালী পাসওয়ার্ড দিন।",
    "auth/user-not-found": "এই ইমেইলে অ্যাকাউন্ট পাওয়া যায়নি।",
    "auth/wrong-password": "পাসওয়ার্ড সঠিক নয়।",
    "auth/too-many-requests": "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে চেষ্টা করুন।",
    "auth/network-request-failed": "ইন্টারনেট সংযোগ পরীক্ষা করুন।",
    "permission-denied": "Firebase Firestore Rules অনুমতি দিচ্ছে না।",
    "unavailable": "Firebase সার্ভারে সংযোগ হচ্ছে না। পরে চেষ্টা করুন।"
  };

  return messages[error.code] ||
    `${error.code || "error"}: ${error.message || "কাজটি সম্পন্ন হয়নি।"}`;
}

function applyLanguage() {
  document.documentElement.lang = state.lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[state.lang][key]) {
      el.textContent = translations[state.lang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[state.lang][key]) {
      el.placeholder = translations[state.lang][key];
    }
  });

  if ($("langToggle")) {
    $("langToggle").textContent = state.lang === "bn" ? "বাং" : "EN";
  }

  if ($("langToggle2")) {
    $("langToggle2").textContent = state.lang === "bn" ? "বাংলা / EN" : "EN / বাংলা";
  }

  if ($("loginMode")) {
    $("loginMode").classList.toggle("active", state.mode === "login");
  }

  if ($("signupMode")) {
    $("signupMode").classList.toggle("active", state.mode === "signup");
  }

  if ($("authSubmit")) {
    $("authSubmit").textContent = t(state.mode);
  }

  if ($("nameLabel")) {
    $("nameLabel").classList.toggle("hidden", state.mode !== "signup");
  }

  if ($("displayName")) {
    $("displayName").classList.toggle("hidden", state.mode !== "signup");
    $("displayName").required = state.mode === "signup";
  }

  if ($("password")) {
    $("password").autocomplete =
      state.mode === "signup" ? "new-password" : "current-password";
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.body.dataset.theme = state.theme;
  document.documentElement.classList.toggle("light-theme", state.theme === "light");
  document.body.classList.toggle("light-theme", state.theme === "light");
  localStorage.setItem("bc-theme", state.theme);
}

function showSignedInView(user) {
  $("authView")?.classList.add("hidden");
  $("appView")?.classList.remove("hidden");
  $("bottomNav")?.classList.remove("hidden");

  const name = user.displayName || user.email?.split("@")[0] || "বন্ধু";
  if ($("welcomeTitle")) $("welcomeTitle").textContent = `হ্যালো, ${name}!`;
  if ($("profileName")) $("profileName").textContent = name;
  if ($("profileEmail")) $("profileEmail").textContent = user.email || "";

  ["homeAvatar", "chatAvatar", "profileAvatar"].forEach(id => {
    if ($(id)) $(id).textContent = name.charAt(0).toUpperCase();
  });
}

function showSignedOutView() {
  $("authView")?.classList.remove("hidden");
  $("appView")?.classList.add("hidden");
  $("bottomNav")?.classList.add("hidden");
}

async function ensureUserProfile(user, displayName = "") {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  const name = displayName || user.displayName || user.email?.split("@")[0] || "বন্ধু";

  await setDoc(userRef, {
    uid: user.uid,
    name,
    email: user.email || "",
    updatedAt: serverTimestamp(),
    ...(snapshot.exists() ? {} : { createdAt: serverTimestamp() })
  }, { merge: true });
}

async function submitAuth(event) {
  event.preventDefault();

  const email = $("email")?.value.trim().toLowerCase();
  const password = $("password")?.value || "";
  const displayName = $("displayName")?.value.trim() || "";
  const submitButton = $("authSubmit");

  if (!email || !password) {
    status($("authMessage"), "ইমেইল ও পাসওয়ার্ড লিখুন।", true);
    return;
  }

  if (state.mode === "signup" && !displayName) {
    status($("authMessage"), "আপনার নাম লিখুন।", true);
    return;
  }

  submitButton.disabled = true;
  status($("authMessage"), "");

  try {
    if (state.mode === "signup") {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });
      await ensureUserProfile(credential.user, displayName);
    } else {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserProfile(credential.user);
    }
  } catch (error) {
    console.error("Authentication error:", error.code, error.message);
    status($("authMessage"), readableError(error), true);
  } finally {
    submitButton.disabled = false;
  }
}

async function resetPassword() {
  const email = $("email")?.value.trim().toLowerCase();

  if (!email) {
    status($("authMessage"), "আগে ইমেইল লিখুন।", true);
    $("email")?.focus();
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    status($("authMessage"), "পাসওয়ার্ড রিসেটের নির্দেশনা ইমেইলে পাঠানো হয়েছে।");
  } catch (error) {
    console.error("Password reset error:", error);
    status($("authMessage"), readableError(error), true);
  }
}

function openPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("active", page.id === pageId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId || button.dataset.go === pageId);
    button.setAttribute("aria-current", (button.dataset.page === pageId || button.dataset.go === pageId) ? "page" : "false");
  });
}

function chatIdFor(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}

async function searchFriend() {
  const email = $("userSearch")?.value.trim().toLowerCase();
  status($("searchMessage"), "");
  $("searchResults").replaceChildren();

  if (!email) {
    status($("searchMessage"), "বন্ধুর ইমেইল লিখুন।", true);
    return;
  }

  if (email === state.user.email?.toLowerCase()) {
    status($("searchMessage"), "নিজেকে বন্ধু হিসেবে যোগ করা যাবে না.", true);
    return;
  }

  try {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    const results = await getDocs(usersQuery);
    const friend = results.docs.find(item => item.id !== state.user.uid);

    if (!friend) {
      status($("searchMessage"), "এই ইমেইলে কোনো ব্যবহারকারী পাওয়া যায়নি।", true);
      return;
    }

    const userData = friend.data();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-result";
    button.textContent = `${userData.name || "বন্ধু"} (${userData.email})`;
    button.addEventListener("click", () => openConversation({
      uid: friend.id,
      name: userData.name || "বন্ধু",
      email: userData.email || ""
    }));

    $("searchResults").append(button);
  } catch (error) {
    console.error("User search error:", error);
    status($("searchMessage"), readableError(error), true);
  }
}

async function openConversation(peer) {
  if (!state.user || !peer?.uid || peer.uid === state.user.uid) return;

  state.peer = peer;
  openPage("conversationPage");

  if ($("peerName")) $("peerName").textContent = peer.name;
  if ($("peerAvatar")) $("peerAvatar").textContent = peer.name.charAt(0).toUpperCase();
  if ($("messages")) $("messages").replaceChildren();

  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = t("startConversation");
  $("messages").append(empty);

  if (state.unsubscribeMessages) state.unsubscribeMessages();

  const id = chatIdFor(state.user.uid, peer.uid);
  const chatRef = doc(db, "chats", id);

  try {
    await setDoc(chatRef, {
      members: [state.user.uid, peer.uid].sort(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    const messagesQuery = query(
      collection(db, "chats", id, "messages"),
      orderBy("createdAt", "asc")
    );

    state.unsubscribeMessages = onSnapshot(messagesQuery, snapshot => {
      const container = $("messages");
      container.replaceChildren();

      if (snapshot.empty) {
        const message = document.createElement("div");
        message.className = "empty-state";
        message.textContent = t("startConversation");
        container.append(message);
        return;
      }

      snapshot.forEach(item => {
        const data = item.data();
        const bubble = document.createElement("div");
        bubble.className = data.senderId === state.user.uid ? "message mine" : "message";

        const text = document.createElement("div");
        text.textContent = data.text || "";
        bubble.append(text);

        const time = document.createElement("small");
        time.className = "msg-meta";
        if (data.createdAt?.toDate) {
          time.textContent = data.createdAt.toDate().toLocaleTimeString(
            state.lang === "bn" ? "bn-BD" : "en-US",
            { hour: "2-digit", minute: "2-digit" }
          );
        }
        bubble.append(time);
        container.append(bubble);
      });

      container.scrollTop = container.scrollHeight;
    }, error => {
      console.error("Messages listener error:", error);
      showToast(readableError(error));
    });
  } catch (error) {
    console.error("Open conversation error:", error);
    showToast(readableError(error));
  }
}

async function sendMessage(event) {
  event.preventDefault();

  const input = $("messageInput");
  const text = input?.value.trim();

  if (!text || !state.user || !state.peer) {
    if (!state.peer) showToast("আগে একজন বন্ধুর চ্যাট খুলুন।");
    return;
  }

  const button = $("sendBtn");
  button.disabled = true;

  try {
    const id = chatIdFor(state.user.uid, state.peer.uid);
    await addDoc(collection(db, "chats", id, "messages"), {
      text,
      senderId: state.user.uid,
      senderName: state.user.displayName || state.user.email,
      createdAt: serverTimestamp()
    });

    await setDoc(doc(db, "chats", id), {
      members: [state.user.uid, state.peer.uid].sort(),
      lastMessage: text,
      updatedAt: serverTimestamp()
    }, { merge: true });

    input.value = "";
  } catch (error) {
    console.error("Send message error:", error);
    showToast(readableError(error));
  } finally {
    button.disabled = false;
  }
}

function listenToChats(user) {
  if (state.unsubscribeChats) state.unsubscribeChats();

  const chatsQuery = query(
    collection(db, "chats"),
    where("members", "array-contains", user.uid)
  );

  state.unsubscribeChats = onSnapshot(chatsQuery, async snapshot => {
    const lists = [$("chatList"), $("homeRecent")].filter(Boolean);

    for (const list of lists) list.replaceChildren();

    if (snapshot.empty) {
      lists.forEach(list => {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = t("noChats");
        list.append(empty);
      });
      return;
    }

    const rows = await Promise.all(snapshot.docs.map(async item => {
      const data = item.data();
      const peerUid = (data.members || []).find(uid => uid !== user.uid);
      if (!peerUid) return null;

      const peerSnapshot = await getDoc(doc(db, "users", peerUid));
      const peerData = peerSnapshot.exists() ? peerSnapshot.data() : {};

      return {
        uid: peerUid,
        name: peerData.name || peerData.email || "বন্ধু",
        email: peerData.email || "",
        lastMessage: data.lastMessage || ""
      };
    }));

    rows.filter(Boolean).forEach(peer => {
      lists.forEach(list => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chat-item";

        const name = document.createElement("strong");
        name.textContent = peer.name;

        const last = document.createElement("small");
        last.textContent = peer.lastMessage || peer.email;

        button.append(name, last);
        button.addEventListener("click", () => openConversation(peer));
        list.append(button);
      });
    });
  }, error => {
    console.error("Chat list error:", error);
    showToast(readableError(error));
  });
}

/* BONDING social feed: text posts are stored in Cloud Firestore. */
async function publishPost(event) {
  event.preventDefault();
  const input = $("postText");
  const text = input?.value.trim();
  if (!state.user) return showToast("পোস্ট করতে আগে লগইন করুন।");
  if (!text) return status($("postMessage"), "পোস্টের লেখা লিখুন।", true);

  const button = $("publishPost");
  if (button) button.disabled = true;
  status($("postMessage"), "পোস্ট প্রকাশ হচ্ছে…");
  try {
    await addDoc(collection(db, "posts"), {
      authorId: state.user.uid,
      authorName: state.user.displayName || state.user.email?.split("@")[0] || "BONDING ব্যবহারকারী",
      text,
      createdAt: serverTimestamp()
    });
    input.value = "";
    status($("postMessage"), "আপনার পোস্ট প্রকাশিত হয়েছে।");
  } catch (error) {
    console.error("Publish post error:", error);
    status($("postMessage"), readableError(error), true);
  } finally {
    if (button) button.disabled = false;
  }
}

function stopPostListeners() {
  state.postUnsubs.forEach(unsub => { try { unsub(); } catch (_) {} });
  state.postUnsubs = [];
}

async function togglePostReaction(postId, button) {
  if (!state.user) return showToast("রিঅ্যাক্ট করতে আগে লগইন করুন।");
  const reactionRef = doc(db, "posts", postId, "reactions", state.user.uid);
  try {
    const existing = await getDoc(reactionRef);
    if (existing.exists()) await deleteDoc(reactionRef);
    else await setDoc(reactionRef, {
      uid: state.user.uid,
      type: "like",
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Reaction error:", error);
    showToast(readableError(error));
  }
}

async function copyPostLink(postId) {
  const link = `${location.origin}${location.pathname}#post-${postId}`;
  try {
    if (navigator.share) await navigator.share({ title: "BONDING পোস্ট", url: link });
    else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(link);
      showToast("পোস্টের লিংক কপি হয়েছে।");
    } else {
      window.prompt("পোস্টের লিংক কপি করুন:", link);
    }
  } catch (error) {
    if (error?.name !== "AbortError") {
      try { window.prompt("পোস্টের লিংক কপি করুন:", link); }
      catch (_) { showToast("লিংক কপি করা যায়নি।"); }
    }
  }
}

function loadPostComments(postId, panel, list) {
  const commentsQuery = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc"), limit(50)
  );
  const unsub = onSnapshot(commentsQuery, snapshot => {
    list.replaceChildren();
    if (snapshot.empty) {
      const empty = document.createElement("p");
      empty.className = "comment-empty";
      empty.textContent = "এখনো কোনো মন্তব্য নেই।";
      list.append(empty);
      return;
    }
    snapshot.forEach(item => {
      const data = item.data();
      const row = document.createElement("div");
      row.className = "comment-item";
      const author = document.createElement("strong");
      author.textContent = data.authorName || "ব্যবহারকারী";
      const text = document.createElement("p");
      text.textContent = data.text || "";
      row.append(author, text);
      list.append(row);
    });
  }, error => showToast(readableError(error)));
  state.postUnsubs.push(unsub);
}

async function addPostComment(postId, input, button) {
  const text = input.value.trim();
  if (!text) return showToast("মন্তব্য লিখুন।");
  if (text.length > 1000) return showToast("মন্তব্য ১০০০ অক্ষরের মধ্যে রাখুন।");
  button.disabled = true;
  try {
    await addDoc(collection(db, "posts", postId, "comments"), {
      uid: state.user.uid,
      authorName: state.user.displayName || state.user.email?.split("@")[0] || "BONDING ব্যবহারকারী",
      text,
      createdAt: serverTimestamp()
    });
    input.value = "";
  } catch (error) {
    console.error("Comment error:", error);
    showToast(readableError(error));
  } finally { button.disabled = false; }
}

function listenToFeed() {
  if (state.unsubscribeFeed) state.unsubscribeFeed();
  stopPostListeners();
  const feedQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(30));
  state.unsubscribeFeed = onSnapshot(feedQuery, snapshot => {
    const feed = $("feedList");
    if (!feed) return;
    stopPostListeners();
    feed.replaceChildren();
    if (snapshot.empty) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "এখনো কোনো পোস্ট নেই। প্রথম পোস্টটি আপনিই করুন!";
      feed.append(empty);
      return;
    }
    snapshot.forEach(item => {
      const postId = item.id;
      const post = item.data();
      const card = document.createElement("article");
      card.className = "post-card";
      card.id = `post-${postId}`;
      const head = document.createElement("div");
      head.className = "post-head";
      const avatar = document.createElement("div");
      avatar.className = "avatar small";
      avatar.textContent = (post.authorName || "B").trim().charAt(0).toUpperCase();
      const meta = document.createElement("div");
      meta.className = "post-author";
      const name = document.createElement("strong");
      name.textContent = post.authorName || "BONDING ব্যবহারকারী";
      const date = document.createElement("small");
      date.textContent = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString("bn-BD") : "এইমাত্র";
      meta.append(name, date);
      head.append(avatar, meta);
      const body = document.createElement("p");
      body.className = "post-body";
      body.textContent = post.text || "";
      card.append(head, body);

      const stats = document.createElement("div");
      stats.className = "post-stats";
      const reactionCount = document.createElement("span");
      reactionCount.textContent = "♡ ০";
      const commentCount = document.createElement("span");
      commentCount.textContent = "০ মন্তব্য";
      stats.append(reactionCount, commentCount);
      card.append(stats);

      const actions = document.createElement("div");
      actions.className = "post-actions";
      const likeBtn = document.createElement("button");
      likeBtn.type = "button"; likeBtn.className = "post-action"; likeBtn.textContent = "♡ রিঅ্যাক্ট";
      likeBtn.addEventListener("click", () => togglePostReaction(postId, likeBtn));
      const commentBtn = document.createElement("button");
      commentBtn.type = "button"; commentBtn.className = "post-action"; commentBtn.textContent = "💬 কমেন্ট";
      const shareBtn = document.createElement("button");
      shareBtn.type = "button"; shareBtn.className = "post-action"; shareBtn.textContent = "↗ শেয়ার";
      shareBtn.addEventListener("click", () => copyPostLink(postId));
      const copyBtn = document.createElement("button");
      copyBtn.type = "button"; copyBtn.className = "post-action"; copyBtn.textContent = "🔗 কপি লিংক";
      copyBtn.addEventListener("click", async () => {
        const link = `${location.origin}${location.pathname}#post-${postId}`;
        try { await navigator.clipboard.writeText(link); showToast("পোস্টের লিংক কপি হয়েছে।"); }
        catch (_) { window.prompt("পোস্টের লিংক কপি করুন:", link); }
      });
      actions.append(likeBtn, commentBtn, shareBtn, copyBtn);
      card.append(actions);

      const commentPanel = document.createElement("section");
      commentPanel.className = "comments-panel hidden";
      const commentList = document.createElement("div");
      commentList.className = "comment-list";
      const commentForm = document.createElement("form");
      commentForm.className = "comment-form";
      const commentInput = document.createElement("input");
      commentInput.type = "text"; commentInput.maxLength = 1000; commentInput.placeholder = "মন্তব্য লিখুন…";
      const sendBtn = document.createElement("button");
      sendBtn.type = "submit"; sendBtn.className = "primary-btn"; sendBtn.textContent = "পাঠান";
      commentForm.append(commentInput, sendBtn);
      commentPanel.append(commentList, commentForm);
      card.append(commentPanel);
      let commentsLoaded = false;
      commentBtn.addEventListener("click", () => {
        commentPanel.classList.toggle("hidden");
        if (!commentsLoaded) { loadPostComments(postId, commentPanel, commentList); commentsLoaded = true; }
      });
      commentForm.addEventListener("submit", event => {
        event.preventDefault(); addPostComment(postId, commentInput, sendBtn);
      });

      const reactionQuery = collection(db, "posts", postId, "reactions");
      const reactionUnsub = onSnapshot(reactionQuery, reactionSnap => {
        reactionCount.textContent = `♥ ${reactionSnap.size.toLocaleString("bn-BD")}`;
        const mine = reactionSnap.docs.some(d => d.id === state.user?.uid);
        likeBtn.classList.toggle("is-reacted", mine);
        likeBtn.textContent = mine ? "♥ রিঅ্যাক্ট করেছেন" : "♡ রিঅ্যাক্ট";
      }, error => console.error("Reaction listener:", error));
      state.postUnsubs.push(reactionUnsub);
      const countUnsub = onSnapshot(query(collection(db, "posts", postId, "comments")), snap => {
        commentCount.textContent = `${snap.size.toLocaleString("bn-BD")} মন্তব্য`;
      }, error => console.error("Comment count listener:", error));
      state.postUnsubs.push(countUnsub);

      if (post.authorId === state.user?.uid) {
        const own = document.createElement("small");
        own.className = "post-own-label"; own.textContent = "আপনার পোস্ট";
        card.append(own);
      }
      feed.append(card);
    });
  }, error => {
    console.error("Feed listener error:", error);
    showToast(readableError(error));
  });
}

/* Buttons and forms */
$("authForm")?.addEventListener("submit", submitAuth);
$("resetPassword")?.addEventListener("click", resetPassword);

$("loginMode")?.addEventListener("click", () => {
  state.mode = "login";
  applyLanguage();
  status($("authMessage"), "");
});

$("signupMode")?.addEventListener("click", () => {
  state.mode = "signup";
  applyLanguage();
  status($("authMessage"), "");
});

$("langToggle")?.addEventListener("click", toggleLanguage);
$("langToggle2")?.addEventListener("click", toggleLanguage);
$("themeToggle")?.addEventListener("click", toggleTheme);
$("themeToggle2")?.addEventListener("click", toggleTheme);

function toggleLanguage() {
  state.lang = state.lang === "bn" ? "en" : "bn";
  localStorage.setItem("bc-lang", state.lang);
  applyLanguage();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
}

$("searchBtn")?.addEventListener("click", searchFriend);
$("userSearch")?.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchFriend();
  }
});

$("messageForm")?.addEventListener("submit", sendMessage);
$("postForm")?.addEventListener("submit", publishPost);

$("backToChats")?.addEventListener("click", () => openPage("chatsPage"));

$("voiceBtn")?.addEventListener("click", () => {
  showToast(state.lang === "bn"
    ? "ভয়েস মেসেজ ফিচার পরবর্তী সংস্করণে যোগ করতে হবে।"
    : "Voice messaging is not implemented yet.");
});

$("logoutBtn")?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showToast("লগআউট হয়েছে।");
  } catch (error) {
    showToast(readableError(error));
  }
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => openPage(button.dataset.go));
});

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => openPage(button.dataset.page));
});

/* Restore settings */
applyLanguage();
applyTheme();

/* Keep the UI in sync with Firebase Authentication */
onAuthStateChanged(auth, async user => {
  state.user = user;

  if (!user) {
    if (state.unsubscribeMessages) state.unsubscribeMessages();
    if (state.unsubscribeChats) state.unsubscribeChats();
    if (state.unsubscribeFeed) state.unsubscribeFeed();

    state.unsubscribeMessages = null;
    state.unsubscribeChats = null;
    state.unsubscribeFeed = null;
    state.peer = null;

    showSignedOutView();
    return;
  }

  try {
    await ensureUserProfile(user);
    showSignedInView(user);
    listenToChats(user);
    listenToFeed();
    openPage("homePage");
  } catch (error) {
    console.error("User profile initialization error:", error);
    showSignedInView(user);
    showToast(readableError(error));
  }
});
    

// Register the PWA service worker when served from HTTPS or localhost.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(error => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
