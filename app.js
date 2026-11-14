
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
  updateDoc,
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
  postUnsubs: [],
  adminRole: null,
  isSuperAdmin: false,
  adminUsersCache: [],
  adminPostsCache: [],
  currentCommunity: null,
  founderUid: null
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
    ...(snapshot.exists() ? {} : {
      createdAt: serverTimestamp(), bio: "", photoURL: "", coverURL: "", verified: false
    })
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
  if (pageId === "communitiesPage") renderCommunities();
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
    const result = document.createElement("div");
    result.className = "search-result social-result";
    const identity = document.createElement("div");
    identity.className = "social-identity";
    const avatar = makeAvatar(userData.name || "বন্ধু", userData.photoURL || "");
    const textIdentity = document.createElement("div");
    textIdentity.className = "social-identity-text";
    const title = document.createElement("strong");
    title.textContent = userData.name || "বন্ধু";
    const emailText = document.createElement("small");
    emailText.textContent = userData.email || "";
    textIdentity.append(title, emailText);
    identity.append(avatar, textIdentity);
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "primary-btn";
    addButton.textContent = "বন্ধুত্বের অনুরোধ পাঠান";
    addButton.addEventListener("click", () => sendFriendRequest(friend.id, userData));
    const chatButton = document.createElement("button");
    chatButton.type = "button";
    chatButton.className = "outline-btn";
    chatButton.textContent = "চ্যাট";
    chatButton.addEventListener("click", () => openConversation({
      uid: friend.id, name: userData.name || "বন্ধু", email: userData.email || ""
    }));
    result.append(identity, addButton, chatButton);
    $("searchResults").append(result);
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
        const mine = data.senderId === state.user.uid;
        const bubble = document.createElement("div");
        bubble.className = mine ? "message mine" : "message";

        if (data.mediaUrl && data.mediaType === "image") {
          const media = document.createElement("img");
          media.className = "chat-message-image";
          media.src = data.mediaUrl; media.alt = "পাঠানো ছবি"; media.loading = "lazy";
          bubble.append(media);
        } else if (data.mediaUrl && data.mediaType === "video") {
          const media = document.createElement("video");
          media.className = "chat-message-video";
          media.src = data.mediaUrl; media.controls = true; media.playsInline = true;
          bubble.append(media);
        }
        if (data.text) {
          const text = document.createElement("div");
          text.textContent = data.text;
          bubble.append(text);
        }

        const meta = document.createElement("small");
        meta.className = "msg-meta";
        const timeText = data.createdAt?.toDate
          ? data.createdAt.toDate().toLocaleTimeString(
              state.lang === "bn" ? "bn-BD" : "en-US",
              { hour: "2-digit", minute: "2-digit" }
            )
          : "";
        const receiptText = mine
          ? (data.readAt ? (state.lang === "bn" ? " · দেখা হয়েছে ✓✓" : " · Seen ✓✓")
            : data.deliveredAt ? (state.lang === "bn" ? " · পৌঁছেছে ✓" : " · Delivered ✓")
            : (state.lang === "bn" ? " · পাঠানো হয়েছে ✓" : " · Sent ✓"))
          : "";
        meta.textContent = timeText + receiptText;
        bubble.append(meta);
        container.append(bubble);

        // The recipient's open conversation marks incoming messages delivered and read.
        if (!mine && (!data.deliveredAt || !data.readAt)) {
          updateDoc(item.ref, {
            ...(data.deliveredAt ? {} : { deliveredAt: serverTimestamp() }),
            ...(data.readAt ? {} : { readAt: serverTimestamp() })
          }).catch(error => console.warn("Message receipt update:", error));
        }
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
  const mediaFile = $("chatMediaFile")?.files?.[0] || null;

  if ((!text && !mediaFile) || !state.user || !state.peer) {
    if (!state.peer) showToast("আগে একজন বন্ধুর চ্যাট খুলুন।");
    return;
  }

  const button = $("sendBtn");
  button.disabled = true;

  try {
    const id = chatIdFor(state.user.uid, state.peer.uid);
    let media = null;
    if (mediaFile) {
      showToast("মিডিয়া আপলোড হচ্ছে…");
      media = await uploadBondingMedia(mediaFile);
    }
    await addDoc(collection(db, "chats", id, "messages"), {
      text: text || "",
      ...(media ? { mediaUrl: media.url, mediaType: media.type } : {}),
      senderId: state.user.uid,
      senderName: state.user.displayName || state.user.email,
      createdAt: serverTimestamp()
    });

    await setDoc(doc(db, "chats", id), {
      members: [state.user.uid, state.peer.uid].sort(),
      lastMessage: text || (media?.type === "video" ? "ভিডিও" : "ছবি"),
      updatedAt: serverTimestamp()
    }, { merge: true });

    input.value = "";
    if ($("chatMediaFile")) $("chatMediaFile").value = "";
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
    const lists = [$("chatList")].filter(Boolean);
    for (const list of lists) list.replaceChildren();

    try {
      // Include every accepted friend, even before the first message is sent.
      const [sent, received] = await Promise.all([
        getDocs(query(collection(db, "friendRequests"), where("fromUid", "==", user.uid))),
        getDocs(query(collection(db, "friendRequests"), where("toUid", "==", user.uid)))
      ]);
      const peers = new Map();

      for (const request of [...sent.docs, ...received.docs]) {
        const data = request.data();
        if (data.status !== "accepted") continue;
        const peerUid = data.fromUid === user.uid ? data.toUid : data.fromUid;
        if (!peerUid || peerUid === user.uid) continue;
        peers.set(peerUid, { uid: peerUid, fallbackName: data.fromUid === user.uid ? data.toName : data.fromName });
      }

      // Chat documents add last-message details; friend requests supply the full friend list.
      for (const chatDoc of snapshot.docs) {
        const data = chatDoc.data();
        const peerUid = (data.members || []).find(uid => uid !== user.uid);
        if (!peerUid) continue;
        const existing = peers.get(peerUid) || { uid: peerUid };
        peers.set(peerUid, { ...existing, lastMessage: data.lastMessage || "", updatedAt: data.updatedAt || null });
      }

      const rows = await Promise.all([...peers.values()].map(async peer => {
        const profile = await getPublicProfile(peer.uid).catch(() => ({}));
        return {
          uid: peer.uid,
          name: profile.name || peer.fallbackName || profile.email || "বন্ধু",
          email: profile.email || "",
          photoURL: profile.photoURL || "",
          lastMessage: peer.lastMessage || "এখনো কোনো মেসেজ নেই",
          updatedAt: peer.updatedAt
        };
      }));
      rows.sort((a, b) => {
        const ta = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
        const tb = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
        return tb - ta || a.name.localeCompare(b.name);
      });

      // Populate the horizontal friend strip using real accepted-friend profiles.
      const peopleStrip = $("chatPeopleStrip");
      if (peopleStrip) {
        const note = peopleStrip.querySelector(".dm-person-note");
        peopleStrip.replaceChildren();
        if (note) peopleStrip.append(note);
        rows.slice(0, 20).forEach(peer => {
          const person = document.createElement("button");
          person.type = "button";
          person.className = "dm-person";
          const face = document.createElement("span");
          face.className = "dm-person-avatar";
          if (peer.photoURL) {
            const image = document.createElement("img");
            image.src = peer.photoURL;
            image.alt = "";
            face.append(image);
          } else {
            face.textContent = (peer.name || "বন্ধু").trim().charAt(0).toUpperCase();
          }
          const label = document.createElement("small");
          label.textContent = peer.name;
          person.append(face, label);
          person.addEventListener("click", () => openConversation(peer));
          peopleStrip.append(person);
        });
      }

      if (!rows.length) {
        lists.forEach(list => {
          const empty = document.createElement("div");
          empty.className = "empty-state";
          empty.textContent = "বন্ধু যোগ হলে এখানে দেখা যাবে। বন্ধু বিভাগ থেকে বন্ধু খুঁজুন।";
          list.append(empty);
        });
        return;
      }

      rows.forEach(peer => {
        lists.forEach(list => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "chat-item chat-item-v2";
          const avatar = makeAvatar(peer.name, peer.photoURL, "avatar small chat-list-avatar");
          const details = document.createElement("span");
          details.className = "chat-item-details";
          const name = document.createElement("strong");
          name.textContent = peer.name;
          const last = document.createElement("small");
          last.textContent = peer.lastMessage;
          details.append(name, last);
          const arrow = document.createElement("span");
          arrow.className = "chat-open-icon";
          arrow.setAttribute("aria-hidden", "true");
          arrow.innerHTML = '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>';
          button.append(avatar, details, arrow);
          button.addEventListener("click", () => openConversation(peer));
          list.append(button);
        });
      });
    } catch (error) {
      console.error("Friend chat list error:", error);
      lists.forEach(list => {
        const warning = document.createElement("div");
        warning.className = "empty-state";
        warning.textContent = "বন্ধুদের চ্যাট তালিকা লোড করা যায়নি। Firestore Rules পরীক্ষা করুন।";
        list.append(warning);
      });
    }
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
  const imageFile = $("postImageFile")?.files?.[0] || null;
  if (!text && !imageFile) return status($("postMessage"), "লেখা অথবা একটি ছবি যোগ করুন।", true);

  const button = $("publishPost");
  if (button) button.disabled = true;
  status($("postMessage"), "পোস্ট প্রকাশ হচ্ছে…");
  try {
    let imageURL = "";
    if (imageFile) {
      status($("postMessage"), "ছবি আপলোড হচ্ছে…");
      imageURL = await uploadBondingImage(imageFile);
    }
    await addDoc(collection(db, "posts"), {
      authorId: state.user.uid,
      authorName: state.user.displayName || state.user.email?.split("@")[0] || "BONDING ব্যবহারকারী",
      text,
      ...(imageURL ? { imageURL } : {}),
      createdAt: serverTimestamp()
    });
    input.value = "";
    if ($("postImageFile")) $("postImageFile").value = "";
    if ($("postImagePreview")) $("postImagePreview").classList.add("hidden");
    if ($("postImageName")) $("postImageName").textContent = "ছবি নির্বাচন করা হয়নি";
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
      const avatar = makeAvatar(post.authorName || "B", "");
      if (post.authorId) {
        getPublicProfile(post.authorId).then(profile => {
          if (profile.photoURL && avatar.isConnected) {
            const hydrated = makeAvatar(post.authorName || profile.name || "B", profile.photoURL);
            avatar.replaceChildren(...hydrated.childNodes);
          }
        }).catch(error => console.warn("Post author photo unavailable:", error));
      }
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
      if (post.imageURL) {
        const postImage = document.createElement("img");
        postImage.className = "feed-post-image";
        postImage.src = post.imageURL;
        postImage.alt = "পোস্টের ছবি";
        postImage.loading = "lazy";
        card.append(postImage);
      }

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
      likeBtn.type = "button"; likeBtn.className = "post-action";
      likeBtn.setAttribute("aria-label", "লাইক");
      likeBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.1-8.8 10.1-8.8 10.1S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></svg><span>লাইক</span>';
      likeBtn.addEventListener("click", () => togglePostReaction(postId, likeBtn));
      const commentBtn = document.createElement("button");
      commentBtn.type = "button"; commentBtn.className = "post-action";
      commentBtn.setAttribute("aria-label", "কমেন্ট");
      commentBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.8 7.5 8.7 8.7 0 0 1-3.5-.8L4 20l1.3-4.1A7.2 7.2 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5h.5A7.5 7.5 0 0 1 20 11.5Z"/></svg><span>কমেন্ট</span>';
      const shareBtn = document.createElement("button");
      shareBtn.type = "button"; shareBtn.className = "post-action";
      shareBtn.setAttribute("aria-label", "শেয়ার");
      shareBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m-5 5 5-5 5 5"/><path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/></svg><span>শেয়ার</span>';
      shareBtn.addEventListener("click", () => copyPostLink(postId));
      const copyBtn = document.createElement("button");
      copyBtn.type = "button"; copyBtn.className = "post-action";
      copyBtn.setAttribute("aria-label", "লিংক কপি");
      copyBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.7 1.7"/><path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 19.2l1.7-1.7"/></svg><span>কপি লিংক</span>';
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


/* BONDING v0.3 — profile, Cloudinary uploads, friends and verification */
const CLOUDINARY_CLOUD_NAME = "y6ujmcob";
const CLOUDINARY_UPLOAD_PRESET = "bonding_upload";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function safeText(el, value) {
  if (el) el.textContent = value || "";
}

// Shared avatar renderer: reads the public photoURL saved in users/{uid}.
const publicProfileCache = new Map();
function addAvatarImage(avatar, name, photoURL) {
  if (!avatar) return;
  avatar.textContent = (name || "B").trim().charAt(0).toUpperCase();
  if (!photoURL) return;
  const image = document.createElement("img");
  image.src = photoURL;
  image.alt = `${name || "ব্যবহারকারী"}-এর প্রোফাইল ছবি`;
  image.loading = "lazy";
  image.referrerPolicy = "no-referrer";
  image.addEventListener("error", () => image.remove(), { once: true });
  avatar.replaceChildren(image);
}

function makeAvatar(name, photoURL = "", className = "avatar small") {
  const avatar = document.createElement("div");
  avatar.className = className;
  addAvatarImage(avatar, name, photoURL);
  return avatar;
}

async function getPublicProfile(uid) {
  if (!uid) return {};
  if (publicProfileCache.has(uid)) return publicProfileCache.get(uid);
  const pending = getDoc(doc(db, "users", uid)).then(snap => snap.exists() ? snap.data() : {});
  publicProfileCache.set(uid, pending);
  try {
    const profile = await pending;
    publicProfileCache.set(uid, profile);
    return profile;
  } catch (error) {
    publicProfileCache.delete(uid);
    throw error;
  }
}

async function uploadBondingImage(file) {
  if (!file) throw new Error("ছবি নির্বাচন করুন।");
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) throw new Error("শুধু JPG, PNG অথবা WebP ছবি আপলোড করা যাবে।");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("ছবির আকার ৫ MB-এর কম হতে হবে।");
  return uploadBondingMedia(file);
}

