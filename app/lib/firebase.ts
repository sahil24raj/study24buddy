import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  setDoc,
  getDoc
} from "firebase/firestore";

// Firebase configuration keys (loaded dynamically from Next.js environment)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if Firebase environment variables are loaded
const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_firebase_api_key_here";

let app;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 Study Buddy: Firebase Cloud successfully initialized!");
  } catch (error) {
    console.error("⚠️ Failed to initialize cloud Firebase instance: ", error);
  }
} else {
  console.log("⚡ Study Buddy: Running inside persistent offline sandbox mock driver.");
}

// -------------------------------------------------------------
// PRODUCTION GOOGLE AUTH & FIRESTORE DATABASE DRIVERS
// -------------------------------------------------------------
export const firebaseService = {
  isCloudMode: isFirebaseConfigured,

  // --- AUTHENTICATION API ---
  auth: {
    // Check active local user session
    getCurrentUser: () => {
      if (isFirebaseConfigured && auth) {
        return auth.currentUser;
      }
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("sb_session_user");
        return stored ? JSON.parse(stored) : null;
      }
      return null;
    },

    // Standard email/password manual registration
    signUp: async (email: string, passwordHash: string, name: string, role: "student" | "faculty" | "admin", branch: string, semester: number) => {
      const isTargetAdmin = email.toLowerCase() === "sr24sahil@gmail.com" || email.toLowerCase().includes("admin");
      const newUser = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        name: email.toLowerCase() === "sr24sahil@gmail.com" ? "Sahil Raj (Admin)" : name,
        email,
        role: isTargetAdmin ? "admin" : role,
        academicDetails: { branch, semester, college: "State Technical University" },
        gamification: { xp: 10, level: 1, streak: 1 },
        createdAt: new Date().toISOString()
      };

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, "users", newUser.id), newUser);
        } catch (e) {
          console.error("Firestore user save failed: ", e);
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("sb_session_user", JSON.stringify(newUser));
        const users = JSON.parse(localStorage.getItem("sb_users_db") || "[]");
        users.push(newUser);
        localStorage.setItem("sb_users_db", JSON.stringify(users));
      }
      return newUser;
    },

    // Simulated email Sign-In
    signIn: async (email: string, passwordHash: string) => {
      if (isFirebaseConfigured && db) {
        try {
          const usersRef = collection(db, "users");
          const qSnapshot = await getDocs(usersRef);
          let matchedCloudUser: any = null;
          qSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.email.toLowerCase() === email.toLowerCase()) {
              matchedCloudUser = { id: doc.id, ...data };
            }
          });
          if (matchedCloudUser) {
            if (typeof window !== "undefined") {
              localStorage.setItem("sb_session_user", JSON.stringify(matchedCloudUser));
            }
            return matchedCloudUser;
          }
        } catch (e) {
          console.error("Firestore signin failed: ", e);
        }
      }

      if (typeof window !== "undefined") {
        const users = JSON.parse(localStorage.getItem("sb_users_db") || "[]");
        let matched = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        const isTargetAdmin = email.toLowerCase() === "admin@buddy.edu" || email.toLowerCase() === "admin@studybuddy.com" || email.toLowerCase() === "sr24sahil@gmail.com";
        if (isTargetAdmin) {
          matched = {
            id: "usr_admin_1",
            name: email.toLowerCase() === "sr24sahil@gmail.com" ? "Sahil Raj (Admin)" : "Admin Desk",
            email: email,
            role: "admin",
            academicDetails: { branch: "CSE", semester: 8, college: "State Tech Admin HQ" },
            gamification: { xp: 850, level: 5, streak: 30 },
            createdAt: new Date().toISOString()
          };
        }

        if (!matched) {
          matched = {
            id: "usr_default_2",
            name: email.split("@")[0],
            email,
            role: (email.includes("admin") || email.toLowerCase() === "sr24sahil@gmail.com") ? "admin" : "student",
            academicDetails: { branch: "CSE", semester: 4, college: "State Technical University" },
            gamification: { xp: 240, level: 2, streak: 14 },
            createdAt: new Date().toISOString()
          };
        }

        localStorage.setItem("sb_session_user", JSON.stringify(matched));
        return matched;
      }
      return null;
    },

    // REAL FIREBASE SIGN IN WITH GOOGLE OAUTH POPUP (With error catch logic)
    signInWithGoogle: async () => {
      if (isFirebaseConfigured && auth && db) {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          let userData;
          const isTargetAdmin = user.email?.toLowerCase() === "sr24sahil@gmail.com" || user.email?.includes("admin");
          if (!userSnap.exists()) {
            userData = {
              id: user.uid,
              name: user.email?.toLowerCase() === "sr24sahil@gmail.com" ? "Sahil Raj (Admin)" : (user.displayName || "Google Scholar"),
              email: user.email || "",
              role: isTargetAdmin ? "admin" : "student",
              academicDetails: { branch: "CSE", semester: 4, college: "State Technical University" },
              gamification: { xp: 50, level: 1, streak: 1 },
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, userData);
          } else {
            userData = userSnap.data();
            // Force upgrade role to admin if target email matches sr24sahil@gmail.com
            if (isTargetAdmin && userData.role !== "admin") {
              userData.role = "admin";
              await setDoc(userRef, userData, { merge: true });
            }
          }
          
          if (typeof window !== "undefined") {
            localStorage.setItem("sb_session_user", JSON.stringify(userData));
          }
          return { success: true, user: userData };
        } catch (e: any) {
          console.error("❌ Firebase Google Sign-In Exception: ", e);
          return { 
            success: false, 
            error: e.code || "unknown-error", 
            message: e.message || String(e) 
          };
        }
      } else {
        // Persistent Offline Mock Fallback: Instantly logs in as verified Admin
        const mockAdmin = {
          id: "usr_admin_1",
          name: "Sahil Raj (Admin)",
          email: "sr24sahil@gmail.com",
          role: "admin",
          academicDetails: { branch: "CSE", semester: 8, college: "State Tech Admin HQ" },
          gamification: { xp: 850, level: 5, streak: 30 },
          createdAt: new Date().toISOString()
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("sb_session_user", JSON.stringify(mockAdmin));
        }
        return { success: true, user: mockAdmin };
      }
    },

    signOut: async () => {
      if (isFirebaseConfigured && auth) {
        await firebaseSignOut(auth);
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("sb_session_user");
      }
    }
  },

  // --- FIRESTORE DATABASE API ---
  db: {
    // Dynamic Directory Folders Fetch
    getFolders: async () => {
      if (isFirebaseConfigured && db) {
        try {
          const qSnapshot = await getDocs(collection(db, "folders"));
          const cloudFolders: any[] = [];
          qSnapshot.forEach((doc) => {
            cloudFolders.push({ id: doc.id, ...doc.data() });
          });
          if (cloudFolders.length > 0) return cloudFolders;
        } catch (e) {
          console.error("Firestore getFolders failed: ", e);
        }
      }

      // Local storage fallback
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("sb_folders_db");
        if (stored) return JSON.parse(stored);

        const defaultFolders = [
          // Notes tree: B.Tech > CSE AI & ML > DSA > Unit 5
          { id: "f_btech", name: "B.Tech", parentId: null, type: "notes", createdAt: new Date().toISOString() },
          { id: "f_cse_aiml", name: "CSE AI & ML", parentId: "f_btech", type: "notes", createdAt: new Date().toISOString() },
          { id: "f_dsa", name: "DSA", parentId: "f_cse_aiml", type: "notes", createdAt: new Date().toISOString() },
          { id: "f_u5", name: "Unit 5", parentId: "f_dsa", type: "notes", createdAt: new Date().toISOString() },
          
          // Short notes tree: Formulas > Math
          { id: "f_rev", name: "Quick Revision Formulas", parentId: null, type: "shortnotes", createdAt: new Date().toISOString() },
          { id: "f_math_sem2", name: "Applied Mathematics-II", parentId: "f_rev", type: "shortnotes", createdAt: new Date().toISOString() },
          { id: "f_cheat", name: "Placement Cheat Sheets", parentId: null, type: "shortnotes", createdAt: new Date().toISOString() }
        ];
        localStorage.setItem("sb_folders_db", JSON.stringify(defaultFolders));
        return defaultFolders;
      }
      return [];
    },

    // Create dynamic folder
    createFolder: async (name: string, parentId: string | null, type: "notes" | "shortnotes") => {
      const payload = {
        name,
        parentId,
        type,
        createdAt: new Date().toISOString()
      };

      if (isFirebaseConfigured && db) {
        try {
          const docRef = await addDoc(collection(db, "folders"), payload);
          return { id: docRef.id, ...payload };
        } catch (e) {
          console.error("Firestore createFolder failed: ", e);
        }
      }

      // Local storage fallback
      if (typeof window !== "undefined") {
        const folders = JSON.parse(localStorage.getItem("sb_folders_db") || "[]");
        const newFolder = { id: "folder_" + Math.random().toString(36).substr(2, 9), ...payload };
        folders.push(newFolder);
        localStorage.setItem("sb_folders_db", JSON.stringify(folders));
        return newFolder;
      }
      return null;
    },

    // Delete dynamic folder recursively
    deleteFolder: async (folderId: string) => {
      if (isFirebaseConfigured && db) {
        try {
          const { deleteDoc } = await import("firebase/firestore");
          await deleteDoc(doc(db, "folders", folderId));
          // NOTE: Production Firestore handles recursive deletion best via cloud functions,
          // or sequential loops on queried child folders. We mirror the robust recursive model below:
        } catch (e) {
          console.error("Firestore deleteFolder failed: ", e);
        }
      }

      if (typeof window !== "undefined") {
        const folders = JSON.parse(localStorage.getItem("sb_folders_db") || "[]");
        const notes = JSON.parse(localStorage.getItem("sb_notes_db") || "[]");

        // Helper to find all subfolders recursively
        const getSubfoldersRecursive = (startId: string): string[] => {
          let result = [startId];
          let queue = [startId];
          while (queue.length > 0) {
            const currId = queue.shift()!;
            const children = folders.filter((f: any) => f.parentId === currId);
            for (const child of children) {
              if (!result.includes(child.id)) {
                result.push(child.id);
                queue.push(child.id);
              }
            }
          }
          return result;
        };

        const targetFolderIds = getSubfoldersRecursive(folderId);

        // Filter out folders and notes contained inside those folders
        const remainingFolders = folders.filter((f: any) => !targetFolderIds.includes(f.id));
        const remainingNotes = notes.filter((n: any) => !targetFolderIds.includes(n.folderId));

        localStorage.setItem("sb_folders_db", JSON.stringify(remainingFolders));
        localStorage.setItem("sb_notes_db", JSON.stringify(remainingNotes));
        return true;
      }
      return false;
    },

    // Dynamic database notes retrieval
    getNotes: async () => {
      if (isFirebaseConfigured && db) {
        try {
          const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const cloudNotes: any[] = [];
          querySnapshot.forEach((doc) => {
            cloudNotes.push({ id: doc.id, ...doc.data() });
          });
          return cloudNotes;
        } catch (e) {
          console.error("Firestore getNotes failed: ", e);
        }
      }

      // Local storage fallback
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("sb_notes_db");
        if (stored) return JSON.parse(stored);

        const defaultNotes = [
          // Notes: Unit 5 inside DSA
          { id: "note_1", title: "DSA Unit 5 Notes - Graph Traversals & Spanning Trees", folderId: "f_u5", type: "notes", author: "Dr. Aman Deep", status: "approved", likes: 42, downloads: 88, fileName: "dsa_u5_graphs.pdf", fileSize: "1.8 MB", createdAt: new Date().toISOString() },
          
          // Notes: DSA level
          { id: "note_2", title: "DBMS Normalization Guide Cheat Sheet", folderId: "f_dsa", type: "notes", author: "Prof. Simran Kaur", status: "approved", likes: 28, downloads: 64, fileName: "dbms_normalization.pdf", fileSize: "1.2 MB", createdAt: new Date().toISOString() },
          
          // Short Notes: Mathematical formulas
          { id: "note_3", title: "Applied Math-II Vector Integration Formulas", folderId: "f_math_sem2", type: "shortnotes", author: "Dr. Rajesh Vashisht", status: "approved", likes: 35, downloads: 72, fileName: "math2_formulas.pdf", fileSize: "420 KB", createdAt: new Date().toISOString() },
          
          // Short Notes: Placement
          { id: "note_4", title: "SDE Interview Technical Java Cheat Sheet", folderId: "f_cheat", type: "shortnotes", author: "Prof. Vikram Aditya", status: "approved", likes: 55, downloads: 110, fileName: "java_cheat_sheet.pdf", fileSize: "680 KB", createdAt: new Date().toISOString() }
        ];
        localStorage.setItem("sb_notes_db", JSON.stringify(defaultNotes));
        return defaultNotes;
      }
      return [];
    },

    // Real Firestore notes uploader mapped by folder node
    addNote: async (noteData: { 
      title: string; 
      folderId: string | null;
      type: "notes" | "shortnotes";
      author: string; 
      isAdmin: boolean;
      fileName?: string;
      fileSize?: string;
    }) => {
      const payload = {
        title: noteData.title,
        folderId: noteData.folderId,
        type: noteData.type,
        author: noteData.author,
        status: noteData.isAdmin ? "approved" : "pending",
        likes: 0,
        downloads: 0,
        fileName: noteData.fileName || "attachment_notes.pdf",
        fileSize: noteData.fileSize || "1.4 MB",
        createdAt: new Date().toISOString()
      };

      if (isFirebaseConfigured && db) {
        try {
          const docRef = await addDoc(collection(db, "notes"), payload);
          return { id: docRef.id, ...payload };
        } catch (e) {
          console.error("Firestore addNote failed: ", e);
        }
      }

      // Local storage fallback
      if (typeof window !== "undefined") {
        const notes = JSON.parse(localStorage.getItem("sb_notes_db") || "[]");
        const newNote = { id: "note_" + Math.random().toString(36).substr(2, 9), ...payload };
        notes.unshift(newNote);
        localStorage.setItem("sb_notes_db", JSON.stringify(notes));
        return newNote;
      }
      return null;
    },

    // Real Firestore notes reviewer / approver
    approveNote: async (noteId: string) => {
      if (isFirebaseConfigured && db) {
        try {
          const docRef = doc(db, "notes", noteId);
          await updateDoc(docRef, { status: "approved" });
          return true;
        } catch (e) {
          console.error("Firestore approveNote failed: ", e);
        }
      }

      // Local storage fallback
      if (typeof window !== "undefined") {
        const notes = JSON.parse(localStorage.getItem("sb_notes_db") || "[]");
        const updated = notes.map((n: any) => {
          if (n.id === noteId) {
            return { ...n, status: "approved" };
          }
          return n;
        });
        localStorage.setItem("sb_notes_db", JSON.stringify(updated));
        return true;
      }
      return false;
    },

    // Delete notes catalog
    deleteNote: async (noteId: string) => {
      if (isFirebaseConfigured && db) {
        try {
          const { deleteDoc } = await import("firebase/firestore");
          await deleteDoc(doc(db, "notes", noteId));
          return true;
        } catch (e) {
          console.error("Firestore deleteNote failed: ", e);
        }
      }
      if (typeof window !== "undefined") {
        const notes = JSON.parse(localStorage.getItem("sb_notes_db") || "[]");
        const filtered = notes.filter((n: any) => n.id !== noteId);
        localStorage.setItem("sb_notes_db", JSON.stringify(filtered));
        return true;
      }
      return false;
    },

    // Real Firestore progress tracking logs
    getProgressLogs: async () => {
      if (isFirebaseConfigured && db) {
        try {
          const q = query(collection(db, "progress_logs"), orderBy("day", "asc"));
          const querySnapshot = await getDocs(q);
          const cloudLogs: any[] = [];
          querySnapshot.forEach((doc) => {
            cloudLogs.push(doc.data());
          });
          if (cloudLogs.length > 0) return cloudLogs;
        } catch (e) {
          console.error("Firestore getProgressLogs failed: ", e);
        }
      }

      // Local storage fallback
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("sb_tracker_db");
        if (stored) return JSON.parse(stored);

        const defaultLogs = [
          { day: "Mon", study: 4.5, coding: 2.0, gym: 1.0, projects: 1.5, productivity: 78 },
          { day: "Tue", study: 3.0, coding: 3.5, gym: 0, projects: 2.0, productivity: 82 },
          { day: "Wed", study: 5.0, coding: 4.0, gym: 1.0, projects: 1.0, productivity: 90 },
          { day: "Thu", study: 2.5, coding: 3.0, gym: 1.0, projects: 2.5, productivity: 75 },
          { day: "Fri", study: 4.0, coding: 5.0, gym: 0, projects: 3.0, productivity: 95 },
          { day: "Sat", study: 6.0, coding: 2.5, gym: 1.0, projects: 4.0, productivity: 88 },
          { day: "Sun", study: 3.5, coding: 3.0, gym: 1.0, projects: 1.5, productivity: 80 }
        ];
        localStorage.setItem("sb_tracker_db", JSON.stringify(defaultLogs));
        return defaultLogs;
      }
      return [];
    },

    // Real Firestore daily activity logging
    addProgressLog: async (log: { study: number; coding: number; gym: number; projects: number }) => {
      const newLogEntry = {
        day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
        study: log.study,
        coding: log.coding,
        gym: log.gym,
        projects: log.projects,
        productivity: Math.min(100, Math.round((log.study * 10 + log.coding * 12 + log.projects * 8) / 1.1))
      };

      if (isFirebaseConfigured && db) {
        try {
          await addDoc(collection(db, "progress_logs"), newLogEntry);
          const q = query(collection(db, "progress_logs"), orderBy("day", "asc"));
          const querySnapshot = await getDocs(q);
          const cloudLogs: any[] = [];
          querySnapshot.forEach((doc) => {
            cloudLogs.push(doc.data());
          });
          return cloudLogs.slice(-7);
        } catch (e) {
          console.error("Firestore addProgressLog failed: ", e);
        }
      }

      // Local storage fallback
      if (typeof window !== "undefined") {
        const logs = JSON.parse(localStorage.getItem("sb_tracker_db") || "[]");
        logs.shift();
        logs.push(newLogEntry);
        localStorage.setItem("sb_tracker_db", JSON.stringify(logs));
        return logs;
      }
      return [];
    }
  }
};
