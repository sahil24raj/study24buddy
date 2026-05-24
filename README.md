# 🎓 Study Buddy - AI-Powered Student Hub & Dynamic Syllabus Directory

**Study Buddy** is a premium, high-fidelity student SaaS platform designed for B.Tech, BCA, MCA, and Diploma students. It combines real-time study tracking, interactive mock test generation, placement preparation ATS toolsets, an active peer-to-peer community forum, and a fully dynamic **Split Parent-Child Syllabus Filesystem** for notes distribution.

Built with a gorgeous, high-fidelity dark-mode interface utilizing modern glassmorphism, responsive visual charts, and rich animated feedback toasts.

---

## 🚀 Key Features

### 1. 📚 Dynamic Syllabus Filesystem (Notes vs. Short Notes)
* **Dual Category Splits**: Separates academic content into **Notes Archive** (📚 complete lectures and syllabus guides) and **Short Notes Quick-Ref** (⚡ formulas, vector sheets, and high-yield study revisions).
* **Parent-Child Node Directory Explorer**: Standard flat category lists are replaced with a dynamic directory structure allowing unlimited nested folders (e.g. `B.Tech > CSE AI & ML > DSA > Unit 5`).
* **Path-Traced Breadcrumbs**: Dynamic navigation trails (e.g. `🏠 Notes Root / B.Tech / CSE AI & ML / DSA / Unit 5`) display the active location, allowing users to pop the navigation stack with a single click.

### 2. 🛠️ Administrator direct Folder Builder
* **📁 Folder Creation Modal**: Admins (`userRole === "admin"`) can dynamically insert new subdirectories at the current explorer level. An elegant glassmorphic modal overlay captures details and links them to the active parent node instantly.
* **🗑️ Recursive Subfolder Deletion**: Allows admins to recursively delete any directory node. The database deletes the folder, all nested subfolders, and all residing PDF notes using a robust breadth-first search cleanup algorithm.
* **🗑️ Direct PDF purging**: Admins have direct notes-deletion controllers embedded inside the active directory grid lists.

### 3. 💾 Simulated PDF Upload Progress Mappings
* **Dynamic Mappings**: Since the active directory path already encodes the subject, branch, and semester coordinates, the file uploader maps PDF notes directly to the selected directory node.
* **Logs Console Console**: Tracks multi-stage simulated secure gateway logs, including text-density verification, plagiarism scans, database commits, and indexing logs.

### 4. ⚡ Core Student SaaS Modules
* **📊 Gamified Study Tracker**: Track daily coding, gym, projects, and study hours with dynamic Recharts area and bar graphs, earning XP and levels.
* **🧠 Subjective Mock Tests**: Practice subjective examinations with a visual countdown timer and a clean markdown sheet layout.
* **💼 Placement ATS Checker**: Copy-paste resumes and job descriptions to get instant ATS scores, keyword gaps, and interview prep questions.
* **💬 Peer Community Forum**: Ask and accept answers inside high-fidelity question card threads with reputation metrics.

---

## 🛠️ Technology Stack
* **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, React 19)
* **Styling**: Vanilla CSS + Tailwind CSS utilities
* **Icons**: [Lucide React](https://lucide.dev/)
* **Charts & Analytics**: [Recharts](https://recharts.org/) (SVG responsive charts)
* **Database & Auth**: [Firebase Cloud Suite](https://firebase.google.com/) (Google Authentication SSO popup, Cloud Firestore Database) + Persistent Offline Sandboxes (`sb_folders_db`, `sb_notes_db`) fallback driver.

---

## 📦 Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sahil24raj/study24buddy.git
   cd study24buddy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` inside your browser to view the application in action.

---

## ☁️ Deploying on Vercel (Step-by-Step)

Because the Next.js application has been restructured to live at the **root level of the repository**, it will deploy out-of-the-box on Vercel with zero directory configuration!

### Step 1: Push Code to your GitHub Remote
Make sure your latest local code is pushed to your remote repository:
```bash
git add .
git commit -m "Configure root layout for direct out-of-the-box Vercel deployment"
git push origin main
```

### Step 2: Import Project on Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/) and click **"Add New"** ➔ **"Project"**.
2. Select your repository: `sahil24raj/study24buddy`.
3. In the project setup page:
   - **Framework Preset**: Next.js (detected automatically).
   - **Root Directory**: Leave empty/default (`./`).
   - **Build & Development Settings**: Default settings will work out-of-the-box.

### Step 3: Add Environment Variables (Optional)
If you are running in production cloud mode with real Google Firebase integration, toggle the **"Environment Variables"** dropdown and add the following keys:
* `NEXT_PUBLIC_FIREBASE_API_KEY`
* `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
* `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
* `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
* `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
* `NEXT_PUBLIC_FIREBASE_APP_ID`

*Note: If these environment variables are not supplied, the application will automatically run in the high-fidelity offline mock sandbox mode, saving all your folder structures, PDF uploads, tracker logs, and admin states locally inside the browser's persistent LocalStorage cache!*

### Step 4: Deploy!
Click **"Deploy"**. Vercel will bundle the Next.js app, optimize all assets, compile typescript interfaces, and make the application live on `study24buddy.vercel.app` in under a minute!