async function uploadBondingMedia(file) {
  if (!file) throw new Error("ফাইল নির্বাচন করুন।");
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) throw new Error("শুধু ছবি অথবা ভিডিও পাঠানো যাবে।");
  const maxBytes = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxBytes) throw new Error(isVideo ? "ভিডিও ৫০ MB-এর কম হতে হবে।" : "ছবি ১০ MB-এর কম হতে হবে।");
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const resourceType = isVideo ? "video" : "image";
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, { method: "POST", body: form });
  const result = await response.json();
  if (!response.ok || !result.secure_url) {
    console.error("Cloudinary media upload failed:", result);
    throw new Error(result.error?.message || "মিডিয়া আপলোড করা যায়নি। Cloudinary preset পরীক্ষা করুন।");
  }
  return { url: result.secure_url, type: isVideo ? "video" : "image" };
}

async function loadMyProfile() {
  if (!state.user) return;
  const snap = await getDoc(doc(db, "users", state.user.uid));
  const data = snap.exists() ? snap.data() : {};
  safeText($("profileName"), data.name || state.user.displayName || "বন্ধু");
  safeText($("profileEmail"), state.user.email || "");
  safeText($("profileBio"), data.bio || "");
  if ($("editName")) $("editName").value = data.name || state.user.displayName || "";
  if ($("editBio")) $("editBio").value = data.bio || "";
  const photo = $("profilePhoto");
  const avatar = $("profileAvatar");
  if (data.photoURL && photo) {
    photo.src = data.photoURL; photo.classList.remove("hidden");
    avatar?.classList.add("hidden");
  } else {
    photo?.classList.add("hidden"); avatar?.classList.remove("hidden");
    if (avatar) avatar.textContent = (data.name || "B").charAt(0).toUpperCase();
  }
  ["homeAvatar", "chatAvatar"].forEach(id => addAvatarImage($(id), data.name || "B", data.photoURL || ""));
  const cover = $("profileCover");
  if (cover) {
    cover.style.backgroundImage = data.coverURL
      ? `linear-gradient(90deg,rgba(7,20,45,.18),rgba(7,20,45,.18)),url("${data.coverURL}")`
      : "";
  }
  const badge = $("verifiedBadge");
  if (badge) {
    badge.classList.toggle("hidden", data.verified !== true && !state.isSuperAdmin);
    badge.textContent = state.isSuperAdmin ? "★ Gold Founder" : (data.badgeType === "purple" ? "◆ Purple Official" : "✓ Blue Verified");
  }
  if (data.verified === true) safeText($("verifyMessage"), "আপনার অ্যাকাউন্ট যাচাইকৃত।");
  else await loadVerificationStatus();
}

async function saveProfile(event) {
  event.preventDefault();
  if (!state.user) return;
  const name = $("editName").value.trim();
  const bio = $("editBio").value.trim();
  if (!name) return status($("profileMessage"), "নাম লিখুন।", true);
  const btn = $("saveProfileBtn"); btn.disabled = true;
  try {
    await updateProfile(state.user, { displayName: name });
    await setDoc(doc(db, "users", state.user.uid), {
      uid: state.user.uid, name, bio, email: state.user.email || "", updatedAt: serverTimestamp()
    }, { merge: true });
    safeText($("profileName"), name); safeText($("profileBio"), bio);
    if ($("welcomeTitle")) $("welcomeTitle").textContent = `হ্যালো, ${name}!`;
    status($("profileMessage"), "প্রোফাইল আপডেট হয়েছে।");
    showToast("প্রোফাইল সংরক্ষিত হয়েছে।");
  } catch (error) {
    console.error("Profile save:", error); status($("profileMessage"), readableError(error), true);
  } finally { btn.disabled = false; }
}

async function handleImageChange(inputId, field, message) {
  const input = $(inputId);
  const file = input?.files?.[0];
  if (!file || !state.user) return;
  showToast("ছবি আপলোড হচ্ছে…");
  try {
    const url = await uploadBondingImage(file);
    await setDoc(doc(db, "users", state.user.uid), {
      [field]: url, updatedAt: serverTimestamp()
    }, { merge: true });
    await loadMyProfile();
    showToast(message);
  } catch (error) {
    console.error("Image upload:", error); showToast(error.message || "ছবি আপলোড ব্যর্থ হয়েছে।");
  } finally { input.value = ""; }
}

async function sendFriendRequest(targetUid, targetData) {
  if (!state.user || targetUid === state.user.uid) return;
  try {
    const q1 = await getDocs(query(collection(db, "friendRequests"),
      where("fromUid", "==", state.user.uid)));
    const q2 = await getDocs(query(collection(db, "friendRequests"),
      where("toUid", "==", state.user.uid)));
    const duplicate = [...q1.docs, ...q2.docs].some(d => {
      const x=d.data();
      return (x.fromUid===state.user.uid && x.toUid===targetUid ||
        x.fromUid===targetUid && x.toUid===state.user.uid) &&
        ["pending","accepted"].includes(x.status);
    });
    if (duplicate) return showToast("এই ব্যক্তির সঙ্গে অনুরোধ বা বন্ধুত্ব আগে থেকেই আছে।");
    await addDoc(collection(db, "friendRequests"), {
      fromUid: state.user.uid, fromName: state.user.displayName || state.user.email,
      toUid: targetUid, toName: targetData.name || targetData.email || "বন্ধু",
      status: "pending", createdAt: serverTimestamp()
    });
    showToast("বন্ধুত্বের অনুরোধ পাঠানো হয়েছে।");
    await renderSocialLists();
  } catch (error) { console.error(error); showToast(readableError(error)); }
}

async function respondFriendRequest(requestId, accept) {
  try {
    const ref = doc(db, "friendRequests", requestId);
    const requestSnap = await getDoc(ref);
    if (!requestSnap.exists()) throw new Error("অনুরোধটি আর পাওয়া যাচ্ছে না।");
    const requestData = requestSnap.data();
    await setDoc(ref, { status: accept ? "accepted" : "rejected", respondedAt: serverTimestamp() }, { merge: true });
    if (accept) {
      const members = [requestData.fromUid, requestData.toUid].sort();
      // Create the empty conversation immediately so both friends see each other in Chats.
      await setDoc(doc(db, "chats", chatIdFor(members[0], members[1])), {
        members, updatedAt: serverTimestamp()
      }, { merge: true });
    }
    showToast(accept ? "বন্ধুত্ব গ্রহণ করা হয়েছে। এখন চ্যাট তালিকায় পাবেন।" : "অনুরোধ প্রত্যাখ্যান করা হয়েছে।");
    await renderSocialLists();
  } catch (error) { console.error(error); showToast(readableError(error)); }
}

async function removeFriend(requestId) {
  if (!confirm("এই বন্ধুকে তালিকা থেকে সরাতে চান?")) return;
  try {
    await deleteDoc(doc(db, "friendRequests", requestId));
    showToast("বন্ধুকে তালিকা থেকে সরানো হয়েছে।");
    await renderSocialLists();
  } catch (error) { console.error(error); showToast(readableError(error)); }
}

function makeSocialRow(name, detail, actions = [], photoURL = "") {
  const row = document.createElement("div"); row.className = "social-row";
  const identity = document.createElement("div"); identity.className = "social-identity";
  const avatar = makeAvatar(name || "B", photoURL);
  const info = document.createElement("div"); info.className = "social-identity-text";
  const strong = document.createElement("strong"); strong.textContent = name || "BONDING ব্যবহারকারী";
  const small = document.createElement("small"); small.textContent = detail || "";
  info.append(strong, small); identity.append(avatar, info); row.append(identity);
  actions.forEach(({label, cls, run}) => {
    const btn = document.createElement("button"); btn.type = "button";
    btn.className = cls || "outline-btn"; btn.textContent = label;
    btn.addEventListener("click", run); row.append(btn);
  });
  return row;
}

async function renderSocialLists() {
  if (!state.user) return;
  const uid = state.user.uid;
  const incomingAll = await getDocs(query(collection(db, "friendRequests"), where("toUid", "==", uid)));
  const outgoingAll = await getDocs(query(collection(db, "friendRequests"), where("fromUid", "==", uid)));
  const incoming = { docs: incomingAll.docs.filter(d => d.data().status === "pending"), empty: incomingAll.docs.every(d => d.data().status !== "pending"), forEach: cb => incomingAll.docs.filter(d => d.data().status === "pending").forEach(cb) };
  const outgoing = { docs: outgoingAll.docs.filter(d => d.data().status === "pending"), empty: outgoingAll.docs.every(d => d.data().status !== "pending"), forEach: cb => outgoingAll.docs.filter(d => d.data().status === "pending").forEach(cb) };
  const acceptedFrom = { docs: outgoingAll.docs.filter(d => d.data().status === "accepted") };
  const acceptedTo = { docs: incomingAll.docs.filter(d => d.data().status === "accepted") };
  const incomingEl = $("incomingRequests"), outgoingEl = $("outgoingRequests"), friendsEl = $("friendsList");
  [incomingEl, outgoingEl, friendsEl].forEach(el => el?.replaceChildren());
  if (incoming.empty) incomingEl?.append(Object.assign(document.createElement("p"), {className:"muted",textContent:"নতুন কোনো অনুরোধ নেই।"}));
  for (const item of incoming.docs) {
    const d = item.data();
    let profile = {};
    try { profile = await getPublicProfile(d.fromUid); } catch (error) { console.warn(error); }
    incomingEl?.append(makeSocialRow(profile.name || d.fromName, "বন্ধুত্ব করতে চান", [
      {label:"গ্রহণ",cls:"primary-btn",run:()=>respondFriendRequest(item.id,true)},
      {label:"বাতিল",cls:"outline-btn",run:()=>respondFriendRequest(item.id,false)}
    ], profile.photoURL || ""));
  }
  if (outgoing.empty) outgoingEl?.append(Object.assign(document.createElement("p"), {className:"muted",textContent:"কোনো পাঠানো অনুরোধ নেই।"}));
  for (const item of outgoing.docs) {
    const d=item.data();
    let profile = {};
    try { profile = await getPublicProfile(d.toUid); } catch (error) { console.warn(error); }
    outgoingEl?.append(makeSocialRow(profile.name || d.toName, "অনুরোধের উত্তর অপেক্ষমাণ", [
      {label:"অনুরোধ বাতিল",cls:"outline-btn",run:()=>removeFriend(item.id)}
    ], profile.photoURL || ""));
  }
  const all = [...acceptedFrom.docs, ...acceptedTo.docs];
  if (!all.length) friendsEl?.append(Object.assign(document.createElement("p"), {className:"muted",textContent:"এখনো কোনো বন্ধু নেই।"}));
  for (const item of all) {
    const d=item.data(), isFrom=d.fromUid===uid;
    const friendUid=isFrom?d.toUid:d.fromUid;
    const friendName=isFrom?d.toName:d.fromName;
    let profile = {};
    try { profile = await getPublicProfile(friendUid); } catch (error) { console.warn(error); }
    friendsEl?.append(makeSocialRow(profile.name || friendName, "BONDING বন্ধু", [
      {label:"চ্যাট",cls:"primary-btn",run:async()=>{
        const u = await getPublicProfile(friendUid);
        openConversation({uid:friendUid,name:u.name||friendName,email:u.email||""});
      }},
      {label:"বন্ধু সরান",cls:"outline-btn",run:()=>removeFriend(item.id)}
    ], profile.photoURL || ""));
  }
}


// BONDING v0.5: searchable directory of registered accounts for Friends and Chat.
let directoryUsersCache = [];
let directoryCacheLoadedAt = 0;

async function getDirectoryUsers(forceRefresh = false) {
  if (!state.user) return [];
  const fresh = Date.now() - directoryCacheLoadedAt < 45000;
  if (!forceRefresh && fresh && directoryUsersCache.length) return directoryUsersCache;
  const snap = await getDocs(collection(db, "users"));
  directoryUsersCache = snap.docs
    .filter(item => item.id !== state.user.uid)
    .map(item => ({ uid: item.id, ...item.data() }));
  directoryCacheLoadedAt = Date.now();
  return directoryUsersCache;
}

async function renderUserDirectory(containerId, searchValue = "", forceRefresh = false) {
  const container = $(containerId);
  if (!container || !state.user) return;
  container.replaceChildren();
  const loading = document.createElement("p");
  loading.className = "muted";
  loading.textContent = "ব্যবহারকারী তালিকা লোড হচ্ছে…";
  container.append(loading);
  try {
    const users = await getDirectoryUsers(forceRefresh);
    const term = searchValue.trim().toLocaleLowerCase();
    const filtered = users.filter(user => {
      // Never show the currently signed-in account as a person to add or message.
      if (!user.uid || user.uid === state.user.uid) return false;
      const name = (user.name || "").toLocaleLowerCase();
      const email = (user.email || "").toLocaleLowerCase();
      return !term || name.includes(term) || email.includes(term);
    }).sort((a,b) => (a.name || a.email || "").localeCompare(b.name || b.email || ""));
    container.replaceChildren();
    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = term ? "এই নামে বা ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।" : "এখনো অন্য কোনো নিবন্ধিত অ্যাকাউন্ট পাওয়া যায়নি।";
      container.append(empty);
      return;
    }

    const [sentSnap, receivedSnap] = await Promise.all([
      getDocs(query(collection(db, "friendRequests"), where("fromUid", "==", state.user.uid))),
      getDocs(query(collection(db, "friendRequests"), where("toUid", "==", state.user.uid)))
    ]);
    const relation = new Map();
    sentSnap.docs.forEach(d => relation.set(d.data().toUid, { id:d.id, status:d.data().status, direction:"out" }));
    receivedSnap.docs.forEach(d => relation.set(d.data().fromUid, { id:d.id, status:d.data().status, direction:"in" }));

    filtered.forEach(user => {
      const rel = relation.get(user.uid);
      const actions = [];
      if (rel?.status === "accepted") {
        actions.push({label:"বন্ধু",cls:"outline-btn",run:()=>showToast("আপনি ইতিমধ্যে বন্ধু।")});
      } else if (rel?.status === "pending" && rel.direction === "out") {
        actions.push({label:"অনুরোধ পাঠানো হয়েছে",cls:"outline-btn",run:()=>showToast("উত্তরের অপেক্ষায় আছে।")});
      } else if (rel?.status === "pending" && rel.direction === "in") {
        actions.push({label:"অনুরোধ গ্রহণ",cls:"primary-btn",run:async()=>{await respondFriendRequest(rel.id,true);await renderSocialLists();await renderUserDirectory(containerId,$(containerId==="friendsDirectory"?"friendsDirectorySearch":"chatsDirectorySearch")?.value||"",true);}});
      } else {
        actions.push({label:"বন্ধু যোগ করুন",cls:"primary-btn",run:async()=>{await sendFriendRequest(user.uid,user);await renderUserDirectory(containerId,$(containerId==="friendsDirectory"?"friendsDirectorySearch":"chatsDirectorySearch")?.value||"",true);}});
      }
      actions.push({label:"প্রোফাইল",cls:"outline-btn",run:()=>showToast(`${user.name||"ব্যবহারকারী"} — ${user.bio||"BONDING সদস্য"}`)});
      const socialRow = makeSocialRow(user.name || user.email || "BONDING সদস্য", user.email || "নিবন্ধিত ব্যবহারকারী", actions, user.photoURL || "");
      if (rel?.status === "accepted") {
        const identity = socialRow.querySelector(".social-identity");
        if (identity) {
          identity.classList.add("social-identity-chat");
          identity.setAttribute("role", "button");
          identity.setAttribute("tabindex", "0");
          identity.setAttribute("aria-label", `${user.name || "বন্ধু"}-এর সঙ্গে চ্যাট খুলুন`);
          const startChat = () => openConversation({
            uid: user.uid,
            name: user.name || "বন্ধু",
            email: user.email || "",
            photoURL: user.photoURL || ""
          });
          identity.addEventListener("click", startChat);
          identity.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              startChat();
            }
          });
        }
      }
      container.append(socialRow);
    });
  } catch (error) {
    console.error("User directory error:", error);
    container.replaceChildren();
    const warning = document.createElement("p");
    warning.className = "muted";
    warning.textContent = "ব্যবহারকারী তালিকা লোড করা যায়নি। Firebase Firestore Rules-এ লগইন করা ব্যবহারকারীর users collection পড়ার অনুমতি আছে কি না দেখুন।";
    container.append(warning);
  }
}

/* BONDING Admin Dashboard — role checks are enforced again by Firestore Rules. */
const ADMIN_ROLE_LABELS = {
  superAdmin: "SUPER ADMIN",
  admin: "ADMIN",
  moderator: "MODERATOR",
  verificationManager: "VERIFICATION MANAGER"
};

async function loadAdminAccess() {
  state.adminRole = null;
  state.isSuperAdmin = false;
  if (!state.user) return;
  try {
    const configSnap = await getDoc(doc(db, "system", "adminConfig"));
    const founderUid = configSnap.exists() ? configSnap.data().superAdminUid : "";
    state.founderUid = founderUid || null;
    if (founderUid && founderUid === state.user.uid) {
      state.isSuperAdmin = true;
      state.adminRole = "superAdmin";
    } else {
      const roleSnap = await getDoc(doc(db, "adminRoles", state.user.uid));
      if (roleSnap.exists()) state.adminRole = roleSnap.data().role || null;
    }
  } catch (error) {
    console.warn("Admin access check:", error);
  }
  const entry = $("adminEntryPanel");
  if (entry) entry.classList.toggle("hidden", !state.adminRole);
}

function adminCanManagePosts() {
  return state.isSuperAdmin || ["admin", "moderator"].includes(state.adminRole);
}
function adminCanManageVerification() {
  return state.isSuperAdmin || ["admin", "verificationManager"].includes(state.adminRole);
}
function adminCanViewUsers() {
  return !!state.adminRole;
}

async function writeAdminLog(action, targetId, details = "") {
  if (!state.user || !state.adminRole) return;
  try {
    await addDoc(collection(db, "adminLogs"), {
      actorUid: state.user.uid,
      actorName: state.user.displayName || state.user.email || "Admin",
      actorRole: state.adminRole,
      action, targetId: targetId || "",
      details: String(details).slice(0, 500),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("Admin audit log could not be written:", error);
  }
}

function adminRow(title, subtitle, actions = []) {
  const row = document.createElement("div");
  row.className = "admin-row";
  const identity = document.createElement("div");
  identity.className = "admin-row-identity";
  const strong = document.createElement("strong"); strong.textContent = title || "নাম নেই";
  const small = document.createElement("small"); small.textContent = subtitle || "";
  identity.append(strong, small);
  row.append(identity);
  if (actions.length) {
    const controls = document.createElement("div"); controls.className = "admin-row-actions";
    actions.forEach(action => {
      const button = document.createElement("button"); button.type = "button";
      button.className = action.className || "outline-btn"; button.textContent = action.label;
      button.addEventListener("click", action.onClick); controls.append(button);
    });
    row.append(controls);
  }
  return row;
}

function setAdminListMessage(id, message) {
  const target = $(id); if (!target) return;
  target.replaceChildren();
  const p = document.createElement("p"); p.className = "muted"; p.textContent = message; target.append(p);
}

async function openAdminDashboard() {
  if (!state.adminRole) {
    showToast("এই অ্যাকাউন্টের Admin Dashboard ব্যবহারের অনুমতি নেই।");
    return;
  }
  openPage("adminDashboardPage");
  $("adminRoleLabel").textContent = ADMIN_ROLE_LABELS[state.adminRole] || "ADMIN";
  $("adminIdentityName").textContent = state.user.displayName || state.user.email || "BONDING Admin";
  $("adminIdentityUid").textContent = `UID: ${state.user.uid}`;
  $("superAdminManagement")?.classList.toggle("hidden", !state.isSuperAdmin);
  $("adminVerificationSection")?.classList.toggle("hidden", !adminCanManageVerification());
  $("adminPostsSection")?.classList.toggle("hidden", !adminCanManagePosts());
  await refreshAdminDashboard();
}

async function refreshAdminDashboard() {
  if (!state.adminRole) return;
  $("adminUsersCount").textContent = "…";
  $("adminPostsCount").textContent = "…";
  $("adminPendingCount").textContent = "…";
  try {
    const tasks = [getDocs(collection(db, "users"))];
    if (adminCanManagePosts()) tasks.push(getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(40))));
    if (adminCanManageVerification()) tasks.push(getDocs(collection(db, "verificationRequests")));
    const results = await Promise.all(tasks);
    let idx = 0;
    const usersSnap = results[idx++];
    state.adminUsersCache = usersSnap.docs.map(d => ({ uid:d.id, ...d.data() }));
    $("adminUsersCount").textContent = usersSnap.size;
    renderAdminUsers();
    if (adminCanManagePosts()) {
      const postsSnap = results[idx++];
      state.adminPostsCache = postsSnap.docs.map(d => ({ id:d.id, ...d.data() }));
      $("adminPostsCount").textContent = postsSnap.size;
      renderAdminPosts();
    } else {
      $("adminPostsCount").textContent = "—";
    }
    if (adminCanManageVerification()) {
      const verifySnap = results[idx++];
      const pending = verifySnap.docs.filter(d => d.data().status === "pending");
      $("adminPendingCount").textContent = pending.length;
      renderAdminVerifications(pending);
    } else {
      $("adminPendingCount").textContent = "—";
    }
    if (state.isSuperAdmin) {
      await renderAdminStaff();
      await renderAdminLogs();
    }
  } catch (error) {
    console.error("Admin dashboard load:", error);
    showToast("ড্যাশবোর্ডের তথ্য লোড হয়নি। Firestore Rules প্রকাশিত হয়েছে কি না দেখুন।");
  }
}

function renderAdminUsers() {
  const target = $("adminUsersList"); if (!target) return;
  const term = ($("adminUserSearch")?.value || "").trim().toLowerCase();
  const users = state.adminUsersCache.filter(u =>
    !term || (u.name || "").toLowerCase().includes(term) || (u.email || "").toLowerCase().includes(term));
  target.replaceChildren();
  if (!users.length) return setAdminListMessage("adminUsersList", "কোনো ব্যবহারকারী পাওয়া যায়নি।");
  users.slice(0, 100).forEach(user => {
    const verified = user.verified ? " • Verified" : "";
    target.append(adminRow(user.name || "নাম নেই", `${user.email || "ইমেইল নেই"} • ${user.uid}${verified}`));
  });
  if (users.length > 100) {
    const note = document.createElement("p"); note.className = "muted"; note.textContent = `প্রথম ১০০ জন দেখানো হচ্ছে; মোট ${users.length} জন।`;
    target.append(note);
  }
}

function renderAdminPosts() {
  const target = $("adminPostsList"); if (!target) return;
  target.replaceChildren();
  if (!state.adminPostsCache.length) return setAdminListMessage("adminPostsList", "এখনো কোনো পোস্ট নেই।");
  state.adminPostsCache.forEach(post => {
    const text = (post.text || "").replace(/\s+/g, " ").slice(0, 110);
    target.append(adminRow(text || "লেখাবিহীন পোস্ট", `${post.authorName || "সদস্য"} • ${post.authorId || ""}`,[{
      label:"পোস্ট মুছুন", className:"danger-btn", onClick:async()=>{
        if (!confirm("এই পোস্টটি স্থায়ীভাবে মুছে ফেলতে চান?")) return;
        try {
          await deleteDoc(doc(db,"posts",post.id));
          await writeAdminLog("delete_post",post.id,"Post removed from admin dashboard");
          showToast("পোস্ট মুছে ফেলা হয়েছে।"); await refreshAdminDashboard();
        } catch(error) { console.error(error); showToast(readableError(error)); }
      }
    }]));
  });
}

function renderAdminVerifications(pendingDocs) {
  const target = $("adminVerificationList"); if (!target) return;
  target.replaceChildren();
  if (!pendingDocs.length) return setAdminListMessage("adminVerificationList", "কোনো অপেক্ষমাণ আবেদন নেই।");
  pendingDocs.forEach(item => {
    const request = item.data();
    target.append(adminRow(request.name || "BONDING সদস্য", request.email || item.id,[
      {label:"অনুমোদন",className:"primary-btn",onClick:()=>reviewVerification(item.id,true)},
      {label:"প্রত্যাখ্যান",className:"danger-btn",onClick:()=>reviewVerification(item.id,false)}
    ]));
  });
}

async function reviewVerification(uid, approve) {
  if (!adminCanManageVerification()) return showToast("আপনার এই কাজের অনুমতি নেই।");
  const action = approve ? "অনুমোদন" : "প্রত্যাখ্যান";
  if (!confirm(`এই ভেরিফিকেশন আবেদন ${action} করবেন?`)) return;
  try {
    await setDoc(doc(db,"verificationRequests",uid), {
      status: approve ? "approved" : "rejected",
      reviewedBy: state.user.uid,
      reviewedAt: serverTimestamp()
    }, {merge:true});
    if (approve) {
      const requestSnap = await getDoc(doc(db, "verificationRequests", uid));
      const kind = requestSnap.exists() ? requestSnap.data().kind : "personal";
      await setDoc(doc(db,"users",uid),{verified:true,badgeType:kind === "official" ? "purple" : "blue",updatedAt:serverTimestamp()},{merge:true});
    }
    await writeAdminLog(approve ? "approve_verification" : "reject_verification",uid,action);
    showToast(`আবেদন ${approve ? "অনুমোদন" : "প্রত্যাখ্যান"} করা হয়েছে।`);
    await refreshAdminDashboard();
  } catch(error) { console.error(error); showToast(readableError(error)); }
}

async function renderAdminStaff() {
  const target = $("adminStaffList"); if (!target || !state.isSuperAdmin) return;
  try {
    const snap = await getDocs(collection(db,"adminRoles"));
    target.replaceChildren();
    if (!snap.size) return setAdminListMessage("adminStaffList","এখনো অন্য কোনো অ্যাডমিন নিয়োগ করা হয়নি।");
    snap.docs.forEach(item => {
      const data = item.data();
      target.append(adminRow(data.name || data.email || item.id, `${ADMIN_ROLE_LABELS[data.role] || data.role} • ${data.email || item.id}`,[{
        label:"পদ বাতিল",className:"danger-btn",onClick:async()=>{
          if (item.id === state.user.uid) return showToast("নিজের Super Admin অ্যাক্সেস এখান থেকে বাতিল করা যাবে না।");
          if (!confirm(`${data.name || data.email} এর অ্যাডমিন পদ বাতিল করবেন?`)) return;
          try { await deleteDoc(doc(db,"adminRoles",item.id)); await writeAdminLog("remove_admin",item.id,"Admin role revoked"); showToast("অ্যাডমিন পদ বাতিল হয়েছে।"); await renderAdminStaff(); }
          catch(error) { console.error(error); showToast(readableError(error)); }
        }
      }]));
    });
  } catch(error) { console.error(error); setAdminListMessage("adminStaffList","অ্যাডমিন তালিকা পড়া যায়নি। Rules পরীক্ষা করুন।"); }
}

async function renderAdminLogs() {
  const target = $("adminLogsList");
  if (!target || !state.isSuperAdmin) return;
  try {
    const snap = await getDocs(query(collection(db,"adminLogs"),orderBy("createdAt","desc"),limit(30)));
    target.replaceChildren();
    if (!snap.size) return setAdminListMessage("adminLogsList","এখনো কোনো অ্যাডমিন কার্যক্রম রেকর্ড হয়নি।");
    snap.docs.forEach(item => {
      const log = item.data();
      const when = log.createdAt?.toDate ? log.createdAt.toDate().toLocaleString("bn-BD") : "সময় অনুপলব্ধ";
      target.append(adminRow(log.action || "কার্যক্রম", `${log.actorName || log.actorUid || "Admin"} • ${log.actorRole || ""} • ${when} • ${log.targetId || ""}`));
    });
  } catch(error) {
    console.warn("Admin logs:",error);
    setAdminListMessage("adminLogsList","অ্যাডমিন লগ পড়া যায়নি।");
  }
}

async function assignAdminRole() {
  if (!state.isSuperAdmin) return showToast("শুধু Super Admin অ্যাডমিন নিয়োগ করতে পারবেন।");
  const email = $("newAdminEmail")?.value.trim().toLowerCase();
  const role = $("newAdminRole")?.value;
  if (!email) return status($("adminManageMessage"),"ব্যবহারকারীর ইমেইল লিখুন।",true);
  if (!["admin","moderator","verificationManager"].includes(role)) return;
  try {
    const snap = await getDocs(query(collection(db,"users"),where("email","==",email),limit(1)));
    if (snap.empty) return status($("adminManageMessage"),"এই ইমেইলে BONDING অ্যাকাউন্ট পাওয়া যায়নি।",true);
    const member = snap.docs[0];
    if (member.id === state.user.uid) return status($("adminManageMessage"),"নিজেকে অন্য পদে নিয়োগ করা যাবে না।",true);
    const data = member.data();
    await setDoc(doc(db,"adminRoles",member.id),{
      uid:member.id, name:data.name || "BONDING সদস্য", email:data.email || email,
      role, assignedBy:state.user.uid, createdAt:serverTimestamp()
    });
    await writeAdminLog("assign_admin",member.id,`Assigned role: ${role}`);
    $("newAdminEmail").value = "";
    status($("adminManageMessage"),`${data.name || email}-কে ${ADMIN_ROLE_LABELS[role]} পদে নিয়োগ করা হয়েছে।`);
    await renderAdminStaff();
  } catch(error) { console.error(error); status($("adminManageMessage"),readableError(error),true); }
}

async function applyForVerification() {
  if (!state.user) return;
  try {
    const ref=doc(db,"verificationRequests",state.user.uid);
    const old=await getDoc(ref);
    if (old.exists() && old.data().status==="pending") {
      return status($("verifyMessage"), "আপনার আবেদন ইতিমধ্যে পর্যালোচনাধীন।");
    }
    await setDoc(ref,{
      uid:state.user.uid, name:state.user.displayName||state.user.email||"ব্যবহারকারী",
      email:state.user.email||"", kind:$("verificationKind")?.value || "personal",
      status:"pending", createdAt:serverTimestamp()
    });
    status($("verifyMessage"), "আবেদন জমা হয়েছে। অ্যাডমিন যাচাই করবেন।");
    $("verifyApplyBtn").disabled=true;
  } catch(error) { console.error(error); status($("verifyMessage"),readableError(error),true); }
}

async function loadVerificationStatus() {
  if (!state.user) return;
  try {
    const snap=await getDoc(doc(db,"verificationRequests",state.user.uid));
    if (snap.exists() && snap.data().status==="pending") {
      status($("verifyMessage"), "আপনার আবেদন পর্যালোচনাধীন।");
      $("verifyApplyBtn").disabled=true;
    } else {
      $("verifyApplyBtn").disabled=false;
    }
  } catch(error) { console.warn("Verification status:",error); }
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
$("friendsDirectorySearch")?.addEventListener("input", event => renderUserDirectory("friendsDirectory", event.target.value));
$("chatsDirectorySearch")?.addEventListener("input", event => renderUserDirectory("chatsDirectory", event.target.value));
$("refreshFriendsDirectory")?.addEventListener("click", () => renderUserDirectory("friendsDirectory", $("friendsDirectorySearch")?.value || "", true));
$("refreshChatsDirectory")?.addEventListener("click", () => renderUserDirectory("chatsDirectory", $("chatsDirectorySearch")?.value || "", true));
$("profileForm")?.addEventListener("submit", saveProfile);
$("avatarFile")?.addEventListener("change", () => handleImageChange("avatarFile", "photoURL", "প্রোফাইল ছবি আপডেট হয়েছে।"));
$("coverFile")?.addEventListener("change", () => handleImageChange("coverFile", "coverURL", "কভার ছবি আপডেট হয়েছে।"));
$("verifyApplyBtn")?.addEventListener("click", applyForVerification);
$("userSearch")?.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchFriend();
  }
});

$("messageForm")?.addEventListener("submit", sendMessage);
$("postForm")?.addEventListener("submit", publishPost);
$("chatMediaBtn")?.addEventListener("click", () => $("chatMediaFile")?.click());
$("chatMediaFile")?.addEventListener("change", () => {
  const file = $("chatMediaFile")?.files?.[0];
  if (file) showToast(`নির্বাচিত: ${file.name} — পাঠাতে Send চাপুন।`);
});
$("postImageFile")?.addEventListener("change", () => {
  const file = $("postImageFile")?.files?.[0];
  const preview = $("postImagePreview");
  if (!file || !preview) return;
  if (!file.type.startsWith("image/")) { showToast("শুধু ছবি নির্বাচন করুন।"); $("postImageFile").value = ""; return; }
  preview.src = URL.createObjectURL(file);
  preview.classList.remove("hidden");
  $("postImageName").textContent = file.name;
});

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


// BONDING v0.4: six accent palettes and floating Tanim AI entry point.
const savedColorTheme = localStorage.getItem("bonding-color-theme") || "blue";
function applyColorTheme(name) {
  const allowed = ["blue", "green", "purple", "rose", "sunset", "midnight"];
  const chosen = allowed.includes(name) ? name : "blue";
  document.documentElement.setAttribute("data-color-theme", chosen);
  document.body.setAttribute("data-color-theme", chosen);
  localStorage.setItem("bonding-color-theme", chosen);
  document.querySelectorAll(".theme-choice[data-color-theme]").forEach(button => {
    const selected = button.dataset.colorTheme === chosen;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}
document.addEventListener("click", event => {
  const choice = event.target.closest(".theme-choice[data-color-theme]");
  if (choice) applyColorTheme(choice.dataset.colorTheme);
});
applyColorTheme(savedColorTheme);
$("tanimAiButton")?.addEventListener("click", () => $("tanimAiPanel")?.classList.toggle("hidden"));
$("closeTanimAi")?.addEventListener("click", () => $("tanimAiPanel")?.classList.add("hidden"));

// Chat inbox controls: search existing conversations and switch inbox tabs.
$("chatSearchFocus")?.addEventListener("click", () => $("chatListSearch")?.focus());
$("newChatFocus")?.addEventListener("click", () => {
  const directory = $("newChatDirectory");
  if (directory) { directory.open = true; directory.scrollIntoView({ behavior: "smooth", block: "start" }); }
});
$("chatListSearch")?.addEventListener("input", event => {
  const term = event.target.value.trim().toLocaleLowerCase();
  document.querySelectorAll("#chatList .chat-item").forEach(item => {
    item.classList.toggle("hidden", term && !item.textContent.toLocaleLowerCase().includes(term));
  });
});
document.querySelectorAll("[data-chat-tab]").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-chat-tab]").forEach(item => item.classList.toggle("active", item === tab));
    $("chatList")?.classList.remove("hidden");
  });
});
document.querySelectorAll("[data-friends-tab]").forEach(tab => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.friendsTab;
    document.querySelectorAll("[data-friends-tab]").forEach(item => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".friends-tab-panel").forEach(panel => panel.classList.add("hidden"));
    $("friendsTab" + key.charAt(0).toUpperCase() + key.slice(1))?.classList.remove("hidden");
  });
});


/* BONDING Story System 1.0 — public stories expire after 24 hours */
let unsubscribeStories = null;
let activeStoryItems = [];
let activeStoryIndex = 0;
let activeStoryOwner = null;
let selectedStoryFile = null;

function storyInitial(name) { return (name || 'B').trim().charAt(0).toUpperCase() || 'B'; }
function listenToStories() {
  if (unsubscribeStories) unsubscribeStories();
  const storiesQuery = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(100));
  unsubscribeStories = onSnapshot(storiesQuery, snapshot => {
    const now = Date.now();
    const valid = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).filter(story => {
      const created = story.createdAt?.toDate ? story.createdAt.toDate().getTime() : 0;
      return created && now - created < 24 * 60 * 60 * 1000;
    });
    const latestByUser = new Map();
    valid.forEach(story => { if (!latestByUser.has(story.uid)) latestByUser.set(story.uid, story); });
    const bar = $('storyBar');
    if (!bar) return;
    bar.querySelectorAll('.story-user-item').forEach(el => el.remove());
    const empty = bar.querySelector('.empty-story-hint');
    if (empty) empty.classList.toggle('hidden', latestByUser.size > 0);
    const mine = valid.filter(story => story.uid === state.user?.uid);
    const mineAvatar = $('myStoryAvatar');
    if (mineAvatar) {
      mineAvatar.textContent = storyInitial(state.user?.displayName || state.user?.email);
      if (mine[0]?.photoURL) mineAvatar.style.backgroundImage = `url("${mine[0].photoURL}")`;
    }
    [...latestByUser.values()].filter(story => story.uid !== state.user?.uid).forEach(story => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'story-item story-user-item';
      const ring = document.createElement('span'); ring.className = 'story-ring';
      const avatar = document.createElement('span'); avatar.className = 'story-avatar';
      if (story.photoURL) { avatar.style.backgroundImage = `url("${story.photoURL}")`; avatar.textContent = ''; }
      else avatar.textContent = storyInitial(story.name);
      ring.append(avatar); button.append(ring);
      const label = document.createElement('span'); label.textContent = story.name || 'BONDING ব্যবহারকারী'; button.append(label);
      button.addEventListener('click', () => openStoryForUser(story.uid));
      bar.append(button);
    });
    const addBtn = $('addStoryBtn');
    if (addBtn) addBtn.onclick = () => $('storyComposer')?.classList.remove('hidden');
    window.__bondingStories = valid;
  }, error => { console.error('Stories listener:', error); showToast('স্টোরি লোড করা যায়নি। Firestore Rules পরীক্ষা করুন।'); });
}

function openStoryForUser(uid) {
  const all = window.__bondingStories || [];
  activeStoryItems = all.filter(story => story.uid === uid).sort((a,b) => {
    const ta = a.createdAt?.toDate?.().getTime() || 0; const tb = b.createdAt?.toDate?.().getTime() || 0; return ta - tb;
  });
  activeStoryOwner = uid; activeStoryIndex = 0;
  if (activeStoryItems.length) showActiveStory();
}

async function showActiveStory() {
  const story = activeStoryItems[activeStoryIndex];
  if (!story) { $('storyViewer')?.classList.add('hidden'); return; }
  $('storyViewer')?.classList.remove('hidden');
  $('storyViewerName').textContent = story.name || 'BONDING ব্যবহারকারী';
  $('storyViewerTime').textContent = story.createdAt?.toDate ? story.createdAt.toDate().toLocaleString(state.lang === 'bn' ? 'bn-BD' : 'en-US') : '';
  const avatar = $('storyViewerAvatar'); avatar.textContent = storyInitial(story.name);
  if (story.photoURL) { avatar.style.backgroundImage = `url("${story.photoURL}")`; avatar.textContent = ''; }
  $('storyDeleteBtn').classList.toggle('hidden', story.uid !== state.user?.uid);
  $('storyViewerContent').replaceChildren();
  if (story.imageURL) { const img = document.createElement('img'); img.src = story.imageURL; img.alt = 'Story'; $('storyViewerContent').append(img); }
  if (story.text) { const caption = document.createElement('p'); caption.textContent = story.text; $('storyViewerContent').append(caption); }
  $('storyProgress').innerHTML = activeStoryItems.map((_,i) => `<span class="${i <= activeStoryIndex ? 'done' : ''}"></span>`).join('');
  $('storyNextBtn').textContent = activeStoryIndex === activeStoryItems.length - 1 ? 'বন্ধ করুন' : 'পরবর্তী ›';
  try {
    const viewerRef = doc(db, 'stories', story.id, 'viewers', state.user.uid);
    const existing = await getDoc(viewerRef);
    if (!existing.exists() && story.uid !== state.user.uid) {
      await setDoc(viewerRef, { uid: state.user.uid, name: state.user.displayName || state.user.email || 'ব্যবহারকারী', viewedAt: serverTimestamp() });
    }
    if (story.uid === state.user.uid) {
      const viewers = await getDocs(collection(db, 'stories', story.id, 'viewers'));
      const viewerNames = viewers.docs.map(view => view.data().name || 'ব্যবহারকারী');
      $('storyViewCount').textContent = viewers.size ? `দেখেছেন ${viewers.size} জন: ${viewerNames.join(', ')}` : 'এখনো কেউ দেখেনি';
    } else $('storyViewCount').textContent = '';
  } catch (error) { console.warn('Story view tracking:', error); }
}

$('storyImageFile')?.addEventListener('change', event => {
  selectedStoryFile = event.target.files?.[0] || null;
  const preview = $('storyImagePreview');
  if (preview && selectedStoryFile) { preview.src = URL.createObjectURL(selectedStoryFile); preview.classList.remove('hidden'); }
  else preview?.classList.add('hidden');
});
$('storyComposerClose')?.addEventListener('click', () => $('storyComposer')?.classList.add('hidden'));
$('storyCloseBtn')?.addEventListener('click', () => $('storyViewer')?.classList.add('hidden'));
$('storyNextBtn')?.addEventListener('click', () => { activeStoryIndex += 1; if (activeStoryIndex >= activeStoryItems.length) $('storyViewer')?.classList.add('hidden'); else showActiveStory(); });
$('storyDeleteBtn')?.addEventListener('click', async () => {
  const story = activeStoryItems[activeStoryIndex];
  if (!story || story.uid !== state.user?.uid || !confirm('এই স্টোরিটি মুছে ফেলবেন?')) return;
  try { await deleteDoc(doc(db, 'stories', story.id)); $('storyViewer')?.classList.add('hidden'); showToast('স্টোরি মুছে ফেলা হয়েছে।'); }
  catch (error) { showToast(readableError(error)); }
});
$('storyForm')?.addEventListener('submit', async event => {
  event.preventDefault();
  const text = $('storyText').value.trim();
  const file = selectedStoryFile;
  if (!text && !file) { showToast('একটি ছবি অথবা কিছু লেখা যোগ করুন।'); return; }
  const button = $('publishStoryBtn'); button.disabled = true;
  try {
    let imageURL = '';
    if (file) { if (!file.type.startsWith('image/')) throw new Error('শুধু ছবি আপলোড করা যাবে।'); if (file.size > 10*1024*1024) throw new Error('ছবি ১০ MB-এর কম হতে হবে।'); imageURL = await uploadBondingImage(file); }
    await addDoc(collection(db, 'stories'), {
      uid: state.user.uid, name: state.user.displayName || state.user.email?.split('@')[0] || 'BONDING ব্যবহারকারী',
      photoURL: state.user.photoURL || '', text, ...(imageURL ? { imageURL } : {}),
      createdAt: serverTimestamp(), expiresAt: new Date(Date.now() + 24*60*60*1000)
    });
    $('storyText').value = ''; $('storyImageFile').value = ''; $('storyImagePreview').classList.add('hidden'); selectedStoryFile = null;
    $('storyComposer').classList.add('hidden'); showToast('আপনার স্টোরি প্রকাশিত হয়েছে!');
  } catch (error) { console.error('Publish story:', error); showToast(error.message || readableError(error)); }
  finally { button.disabled = false; }
});




/* BONDING 2.0 — Communities */
async function renderCommunities() {
  const host = $("communitiesList");
  if (!host || !state.user) return;
  host.innerHTML = '<div class="empty-state">কমিউনিটি লোড হচ্ছে…</div>';
  try {
    const snap = await getDocs(query(collection(db, "communities"), orderBy("createdAt", "desc"), limit(60)));
    host.replaceChildren();
    if (snap.empty) {
      host.innerHTML = '<div class="empty-state">এখনো কোনো কমিউনিটি নেই। প্রথম কমিউনিটি তৈরি করুন।</div>';
      return;
    }
    for (const item of snap.docs) {
      const group = { id: item.id, ...item.data() };
      const memberSnap = await getDoc(doc(db, "communities", group.id, "members", state.user.uid));
      const requestSnap = await getDoc(doc(db, "communities", group.id, "joinRequests", state.user.uid));
      const memberCountSnap = await getDocs(collection(db, "communities", group.id, "members"));
      const card = document.createElement("article");
      card.className = "community-card";
      const head = document.createElement("div"); head.className = "community-card-head";
      const titleWrap = document.createElement("div");
      const title = document.createElement("h3"); title.textContent = group.name || "নামহীন কমিউনিটি";
      const meta = document.createElement("div"); meta.className = "community-meta";
      meta.textContent = `${group.ownerName || "সদস্য"} • ${memberCountSnap.size} সদস্য`;
      titleWrap.append(title, meta);
      const privacy = document.createElement("span"); privacy.className = "community-privacy";
      privacy.textContent = group.privacy === "private" ? "PRIVATE" : "PUBLIC";
      head.append(titleWrap, privacy);
      const desc = document.createElement("p"); desc.textContent = group.description || "এই কমিউনিটির কোনো বিবরণ নেই।";
      const actions = document.createElement("div"); actions.className = "community-actions";
      if (memberSnap.exists()) {
        const joined = document.createElement("span"); joined.className = "community-meta"; joined.textContent = "✓ আপনি সদস্য";
        const open = document.createElement("button"); open.type = "button"; open.className = "outline-btn"; open.textContent = "কমিউনিটি খুলুন";
        open.addEventListener("click", () => openCommunity(group));
        actions.append(joined, open);
      } else if (requestSnap.exists()) {
        const pending = document.createElement("span"); pending.className = "community-meta"; pending.textContent = "যোগদানের অনুরোধ অপেক্ষমাণ";
        actions.append(pending);
      } else {
        const join = document.createElement("button"); join.type = "button"; join.className = "primary-btn";
        join.textContent = group.privacy === "private" ? "যোগদানের অনুরোধ" : "যোগ দিন";
        join.addEventListener("click", async () => {
          join.disabled = true;
          try {
            if (group.privacy === "private") {
              await setDoc(doc(db, "communities", group.id, "joinRequests", state.user.uid), {
                uid: state.user.uid, name: state.user.displayName || state.user.email || "সদস্য", createdAt: serverTimestamp()
              });
              showToast("যোগদানের অনুরোধ পাঠানো হয়েছে।");
            } else {
              await setDoc(doc(db, "communities", group.id, "members", state.user.uid), {
                uid: state.user.uid, name: state.user.displayName || state.user.email || "সদস্য", role: "member", joinedAt: serverTimestamp()
              });
              showToast("কমিউনিটিতে যোগ দিয়েছেন।");
            }
            await renderCommunities();
          } catch (error) { showToast(readableError(error)); join.disabled = false; }
        });
        actions.append(join);
      }
      if (group.ownerUid === state.user.uid) {
        const own = document.createElement("span"); own.className = "community-meta"; own.textContent = "আপনার তৈরি";
        actions.append(own);
      }
      card.append(head, desc, actions); host.append(card);
    }
  } catch (error) {
    console.error("Community load:", error);
    host.innerHTML = '<div class="empty-state">কমিউনিটি লোড করা যায়নি। নতুন Firestore Rules Publish হয়েছে কি না পরীক্ষা করুন।</div>';
  }
}

$("communityForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  if (!state.user) return;
  const name = $("communityName").value.trim();
  const description = $("communityDescription").value.trim();
  const privacy = $("communityPrivacy").value;
  if (name.length < 3) return status($("communityMessage"), "কমিউনিটির নাম কমপক্ষে ৩ অক্ষরের হতে হবে।", true);
  const button = $("createCommunityBtn"); button.disabled = true;
  try {
    const mine = await getDocs(query(collection(db, "communities"), where("ownerUid", "==", state.user.uid)));
    if (!state.isSuperAdmin && mine.size >= 3) throw new Error("সাধারণ সদস্য সর্বোচ্চ ৩টি কমিউনিটি তৈরি করতে পারবেন।");
    const ref = await addDoc(collection(db, "communities"), {
      name, description, privacy, ownerUid: state.user.uid,
      ownerName: state.user.displayName || state.user.email || "সদস্য",
      memberCount: 1, createdAt: serverTimestamp(), status: "active"
    });
    await setDoc(doc(db, "communities", ref.id, "members", state.user.uid), {
      uid: state.user.uid, name: state.user.displayName || state.user.email || "সদস্য",
      role: "owner", joinedAt: serverTimestamp()
    });
    $("communityForm").reset();
    status($("communityMessage"), "কমিউনিটি তৈরি হয়েছে।");
    await renderCommunities();
  } catch (error) { status($("communityMessage"), error.message || readableError(error), true); }
  finally { button.disabled = false; }
});
$("refreshCommunities")?.addEventListener("click", renderCommunities);

/* Founder profile image follows the founder's own profile photo; identity remains rule-controlled. */
const originalLoadMyProfile = loadMyProfile;
loadMyProfile = async function() {
  await originalLoadMyProfile();
  const founderAvatar = $("founderPublicAvatar");
  if (state.founderUid) {
    const founderSnap = await getDoc(doc(db, "users", state.founderUid));
    const photoURL = founderSnap.exists() ? founderSnap.data().photoURL : "";
    if (founderAvatar && photoURL) {
      const img = document.createElement("img"); img.src = photoURL; img.alt = "Founder profile photo";
      founderAvatar.replaceChildren(img);
    } else if (founderAvatar) founderAvatar.textContent = "IT";
  }
  if (state.isSuperAdmin) $("verifiedBadge")?.classList.remove("hidden");
};


async function openCommunity(group) {
  state.currentCommunity = group;
  $("communityDetailTitle").textContent = group.name || "কমিউনিটি";
  $("communityDetailMeta").textContent = `${group.privacy === "private" ? "Private" : "Public"} • ${group.ownerName || ""}`;
  $("communityDetailModal").classList.remove("hidden");
  await renderCommunityPosts();
}
async function renderCommunityPosts() {
  const host = $("communityPosts"), group = state.currentCommunity;
  if (!host || !group) return;
  host.innerHTML = '<p class="muted">পোস্ট লোড হচ্ছে…</p>';
  try {
    const snap = await getDocs(query(collection(db, "communities", group.id, "posts"), orderBy("createdAt", "desc"), limit(40)));
    host.replaceChildren();
    if (snap.empty) { host.innerHTML = '<p class="muted">এখনো কোনো পোস্ট নেই। প্রথম পোস্টটি করুন।</p>'; return; }
    for (const d of snap.docs) {
      const post = d.data(), card = document.createElement("article"); card.className = "community-card";
      const author = document.createElement("strong"); author.textContent = post.name || "সদস্য";
      const body = document.createElement("p"); body.textContent = post.text || "";
      card.append(author);
      if (post.imageURL) { const img = document.createElement("img"); img.src = post.imageURL; img.alt = "কমিউনিটি পোস্ট"; img.loading = "lazy"; img.style.cssText = "width:100%;border-radius:12px;margin-top:8px"; card.append(img); }
      if (post.text) card.append(body);
      const actions = document.createElement("div"); actions.className = "community-actions";
      const like = document.createElement("button"); like.type = "button"; like.className = "outline-btn"; like.textContent = "♡ লাইক";
      like.addEventListener("click", async () => {
        const ref = doc(db, "communities", group.id, "posts", d.id, "likes", state.user.uid);
        try { const liked = await getDoc(ref); if (liked.exists()) await deleteDoc(ref); else await setDoc(ref,{uid:state.user.uid,createdAt:serverTimestamp()}); like.textContent = liked.exists() ? "♡ লাইক" : "♥ লাইক"; }
        catch (error) { showToast(readableError(error)); }
      });
      const share = document.createElement("button"); share.type = "button"; share.className = "outline-btn"; share.textContent = "শেয়ার";
      share.addEventListener("click", async () => { try { await navigator.clipboard.writeText(`${location.origin}${location.pathname}#community-${group.id}`); showToast("লিংক কপি হয়েছে।"); } catch { showToast("এই ব্রাউজারে কপি করা যায়নি।"); } });
      actions.append(like, share); card.append(actions); host.append(card);
    }
  } catch (error) { host.textContent = "পোস্ট লোড করা যায়নি: " + readableError(error); }
}
$("communityPostForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const group = state.currentCommunity, text = $("communityPostText").value.trim(), file = $("communityPostImage").files?.[0];
  if (!group || (!text && !file)) return;
  const btn = $("communityPostSubmit"); btn.disabled = true;
  try {
    let imageURL = "";
    if (file) { if (!file.type.startsWith("image/") || file.size > 10*1024*1024) throw new Error("১০ MB-এর কম আকারের ছবি নির্বাচন করুন।"); imageURL = await uploadBondingImage(file); }
    await addDoc(collection(db, "communities", group.id, "posts"), {
      uid: state.user.uid, name: state.user.displayName || state.user.email || "সদস্য",
      text, ...(imageURL ? {imageURL} : {}), createdAt: serverTimestamp()
    });
    $("communityPostText").value = ""; $("communityPostImage").value = "";
    await renderCommunityPosts(); showToast("কমিউনিটিতে পোস্ট প্রকাশ হয়েছে।");
  } catch (error) { showToast(error.message || readableError(error)); }
  finally { btn.disabled = false; }
});
$("communityDetailClose")?.addEventListener("click", () => $("communityDetailModal").classList.add("hidden"));

/* Tanim AI front-end. The API key stays on the server, never in this browser app. */
const aiHistory = [];
function addAiBubble(text, role) {
  const host = $("tanimAiMessages"); if (!host) return;
  const bubble = document.createElement("div"); bubble.className = `ai-bubble ${role === "user" ? "ai-user" : "ai-assistant"}`;
  bubble.textContent = text; host.append(bubble); host.scrollTop = host.scrollHeight;
}
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
  });
}
$("tanimAiButton")?.addEventListener("click", () => $("tanimAiPanel")?.classList.toggle("hidden"));
$("closeTanimAi")?.addEventListener("click", () => $("tanimAiPanel")?.classList.add("hidden"));
$("tanimAiForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const input = $("tanimAiInput"), fileInput = $("tanimAiImage");
  const message = input.value.trim(), file = fileInput.files?.[0];
  if (!message && !file) return;
  if (file && (!file.type.startsWith("image/") || file.size > 4 * 1024 * 1024)) return showToast("৪ MB-এর কম আকারের ছবি নির্বাচন করুন।");
  if (message) addAiBubble(message, "user");
  else addAiBubble("একটি ছবি বিশ্লেষণ করুন", "user");
  input.value = ""; const send = $("tanimAiForm").querySelector("button"); send.disabled = true;
  try {
    const payload = { message, history: aiHistory.slice(-12) };
    if (file) payload.image = await fileToDataUrl(file);
    const idToken = await state.user.getIdToken();
    const response = await fetch("/.netlify/functions/tanim-ai", {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` }, body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "AI সার্ভারের সঙ্গে সংযোগ করা যায়নি।");
    const answer = data.reply || "দুঃখিত, উত্তর পাওয়া যায়নি।";
    addAiBubble(answer, "assistant");
    aiHistory.push({ role: "user", content: message || "ছবি বিশ্লেষণ করুন" }, { role: "assistant", content: answer });
  } catch (error) {
    addAiBubble(error.message.includes("Failed to fetch") ? "Tanim AI সার্ভার এখনো প্রকাশ করা হয়নি। Netlify-এ Function deploy এবং OPENAI_API_KEY সেট করতে হবে।" : error.message, "assistant");
  } finally { send.disabled = false; fileInput.value = ""; }
});


/* Restore settings */
applyLanguage();
applyTheme();

$("openAdminDashboard")?.addEventListener("click", openAdminDashboard);
$("adminRefreshBtn")?.addEventListener("click", refreshAdminDashboard);
$("adminBackBtn")?.addEventListener("click", () => openPage("settingsPage"));
$("adminUserSearch")?.addEventListener("input", renderAdminUsers);
$("assignAdminBtn")?.addEventListener("click", assignAdminRole);

/* Keep the UI in sync with Firebase Authentication */
onAuthStateChanged(auth, async user => {
  state.user = user;

  if (!user) {
    if (state.unsubscribeMessages) state.unsubscribeMessages();
    if (state.unsubscribeChats) state.unsubscribeChats();
    if (state.unsubscribeFeed) state.unsubscribeFeed();
    if (unsubscribeStories) unsubscribeStories();

    state.unsubscribeMessages = null;
    state.unsubscribeChats = null;
    state.unsubscribeFeed = null;
    state.peer = null;
    state.adminRole = null;
    state.isSuperAdmin = false;
    $("adminEntryPanel")?.classList.add("hidden");

    showSignedOutView();
    return;
  }

  try {
    await ensureUserProfile(user);
    await loadAdminAccess();
    showSignedInView(user);
    await loadMyProfile();
    renderSocialLists().catch(error => {
      console.warn("Social lists unavailable until updated Firestore rules are published:", error);
      showToast("বন্ধুত্ব ফিচারের জন্য নতুন Firestore Rules Publish করতে হবে।");
    });
    listenToChats(user);
    listenToFeed();
    listenToStories();
    renderUserDirectory("friendsDirectory");
    renderUserDirectory("chatsDirectory");
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
