"use client";

import React, { useState, useEffect, useRef } from "react";
import { firebaseService } from "./lib/firebase";
import { 
  BookOpen, 
  GraduationCap, 
  Flame, 
  Activity, 
  MessageSquare, 
  User, 
  Shield, 
  Upload, 
  Plus, 
  Search, 
  Check, 
  X, 
  Send, 
  Award, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Lock, 
  Trophy, 
  ChevronRight, 
  Code2, 
  CheckCircle2, 
  Target, 
  FileText, 
  Calendar, 
  ArrowRight, 
  Brain, 
  ExternalLink, 
  Briefcase, 
  FileCheck2, 
  UserCheck, 
  ThumbsUp, 
  Download, 
  Share2,
  AlertCircle,
  Folder,
  Trash2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

// TypeScript Interfaces for internal Mock States
interface Note {
  id: string;
  title: string;
  subject?: string;
  branch?: string;
  semester?: number;
  unit?: number;
  folderId: string | null;
  type: "notes" | "shortnotes";
  author: string;
  status: "pending" | "approved";
  likes: number;
  downloads: number;
  fileName?: string;
  fileSize?: string;
  createdAt?: string;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  reputation: number;
  tags: string[];
  votes: number;
  replies: number;
  hasAccepted: boolean;
}

export default function StudyBuddyApp() {
  // Global App States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "library" | "mock-test" | "tracker" | "ai-friend" | "skills" | "placements" | "community" | "admin"
  >("dashboard");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  // User States (Gamification Metrics)
  const [xp, setXp] = useState(240);
  const [level, setLevel] = useState(2);
  const [streak, setStreak] = useState(14);
  const [xpCelebration, setXpCelebration] = useState<{ amount: number; message: string } | null>(null);
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);

  // User details states (Firebase synced)
  const [userName, setUserName] = useState("Alex Mercer");
  const [userRole, setUserRole] = useState<"student" | "faculty" | "admin">("student");
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Digital Library states
  const [notes, setNotes] = useState<Note[]>([]);

  // On-boot Firebase initialization
  useEffect(() => {
    const initFirebaseData = async () => {
      // 1. Fetch current auth details
      const currentUser = firebaseService.auth.getCurrentUser();
      if (currentUser) {
        setIsAuthenticated(true);
        setUserName(currentUser.name);
        setUserRole(currentUser.role);
        setXp(currentUser.gamification.xp);
        setLevel(currentUser.gamification.level);
        setStreak(currentUser.gamification.streak);
      }
      
      // 2. Fetch database records
      const dbNotes = await firebaseService.db.getNotes();
      setNotes(dbNotes);

      const dbFolders = await firebaseService.db.getFolders();
      setFolders(dbFolders);

      const dbLogs = await firebaseService.db.getProgressLogs();
      setTrackerLogs(dbLogs);
    };
    initFirebaseData();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Library Notes Upload Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: ""
  });

  // Dynamic Library Filesystem State Hooks
  const [activeSection, setActiveSection] = useState<"notes" | "shortnotes">("notes");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // PDF Selector and simulated Upload progress states
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLogs, setUploadLogs] = useState<string[]>([]);

  // Subjective Mock Test States
  const [mockSubject, setMockSubject] = useState("Operating Systems");
  const [mockUnit, setMockUnit] = useState("Unit 2 - CPU Scheduling");
  const [mockDifficulty, setMockDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [mockType, setMockType] = useState<"2_marks" | "5_marks" | "10_marks">("5_marks");
  
  const [mockTestState, setMockTestState] = useState<"setup" | "generating" | "testing" | "grading" | "report">("setup");
  const [mockTimer, setMockTimer] = useState(600); // 10 minutes in seconds
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [mockQuestions, setMockQuestions] = useState<Array<{ text: string; maxMarks: number; model: string }>>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>(["", ""]);
  const [gradingReport, setGradingReport] = useState<any>(null);

  // Progress Logging states
  const [trackerLogs, setTrackerLogs] = useState([
    { day: "Mon", study: 4.5, coding: 2.0, gym: 1.0, projects: 1.5, productivity: 78 },
    { day: "Tue", study: 3.0, coding: 3.5, gym: 0, projects: 2.0, productivity: 82 },
    { day: "Wed", study: 5.0, coding: 4.0, gym: 1.0, projects: 1.0, productivity: 90 },
    { day: "Thu", study: 2.5, coding: 3.0, gym: 1.0, projects: 2.5, productivity: 75 },
    { day: "Fri", study: 4.0, coding: 5.0, gym: 0, projects: 3.0, productivity: 95 },
    { day: "Sat", study: 6.0, coding: 2.5, gym: 1.0, projects: 4.0, productivity: 88 },
    { day: "Sun", study: 3.5, coding: 3.0, gym: 1.0, projects: 1.5, productivity: 80 }
  ]);
  const [logForm, setLogForm] = useState({ study: 4, coding: 3, gym: 1, projects: 2 });
  const [aiBestVersionReport, setAiBestVersionReport] = useState<any>({
    productivityScore: 84,
    focusScore: 88,
    consistencyScore: 92,
    timeWastedInsight: "You spent slightly too long in context switching between academic study and coding projects on Tuesday. Consolidating your study blocks improved your Friday focus.",
    tomorrowPlan: [
      "Prioritize Graph algorithm puzzles before noon",
      "Dedicate 1.5 hours strictly to DBMS Normalization notes",
      "Hit the gym for 45 minutes to keep brain clarity high"
    ],
    weeklyGoals: [
      "Keep average coding volume above 3.5 hours per day",
      "Submit 2 high-quality PDFs to the Digital Library"
    ]
  });

  // AI Friend Chat States
  const [chatMode, setChatMode] = useState<"study" | "coding" | "placement" | "motivation">("study");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hey! I'm your AI College Friend. Choose a mode on the top panel and ask me anything about academics, code syntax, DSA logic, or placement strategy!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Skill Tracker states
  const [isSyncingProfiles, setIsSyncingProfiles] = useState(false);
  const [isProfileSynced, setIsProfileSynced] = useState(false);
  const [manualSkills, setManualSkills] = useState<string[]>(["React", "Node.js", "MongoDB", "Python"]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [skillsAnalysis, setSkillsAnalysis] = useState<any>({
    level: "Intermediate SDE",
    strongAreas: ["Frontend Architecture", "Dynamic Web Apps", "NoSQL Schema Design"],
    weakAreas: ["Dynamic Programming", "Relational Database Indexing", "Docker Containers"],
    missingSkills: ["TypeScript", "Redis Cache", "System Design Basics"]
  });

  // Placement Hub states
  const [dsaProblems, setDsaProblems] = useState([
    { id: 1, title: "Two Sum", difficulty: "Easy", solved: true, platform: "LeetCode" },
    { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", solved: true, platform: "LeetCode" },
    { id: 3, title: "Merge Intervals", difficulty: "Medium", solved: false, platform: "LeetCode" },
    { id: 4, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", solved: false, platform: "LeetCode" },
    { id: 5, title: "Reverse Linked List", difficulty: "Easy", solved: true, platform: "LeetCode" }
  ]);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isAtsEvaluating, setIsAtsEvaluating] = useState(false);
  const [atsFeedback, setAtsFeedback] = useState<string[]>([]);
  const [interviewState, setInterviewState] = useState<"setup" | "active" | "report">("setup");
  const [interviewRole, setInterviewRole] = useState("Full Stack Developer");
  const [interviewMessages, setInterviewMessages] = useState<Array<{ sender: "interviewer" | "student"; text: string }>>([]);
  const [interviewInput, setInterviewInput] = useState("");
  const [interviewReport, setInterviewReport] = useState<any>(null);

  // Community Forum State
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    { id: "1", title: "How to resolve memory leaks in Next.js Server Components?", author: "Aryan Sharma", reputation: 450, tags: ["nextjs", "react", "performance"], votes: 15, replies: 4, hasAccepted: true },
    { id: "2", title: "Transitive functional dependency clarification inside 3NF Normalization", author: "Priya Patel", reputation: 320, tags: ["dbms", "normalization", "academics"], votes: 12, replies: 6, hasAccepted: false },
    { id: "3", title: "Why does my Docker Compose container exit with code 0 on nodemon restart?", author: "Kabir Roy", reputation: 180, tags: ["docker", "backend", "express"], votes: 8, replies: 2, hasAccepted: false }
  ]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostTags, setNewPostTags] = useState("");

  // Sound/Vibe Celebration helper
  const triggerXpAward = (amount: number, message: string) => {
    setXp(prev => {
      const nextXp = prev + amount;
      const nextLevel = Math.floor(nextXp / 300) + 1;
      if (nextLevel > level) {
        setLevel(nextLevel);
        setLevelUpMessage(`🎉 LEVEL UP! You reached Level ${nextLevel}! Keep pushing!`);
        setTimeout(() => setLevelUpMessage(null), 6000);
      }
      return nextXp;
    });
    setXpCelebration({ amount, message });
    setTimeout(() => setXpCelebration(null), 3000);
  };

  // Mock test timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (mockTestState === "testing" && mockTimer > 0) {
      interval = setInterval(() => {
        setMockTimer(prev => prev - 1);
      }, 1000);
    } else if (mockTimer === 0 && mockTestState === "testing") {
      submitMockTest();
    }
    return () => clearInterval(interval);
  }, [mockTestState, mockTimer]);

  // Auth helper (Firebase persist signup)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = await firebaseService.auth.signUp(
      "student@buddy.edu", 
      "dummy_pwd", 
      "Jane Doe", 
      "student", 
      "CSE", 
      4
    );
    if (newUser) {
      setIsAuthenticated(true);
      setUserName(newUser.name);
      setUserRole(newUser.role);
      setXp(newUser.gamification.xp);
      setLevel(newUser.gamification.level);
      setStreak(newUser.gamification.streak);
      triggerXpAward(50, "Welcome Gift! Logged in via Firebase Auth.");
    }
  };

  // Simulated Google SSO login for Admin
  const handleGoogleSsoSimulate = async () => {
    setFirebaseError(null);
    const result = await firebaseService.auth.signInWithGoogle();
    if (result.success && result.user) {
      const adminUser = result.user;
      setIsAuthenticated(true);
      setUserName(adminUser.name);
      setUserRole(adminUser.role);
      setXp(adminUser.gamification.xp);
      setLevel(adminUser.gamification.level);
      setStreak(adminUser.gamification.streak);
      
      if (firebaseService.isCloudMode) {
        triggerXpAward(80, "Logged in via Google Popup Auth successfully! Synced with Firestore.");
      } else {
        triggerXpAward(80, "Logged in as Admin (Direct note publish unlocked) via persistent Firebase Auth!");
      }
    } else if (result.success === false) {
      setFirebaseError(`${result.error || "auth-error"}: ${result.message || "Sign-in popup closed or failed."}`);
    }
  };

  // File selection handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      // Format file size in dynamic MB format
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setSelectedFileSize(`${sizeInMB} MB`);
      triggerXpAward(10, "Selected PDF file for upload verification.");
    }
  };

  // Upload notes helper with simulated progress log generator
  const handleUploadNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title) return;
    if (!selectedFile) {
      alert("Please select a PDF study guide file to upload!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadLogs(["⏳ Initializing secure gateway interface..."]);

    const finalFileName = selectedFileName;
    const finalFileSize = selectedFileSize;
    const isAdminUpload = userRole === "admin";

    let currentProgress = 0;
    const interval = setInterval(async () => {
      currentProgress += 10;
      setUploadProgress(currentProgress);

      // Append descriptive secure database logs at intervals
      if (currentProgress === 10) {
        setUploadLogs(prev => [...prev, "🔍 Reading PDF document blocks and scanning text density..."]);
      } else if (currentProgress === 30) {
        setUploadLogs(prev => [...prev, `⚡ Analyzing document structures and tags categorization...`]);
      } else if (currentProgress === 50) {
        setUploadLogs(prev => [...prev, "🛡️ Running automated plagiarism scanner & secure virus diagnostics..."]);
      } else if (currentProgress === 70) {
        setUploadLogs(prev => [...prev, "💾 Writing verified metadata fields directly into Firestore database..."]);
      } else if (currentProgress === 90) {
        setUploadLogs(prev => [...prev, "📝 Generating searching indexes and mapping index directories..."]);
      } else if (currentProgress === 100) {
        clearInterval(interval);
        setUploadLogs(prev => [...prev, "🎉 Document successfully verified and uploaded!"]);
        
        // Save database payload
        const newNote = await firebaseService.db.addNote({
          title: uploadForm.title,
          folderId: currentFolderId,
          type: activeSection,
          author: userName,
          isAdmin: isAdminUpload,
          fileName: finalFileName,
          fileSize: finalFileSize
        });

        if (newNote) {
          const refreshedNotes = await firebaseService.db.getNotes();
          setNotes(refreshedNotes);
          
          setTimeout(() => {
            setIsUploading(false);
            setIsUploadOpen(false);
            // Reset state fields
            setSelectedFile(null);
            setSelectedFileName("");
            setSelectedFileSize("");
            setUploadForm({
              title: ""
            });
            
            if (isAdminUpload) {
              triggerXpAward(100, "Admin Direct Upload: Document live instantly inside folder!");
            } else {
              triggerXpAward(50, "PDF Upload Complete! Submitted for Admin verification.");
            }
          }, 800);
        }
      }
    }, 250);
  };

  // Folder creation helper
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder = await firebaseService.db.createFolder(
      newFolderName.trim(),
      currentFolderId,
      activeSection
    );

    if (newFolder) {
      const refreshedFolders = await firebaseService.db.getFolders();
      setFolders(refreshedFolders);
      setIsCreateFolderOpen(false);
      setNewFolderName("");
      triggerXpAward(40, `Created folder "${newFolder.name}" inside index tree.`);
    }
  };

  // Folder deletion helper
  const handleDeleteFolder = async (folderId: string) => {
    const success = await firebaseService.db.deleteFolder(folderId);
    if (success) {
      const refreshedFolders = await firebaseService.db.getFolders();
      setFolders(refreshedFolders);
      const refreshedNotes = await firebaseService.db.getNotes();
      setNotes(refreshedNotes);
      triggerXpAward(60, "Folder and all its nested subfolders successfully deleted.");
    }
  };

  // Admin approval helper
  const handleApproveNote = async (noteId: string) => {
    const success = await firebaseService.db.approveNote(noteId);
    if (success) {
      const refreshedNotes = await firebaseService.db.getNotes();
      setNotes(refreshedNotes);
      triggerXpAward(100, "Notes approved! Awarded top contributor bonus!");
    }
  };

  // Admin notes delete helper
  const handleDeleteNote = async (noteId: string) => {
    const success = await firebaseService.db.deleteNote(noteId);
    if (success) {
      const refreshedNotes = await firebaseService.db.getNotes();
      setNotes(refreshedNotes);
      triggerXpAward(60, "Note successfully deleted from database index.");
    }
  };

  // Chat message helper
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsAiThinking(true);

    setTimeout(() => {
      let aiResponse = "";
      if (chatMode === "study") {
        aiResponse = `Regarding "${userMsg}": That is a great conceptual query. In our college syllabus, this represents a core topic. Let me break it down: \n\n1. **Core Definition**: It is a key principle standardizing operations. \n2. **Academic Focus**: Professors always ask about this inside Semester exams under 5-mark and 10-mark sections. \n3. **Quick Shortcut**: Think of it as a logical pipeline routing variables without redundancies. \n\nWould you like me to generate a 5-mark subjective question on this topic?`;
      } else if (chatMode === "coding") {
        aiResponse = `I reviewed your query about "${userMsg}". Here is a clean boilerplate approach utilizing TypeScript to bypass scoping leaks: \n\n\`\`\`typescript\n// Optimized logical resolver\nfunction resolveQuery(input: string): boolean {\n  if (!input) return false;\n  console.log("Analyzing variables inside stack...");\n  return true;\n}\n\`\`\`\n\nMake sure to run your node imports securely without circular imports!`;
      } else if (chatMode === "placement") {
        aiResponse = `Companies (like Amazon, TCS Digital, and startups) focus heavily on these patterns in technical interviews. For "${userMsg}", remember to:\n\n- Define your variables clearly using modern ES6 schemas.\n- Walk the interviewer through the time complexity (e.g. O(N log N) using sorting algorithms).\n- Keep your code highly optimized. \n\nI can run a mock interviewer simulation inside our Placements tab when you're ready!`;
      } else {
        aiResponse = `College life, coding streaks, and exams can definitely cause burnout. Remind yourself: progress is cumulative! A 14-day streak 🔥 represents immense work. Spend 45 minutes coding, take a short walk, drink some water, and come back. You've got this!`;
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: aiResponse }]);
      setIsAiThinking(false);
      triggerXpAward(15, "Engaged with AI Mentor");
    }, 1500);
  };

  // Mock Test Generator helper
  const generateMockTest = () => {
    setMockTestState("generating");
    setTimeout(() => {
      let questions: any = [];
      if (mockDifficulty === "easy") {
        questions = [
          { text: "Define the core conceptual goal of " + mockSubject + " " + mockUnit + ".", maxMarks: 5, model: "Factual definition detailing the primary inputs and variables standardizing operations." },
          { text: "Why is normalization or clean sorting necessary here? State two advantages.", maxMarks: 5, model: "Provides clean architecture, reduces redundancies, and secures memory." }
        ];
      } else {
        questions = [
          { text: "Explain the architectural optimization of " + mockSubject + " under " + mockUnit + " difficulty: " + mockDifficulty + ". Contrast it with static alternatives.", maxMarks: 10, model: "Requires complete multi-stage analysis, variable mappings, constraints, mathematical formulas, and algorithmic loops." },
          { text: "Solve this scenario-based problem: An incoming system stream suffers from heavy network overhead. How do you implement a solution using " + mockSubject + " concepts?", maxMarks: 10, model: "Design buffer streams, throttle request headers, utilize caching middleware, and monitor latency thresholds." }
        ];
      }
      setMockQuestions(questions);
      setUserAnswers(new Array(questions.length).fill(""));
      setMockTimer(mockDifficulty === "easy" ? 300 : 600);
      setActiveQuestion(0);
      setMockTestState("testing");
    }, 2000);
  };

  // Mock Test Submit helper
  const submitMockTest = () => {
    setMockTestState("grading");
    setTimeout(() => {
      let breakdown = mockQuestions.map((q, idx) => {
        const textLen = userAnswers[idx].trim().length;
        let obtained = 0;
        let feed = "";
        if (textLen < 20) {
          obtained = Math.round(q.maxMarks * 0.2);
          feed = "Answer is far too brief. You missed the core definition, structural diagrams, and formulas standardizing the solution.";
        } else if (textLen < 80) {
          obtained = Math.round(q.maxMarks * 0.6);
          feed = "Decent base understanding. However, you forgot to provide a detailed proof, relation schemas, and edge case conditions.";
        } else {
          obtained = Math.round(q.maxMarks * 0.85);
          feed = "Excellent, highly thorough academic grade! You covered core equations, structural parameters, and listed real-world applications clearly.";
        }
        return { questionIndex: idx, obtainedMarks: obtained, feedback: feed };
      });

      const totalObtained = breakdown.reduce((sum, item) => sum + item.obtainedMarks, 0);
      const maxMarks = mockQuestions.reduce((sum, item) => sum + item.maxMarks, 0);

      setGradingReport({
        totalObtained,
        maxMarks,
        breakdown,
        aiSummary: {
          missingConcepts: mockDifficulty === "easy" ? ["Historical context parameters"] : ["Relational algebraic notation proofs", "Time complexity calculations"],
          improvementAreas: ["Incorporate clean ASCII or bullet-pointed architectural blocks to score higher", "Define mathematical constraints explicitly before writing final answers"],
          suggestedResources: [
            { title: "GeeksforGeeks Academic Guide", url: "https://www.geeksforgeeks.org/" },
            { title: "MIT Free Courseware Lectures", url: "https://ocw.mit.edu" }
          ]
        }
      });
      setMockTestState("report");
      triggerXpAward(150, "Finished Subjective Mock Test AI evaluation!");
    }, 2500);
  };

  // Logging Hours helper
  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLogs = await firebaseService.db.addProgressLog(logForm);
    if (updatedLogs) {
      setTrackerLogs(updatedLogs);
      setStreak(prev => prev + 1);
      
      const latestProd = Math.min(100, Math.round((logForm.study * 10 + logForm.coding * 12 + logForm.projects * 8) / 1.1));
      setAiBestVersionReport({
        productivityScore: latestProd,
        focusScore: Math.round(latestProd * 0.95),
        consistencyScore: 95,
        timeWastedInsight: `Excellent log today! You hit ${logForm.coding} hours of active coding which sets a fantastic consistency ratio. Minimizing context switches during study yielded an 88% overall productivity score.`,
        tomorrowPlan: [
          "Continue your morning coding block (solve 2 DSA recursion issues)",
          "Review DBMS relational models and complete mock evaluation report",
          "Target 45 minutes of core cardio fitness"
        ],
        weeklyGoals: [
          "Reach Level 3 on your dashboard tracker",
          "Keep daily streaks unbroken 🔥"
        ]
      });

      triggerXpAward(80, "Activity logged. Streaks increased, Best Version unlocked!");
    }
  };

  // LeetCode / GitHub Sync Simulation helper
  const simulateSyncProfiles = () => {
    setIsSyncingProfiles(true);
    setTimeout(() => {
      setIsSyncingProfiles(false);
      setIsProfileSynced(true);
      setManualSkills(prev => Array.from(new Set([...prev, "TypeScript", "Redis Cache", "System Design Basics"])));
      setSkillsAnalysis({
        level: "Advanced SDE",
        strongAreas: ["Frontend Architecture", "Asynchronous Backend Pipelines", "LeetCode Graph Algorithms"],
        weakAreas: ["Docker Containers", "CI/CD Auto-scans", "Kubernetes Clusters"],
        missingSkills: ["Kubernetes", "GraphQL", "Apache Kafka Basics"]
      });
      triggerXpAward(120, "GitHub & LeetCode profiles synchronized! Skills roadmaps updated.");
    }, 3000);
  };

  // Manual Skill Addition
  const handleAddManualSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    setManualSkills(prev => Array.from(new Set([...prev, newSkillInput.trim()])));
    setNewSkillInput("");
    triggerXpAward(20, "Added new local skill asset.");
  };

  // Solve DSA Problem helper
  const handleSolveProblem = (id: number) => {
    setDsaProblems(prev => prev.map(prob => {
      if (prob.id === id) {
        if (!prob.solved) triggerXpAward(50, "Solved DSA Problem: " + prob.title + "!");
        return { ...prob, solved: !prob.solved };
      }
      return prob;
    }));
  };

  // ATS Evaluation Simulation helper
  const handleAtsEvaluate = () => {
    setIsAtsEvaluating(true);
    setTimeout(() => {
      setIsAtsEvaluating(false);
      setAtsScore(82);
      setAtsFeedback([
        "✅ Great structural formatting. Reverse chronological layout detected.",
        "⚠️ Missing critical keywords for Full Stack roles: 'TypeScript', 'Docker', 'CI/CD'.",
        "✅ Clear project metric lines loaded (e.g. 'boosted speeds by 40%').",
        "⚠️ Make sure to use descriptive bullet points starting with actionable verbs."
      ]);
      triggerXpAward(90, "AI ATS Resume Scan complete!");
    }, 2500);
  };

  // Interview Simulator Chat helper
  const handleSendInterview = () => {
    if (!interviewInput.trim()) return;
    const stdAns = interviewInput;
    setInterviewMessages(prev => [...prev, { sender: "student", text: stdAns }]);
    setInterviewInput("");

    setTimeout(() => {
      let interviewerReply = "";
      if (interviewMessages.length === 1) {
        interviewerReply = `Excellent. Now, let's dive into some architectural choices. In a production Node/Express backend serving thousands of daily active users, how would you optimize heavy databases queries and prevent blocking the single-threaded Event Loop?`;
      } else if (interviewMessages.length === 3) {
        interviewerReply = `That makes perfect sense. Let's finish with a core question about your frontend. In Next.js, how would you design your components to secure maximum speed and minimize cumulative layout shifts?`;
      } else {
        // Complete the mock interview
        setInterviewState("report");
        setInterviewReport({
          score: 85,
          strengths: ["Excellent conceptual understanding of Node Event Loops", "Strong architectural design suggestions", "Clear and confident communication style"],
          improvements: ["Explain details using code syntax definitions where possible", "State memory and storage tradeoffs explicitly (O(1) storage spaces vs queries caches)"],
          overallStatus: "RECOMMENDED FOR PLACEMENT ROUNDS"
        });
        triggerXpAward(200, "Completed Placement Simulator Mock Interview!");
        return;
      }
      setInterviewMessages(prev => [...prev, { sender: "interviewer", text: interviewerReply }]);
    }, 1500);
  };

  // Start Interview helper
  const startInterview = () => {
    setInterviewState("active");
    setInterviewMessages([
      { sender: "interviewer", text: `Welcome to your Technical Mock Interview for ${interviewRole}. Let's begin. Can you briefly walk me through a complex dynamic web application you engineered and explain your data model structure?` }
    ]);
  };

  // Community post creation helper
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;
    const tagsArr = newPostTags.split(",").map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
    const newPost: ForumPost = {
      id: String(forumPosts.length + 1),
      title: newPostTitle,
      author: "Alex Mercer",
      reputation: 240,
      tags: tagsArr.length > 0 ? tagsArr : ["general"],
      votes: 1,
      replies: 0,
      hasAccepted: false
    };
    setForumPosts(prev => [newPost, ...prev]);
    setNewPostTitle("");
    setNewPostTags("");
    triggerXpAward(60, "Post published on Student Forum!");
  };

  // Upvote post helper
  const handleUpvotePost = (id: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === id) {
        return { ...post, votes: post.votes + 1 };
      }
      return post;
    }));
  };

  // Counts approved files inside a folder node directly
  const getNoteCountForFolder = (folderId: string) => {
    return notes.filter(n => n.folderId === folderId && (userRole === "admin" || n.status === "approved")).length;
  };

  // Digital Library filter
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (note.fileName && note.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Match catalog category type
    if (note.type !== activeSection) return false;

    // Fuzzy Search mode is active if search query is present
    if (searchQuery.trim()) {
      return matchesSearch && (userRole === "admin" || note.status === "approved");
    }

    // Otherwise, filter by current dynamic folder context
    return note.folderId === currentFolderId && (userRole === "admin" || note.status === "approved");
  });

  // Helper to trace and generate breadcrumbs stack dynamically
  const getBreadcrumbs = () => {
    if (!currentFolderId) return [];
    const crumbs = [];
    let curr = folders.find(f => f.id === currentFolderId);
    while (curr) {
      crumbs.unshift(curr);
      curr = folders.find(f => f.id === curr.parentId);
    }
    return crumbs;
  };

  // Helper to trace folder path for a note as a string (e.g. "B.Tech > DSA")
  const getFolderPathForNote = (folderId: string | null | undefined): string => {
    if (!folderId) return "Root Directory";
    const crumbs = [];
    let curr = folders.find(f => f.id === folderId);
    while (curr) {
      crumbs.unshift(curr.name);
      curr = folders.find(f => f.id === curr.parentId);
    }
    return crumbs.length > 0 ? crumbs.join(" > ") : "Root Directory";
  };

  return (
    <div className="min-h-screen flex flex-col grid-bg text-slate-100 font-sans antialiased">
      {/* 🚀 Dynamic XP Celebration Toast */}
      {xpCelebration && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border border-emerald-500/30 bg-emerald-950/80 backdrop-blur-md shadow-lg shadow-emerald-500/10 animate-bounce">
          <Award className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-400">+{xpCelebration.amount} XP Earned!</p>
            <p className="text-xs text-slate-300">{xpCelebration.message}</p>
          </div>
        </div>
      )}

      {/* 🎉 Level Up Modal Banner */}
      {levelUpMessage && (
        <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-indigo-500/40 bg-indigo-950/90 backdrop-blur-lg shadow-2xl shadow-indigo-500/30 animate-pulse">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-lg font-extrabold text-indigo-200">{levelUpMessage}</p>
              <p className="text-xs text-slate-300">Leveling up unlocks pro ATS scoring checkers and mock interviews.</p>
            </div>
          </div>
        </div>
      )}

      {/* LANDING PAGE / REGISTER SCREEN */}
      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Neon background decorations */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          
          <div className="max-w-md w-full text-center mb-8 relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-2xl glow-indigo">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <span className="text-4xl font-extrabold font-heading bg-gradient-to-r from-indigo-200 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Study Buddy
              </span>
            </div>
            <p className="text-lg text-slate-400 font-heading">
              "Your AI Powered College Companion"
            </p>
            <p className="text-sm text-slate-500 mt-2">
              The single platform managing academics, skills, coding trackers, community, and placement mock simulators.
            </p>
          </div>

          <div className="max-w-md w-full z-10 relative">
            <div className="glass-panel p-8 rounded-3xl glow-indigo border-indigo-500/20">
              <h2 className="text-xl font-bold font-heading text-slate-200 mb-6 text-center">
                Secure Instant College Access
              </h2>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Your Full Name
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Jane Doe" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    University Email
                  </label>
                  <input 
                    type="email" 
                    required 
                    placeholder="jane.doe@university.edu" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Academic Branch
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-300 focus:outline-none focus:border-indigo-500/50">
                      <option>CSE</option>
                      <option>IT</option>
                      <option>ECE</option>
                      <option>MCA</option>
                      <option>BCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Semester
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-300 focus:outline-none focus:border-indigo-500/50">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-cyan-500/20 hover:-translate-y-0.5 active:translate-y-0 transition duration-300"
                >
                  Create Student Portal
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-[#040408] text-slate-500">Or development bypass</span></div>
              </div>

              <button 
                onClick={handleGoogleSsoSimulate}
                className="w-full py-3 rounded-xl font-medium border border-slate-800 bg-slate-950/50 hover:bg-slate-950 text-slate-300 hover:text-white flex items-center justify-center gap-3 transition duration-300"
              >
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] text-red-400 font-bold">G</div>
                Simulate Google Single Sign-On
              </button>

              {firebaseError && (
                <div className="mt-4 p-3.5 rounded-xl border border-red-500/20 bg-red-950/40 text-left text-xs text-red-200 leading-normal flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Firebase Configuration Error:</p>
                    <p className="mt-1 text-[10px] text-red-300 font-mono break-all leading-relaxed">{firebaseError}</p>
                    <p className="mt-3.5 text-[10px] text-slate-400 leading-relaxed pt-2 border-t border-red-500/10">
                      💡 **Quick Fix Steps:**
                      {firebaseError.includes("operation-not-allowed") && " Go to Firebase Console > Authentication > Sign-in method, click Google, and enable it!"}
                      {firebaseError.includes("unauthorized-domain") && " Go to Firebase Console > Auth > Settings > Authorized Domains, and add 'localhost' to the approved list!"}
                      {firebaseError.includes("permission-denied") && " Go to Firebase Console > Firestore Database > Rules, and make sure read/write permissions are active!"}
                      {!firebaseError.includes("operation-not-allowed") && !firebaseError.includes("unauthorized-domain") && !firebaseError.includes("permission-denied") && " Make sure your API keys in frontend/.env.local are copied exactly from your Firebase Console Settings."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Premium feature highlight cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="glass-panel p-3.5 rounded-2xl text-center">
                <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-slate-200 uppercase">AI Mentor</p>
                <p className="text-[9px] text-slate-500 mt-1">24/7 study mode explains complex concepts.</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl text-center">
                <GraduationCap className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-slate-200 uppercase">Mock Exam</p>
                <p className="text-[9px] text-slate-500 mt-1">Subjective text grading via Gemini Pro API.</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl text-center">
                <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-slate-200 uppercase">Streak log</p>
                <p className="text-[9px] text-slate-500 mt-1">Tracks study & coding ratios dynamically.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN DASHBOARD INTERFACE */
        <div className="flex-1 flex flex-col md:flex-row relative">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full md:w-64 border-b md:border-r border-slate-900 bg-slate-950/60 backdrop-blur-md flex flex-col shrink-0">
            <div className="p-5 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold font-heading bg-gradient-to-r from-slate-100 to-indigo-300 bg-clip-text text-transparent">
                    Study Buddy
                  </h1>
                  <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">College Companion</span>
                </div>
              </div>
              
              {/* Log out option */}
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition"
                title="Log Out"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar user game board */}
            <div className="p-4 mx-3 my-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-900/40 border border-indigo-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-indigo-500/30 bg-slate-950 flex items-center justify-center font-heading font-extrabold text-indigo-400">
                  L{level}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-200">{userName}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    {userRole === "admin" ? "🛠️ ADMINISTRATOR" : "CSE • Semester 4"}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>XP: {xp} / {level * 300}</span>
                  <span>{Math.round((xp / (level * 300)) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (xp / (level * 300)) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-slate-900 pt-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-500" /> {streak} Day Streak</span>
                <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-indigo-400" /> Rank #4</span>
              </div>
            </div>

            {/* Navigation options */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${activeTab === "dashboard" ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"}`}
              >
                <Activity className="w-4 h-4" />
                Student Portal
              </button>

              <button 
                onClick={() => setActiveTab("ai-friend")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${activeTab === "ai-friend" ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"}`}
              >
                <MessageSquare className="w-4 h-4" />
                AI Mentor Chat
              </button>

              <button 
                onClick={() => setActiveTab("library")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${activeTab === "library" ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"}`}
              >
                <BookOpen className="w-4 h-4" />
                Digital Library
              </button>

              <button 
                onClick={() => setActiveTab("skills")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${activeTab === "skills" ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"}`}
              >
                <Code2 className="w-4 h-4" />
                Skill Tracker AI
              </button>

              <button 
                onClick={() => setActiveTab("mock-test")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${activeTab === "mock-test" ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"}`}
              >
                <GraduationCap className="w-4 h-4" />
                Subjective Mock Test
              </button>

              <button 
                onClick={() => setActiveTab("tracker")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${activeTab === "tracker" ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"}`}
              >
                <TrendingUp className="w-4 h-4" />
                Progress Tracker
              </button>

              <button 
                onClick={() => setActiveTab("community")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${activeTab === "community" ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"}`}
              >
                <User className="w-4 h-4" />
                Forums & Community
              </button>

              <button 
                onClick={() => setActiveTab("placements")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${activeTab === "placements" ? "bg-indigo-600/20 text-indigo-200 border-l-2 border-indigo-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"}`}
              >
                <Briefcase className="w-4 h-4" />
                Placements Simulator
              </button>

              <button 
                onClick={() => setActiveTab("admin")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${activeTab === "admin" ? "bg-red-950/20 text-red-200 border-l-2 border-red-500" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"}`}
              >
                <Shield className="w-4 h-4" />
                Admin Review Queue
              </button>
            </nav>

            <div className="p-4 border-t border-slate-900 text-center">
              <span className="text-[10px] text-slate-600 font-mono">STUDY BUDDY V1.0 PRO</span>
            </div>
          </aside>

          {/* MAIN PAGE BODY CONTAINER */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">

            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                
                {/* Header Welcome banner */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-extrabold text-slate-100 font-heading">Student Portal Home</h2>
                      {firebaseService.isCloudMode ? (
                        <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          🔥 Cloud Firestore Live
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                          ⚡ persistent sandbox db
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">Integrate coding volumes, track subjective tests, and review notes in one premium visual shell.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActiveTab("mock-test")} 
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Take AI Test
                    </button>
                    <button 
                      onClick={() => setIsUploadOpen(true)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-950 text-slate-300 transition flex items-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" /> Upload Note
                    </button>
                  </div>
                </div>

                {/* Micro metrics grids */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10">Log OK</span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-100">4.5 Hrs</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Today's Academic Study</p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <Code2 className="w-5 h-5 text-cyan-400" />
                      <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10">300 LOC</span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-100">3.0 Hrs</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Today's Active Coding</p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <span className="text-[10px] font-bold text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10">Consistency</span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-100">88%</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Productivity Score</p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl relative overflow-hidden bg-gradient-to-br from-indigo-950/20 to-slate-950/20 border-indigo-500/10">
                    <div className="flex justify-between items-start mb-3">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <span className="text-[10px] font-bold text-slate-400">Syllabus Complete</span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-100">Level {level}</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">College Scholar Rank</p>
                  </div>
                </div>

                {/* Primary Chart panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Recharts coding and study history volume */}
                  <div className="glass-panel p-5 rounded-2xl lg:col-span-2">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-400" /> Core Productivity Volume (Study vs Coding)
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trackerLogs}>
                          <defs>
                            <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCoding" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                          <XAxis dataKey="day" stroke="#475569" fontSize={11} />
                          <YAxis stroke="#475569" fontSize={11} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#090a0f', 
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '8px'
                            }} 
                            labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="study" name="Study Hours" stroke="#6366f1" fillOpacity={1} fill="url(#colorStudy)" strokeWidth={2} />
                          <Area type="monotone" dataKey="coding" name="Coding Hours" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCoding)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Best Version Insights */}
                  <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" /> AI Best Version Insights
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-indigo-950/30 border border-indigo-500/10 p-3 rounded-xl">
                          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Weekly Time Leak</p>
                          <p className="text-xs text-slate-300 mt-1">{aiBestVersionReport.timeWastedInsight}</p>
                        </div>
                        
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Tomorrow's Dynamic Plan</p>
                          <ul className="space-y-1.5">
                            {aiBestVersionReport.tomorrowPlan.map((plan: string, i: number) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                <span>{plan}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab("tracker")}
                      className="w-full mt-4 py-2.5 text-center text-xs font-semibold rounded-xl border border-indigo-500/20 bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-300 hover:text-indigo-200 transition"
                    >
                      Open Productivity logs
                    </button>
                  </div>
                </div>

                {/* Dashboard bottom: recent notes, events, leaderboards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Digital Library approved feeds */}
                  <div className="glass-panel p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan-400" /> Trending Notes Uploads
                      </h3>
                      <span onClick={() => setActiveTab("library")} className="text-xs text-indigo-400 cursor-pointer hover:underline">View All</span>
                    </div>

                    <div className="space-y-3">
                      {notes.filter(n => n.status === "approved").slice(0, 3).map((note) => (
                        <div key={note.id} className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/30 flex justify-between items-center hover:border-slate-800 transition">
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{note.title}</p>
                            <div className="flex gap-2 text-[10px] text-slate-500 mt-1.5">
                              <span>Path: <span className="text-slate-400 font-bold font-mono">{getFolderPathForNote(note.folderId)}</span></span>
                              <span>•</span>
                              <span>{note.type === "shortnotes" ? "⚡ Short Note" : "📚 Archive Note"}</span>
                            </div>
                          </div>
                          <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded-lg transition">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* College Updates Bulletins */}
                  <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" /> Official College Updates
                    </h3>

                    <div className="space-y-3.5">
                      <div className="border-l-2 border-purple-500 pl-3">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">Exam Circular</span>
                        <p className="text-xs font-semibold text-slate-200 mt-1">End Semester Laboratory Exams scheduled for June 1st.</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">Faculty Coordinators • May 24</p>
                      </div>

                      <div className="border-l-2 border-indigo-500 pl-3">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">Hackathon Event</span>
                        <p className="text-xs font-semibold text-slate-200 mt-1">Study Buddy college hackathon submissions close in 7 days. Win $500.</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">Club Coordinators • May 22</p>
                      </div>

                      <div className="border-l-2 border-amber-500 pl-3">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">Holiday Notification</span>
                        <p className="text-xs font-semibold text-slate-200 mt-1">College campus closed on May 29th for Summer Academic break.</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">Admin Desk • May 18</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: DIGITAL LIBRARY */}
            {activeTab === "library" && (
              <div className="space-y-6">
                
                {/* Header title */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-100 font-heading">Dynamic Digital Library</h2>
                    <p className="text-sm text-slate-400">Dynamically browse academic notes and cheat sheets curated by administrators.</p>
                  </div>
                </div>

                {/* VISUALLY STUNNING SPLIT SECTIONS SWITCHER TABS */}
                <div className="flex gap-4 border-b border-slate-900 pb-1 mb-5">
                  <button
                    onClick={() => {
                      setActiveSection("notes");
                      setCurrentFolderId(null);
                    }}
                    className={`pb-3 text-sm font-extrabold transition-all duration-300 relative flex items-center gap-2 ${activeSection === "notes" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    📚 Notes Archive
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("shortnotes");
                      setCurrentFolderId(null);
                    }}
                    className={`pb-3 text-sm font-extrabold transition-all duration-300 relative flex items-center gap-2 ${activeSection === "shortnotes" ? "text-amber-500 border-b-2 border-amber-500" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    ⚡ Short Notes Revision
                  </button>
                </div>

                {/* Main search bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    placeholder={activeSection === "notes" ? "Search Notes by title or keywords..." : "Search Short Notes by title or keywords..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/30 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 transition duration-300"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-3 text-xs text-slate-500 hover:text-slate-200 bg-slate-900 px-2 py-1 rounded"
                    >
                      Clear Search
                    </button>
                  )}
                </div>

                {/* Directory Navigation Tree Section */}
                {!searchQuery.trim() ? (
                  <div className="space-y-5">
                    {/* Functional breadcrumbs trail */}
                    <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-900 bg-slate-950/40 text-xs text-slate-400 font-medium select-none">
                      <span 
                        onClick={() => setCurrentFolderId(null)} 
                        className="hover:text-indigo-400 cursor-pointer flex items-center gap-1 transition"
                      >
                        🏠 {activeSection === "notes" ? "Notes Root" : "Short Notes Root"}
                      </span>
                      {getBreadcrumbs().map((crumb, idx, arr) => (
                        <React.Fragment key={crumb.id}>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                          <span 
                            onClick={() => setCurrentFolderId(crumb.id)} 
                            className={`hover:text-indigo-400 cursor-pointer transition ${idx === arr.length - 1 ? "text-indigo-400 font-bold" : ""}`}
                          >
                            {crumb.name}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Admin Dynamic Actions Panel inside active folder context */}
                    {userRole === "admin" && (
                      <div className="flex gap-3 bg-slate-950/30 border border-slate-900 p-3 rounded-2xl">
                        <button
                          onClick={() => setIsCreateFolderOpen(true)}
                          className="px-4 py-2 rounded-xl border border-slate-850 hover:bg-slate-900 text-xs font-bold text-slate-300 transition flex items-center gap-1.5"
                        >
                          <Folder className="w-4 h-4 text-indigo-400" /> 📁 New Subfolder
                        </button>
                        <button
                          onClick={() => setIsUploadOpen(true)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
                        >
                          <Plus className="w-4 h-4" /> ➕ Upload PDF to Folder
                        </button>
                      </div>
                    )}

                    {/* Student Upload shortcut */}
                    {userRole !== "admin" && (
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">Double click folders to explore nested revision logs</span>
                        <button
                          onClick={() => setIsUploadOpen(true)}
                          className="px-4 py-2 rounded-xl border border-slate-850 hover:bg-slate-900 text-xs font-bold text-indigo-300 transition flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Upload Study Guide
                        </button>
                      </div>
                    )}

                    {/* Render subfolders at active parent level */}
                    {(() => {
                      const currentLevelFolders = folders.filter(f => f.parentId === currentFolderId && f.type === activeSection);
                      if (currentLevelFolders.length === 0) return null;
                      return (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Folders & Subdirectories</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {currentLevelFolders.map((folder) => {
                              const noteCount = getNoteCountForFolder(folder.id);
                              return (
                                <div 
                                  key={folder.id}
                                  className="glass-panel p-5 rounded-3xl border-slate-900 hover:border-indigo-500/30 flex items-center justify-between group hover:-translate-y-1 transition duration-300"
                                >
                                  <div 
                                    onClick={() => setCurrentFolderId(folder.id)}
                                    className="flex-1 flex items-center gap-4 cursor-pointer"
                                  >
                                    <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:bg-indigo-500/20 transition">
                                      <Folder className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                      <h4 className="font-extrabold text-slate-100 font-heading group-hover:text-indigo-300 transition truncate max-w-[150px]">{folder.name}</h4>
                                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{noteCount} {noteCount === 1 ? "document" : "documents"} indexed</p>
                                    </div>
                                  </div>
                                  
                                  {/* Folder deletion strictly for Admins */}
                                  {userRole === "admin" && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete folder "${folder.name}" and ALL its subfolders and notes recursively?`)) {
                                          handleDeleteFolder(folder.id);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-950/20 transition ml-2 shrink-0 border border-transparent hover:border-red-500/10"
                                      title="Delete folder and children"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                ) : (
                  <div className="flex items-center justify-between pl-1">
                    <span className="text-xs text-slate-400">
                      🔍 Showing global search results matching: <strong className="text-indigo-300 font-mono">"{searchQuery}"</strong>
                    </span>
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Clear search to browse folders
                    </button>
                  </div>
                )}

                {/* FILES & ATTACHMENTS LISTING GRID */}
                <div className="space-y-4 pt-2">
                  {filteredNotes.length > 0 && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Notes & PDF Attachments</p>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                      <div 
                        key={note.id} 
                        className="glass-panel p-5 rounded-3xl flex flex-col justify-between hover:-translate-y-1 transition duration-300 relative border-slate-900 hover:border-indigo-500/20"
                      >
                        
                        {/* Approved or Pending Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                          {note.status === "pending" ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse">
                              🕒 Pending Review
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ✓ Verified Note
                            </span>
                          )}

                          {/* Trash Icon strictly for Admin roles */}
                          {userRole === "admin" && (
                            <button
                              onClick={() => {
                                  if (confirm("Are you sure you want to permanently delete this note document?")) {
                                    handleDeleteNote(note.id);
                                  }
                              }}
                              className="p-1 rounded-md bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/10 hover:border-red-500/30 transition shrink-0"
                              title="Admin: Delete notes document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div>
                          <div className="p-2.5 bg-indigo-500/10 w-fit rounded-xl mb-3.5 text-indigo-400 animate-pulse">
                            <FileText className="w-6 h-6" />
                          </div>
                          <h4 className="font-extrabold text-slate-100 text-sm line-clamp-1">{note.title}</h4>
                          
                          {/* PDF filename details */}
                          <div className="mt-4 bg-slate-950/50 rounded-xl p-2.5 border border-slate-900 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                            <span className="truncate max-w-[140px]">📄 {note.fileName || "attachment_notes.pdf"}</span>
                            <span className="text-slate-600 shrink-0">({note.fileSize || "1.4 MB"})</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-900 pt-3.5 mt-5 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">By {note.author}</span>
                          
                          <div className="flex items-center gap-3">
                            {/* Admin instant approval block */}
                            {userRole === "admin" && note.status === "pending" && (
                              <button
                                onClick={() => handleApproveNote(note.id)}
                                className="px-2 py-1 text-[9px] rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
                              >
                                Approve
                              </button>
                            )}

                            <div className="flex items-center gap-2.5 text-xs text-slate-400">
                              <button 
                                disabled={note.status === "pending"}
                                onClick={() => triggerXpAward(10, "Upvoted digital notes library upload!")} 
                                className="flex items-center gap-1 hover:text-indigo-400 transition"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{note.likes}</span>
                              </button>
                              <button 
                                disabled={note.status === "pending"}
                                onClick={() => triggerXpAward(15, "Downloaded PDF syllabus manual!")}
                                className="flex items-center gap-1 hover:text-indigo-400 transition"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{note.downloads}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Empty state dashboard overlay */}
                  {filteredNotes.length === 0 && folders.filter(f => f.parentId === currentFolderId && f.type === activeSection).length === 0 && (
                    <div className="text-center py-16 glass-panel rounded-3xl border-slate-900 bg-slate-950/20">
                      <Folder className="w-12 h-12 text-slate-600 mx-auto mb-3.5 opacity-40" />
                      <h4 className="text-sm font-bold text-slate-400">This directory path is completely empty.</h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-normal max-w-sm mx-auto">
                        There are no folders or PDF files inside this path. 
                        {userRole === "admin" ? " Click 'New Subfolder' or 'Upload PDF' above to begin dynamic curriculum mapping!" : " Student guides are currently pending admin compilation review."}
                      </p>
                      {userRole === "admin" && (
                        <div className="flex gap-2.5 justify-center mt-5">
                          <button
                            onClick={() => setIsCreateFolderOpen(true)}
                            className="px-3.5 py-2 text-xs rounded-xl font-bold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                          >
                            Create Folder
                          </button>
                          <button
                            onClick={() => setIsUploadOpen(true)}
                            className="px-3.5 py-2 text-xs rounded-xl font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-900/30 transition"
                          >
                            Upload PDF
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: AI FRIEND */}
            {activeTab === "ai-friend" && (
              <div className="space-y-6">
                
                {/* Header title */}
                <div className="border-b border-slate-900 pb-5">
                  <h2 className="text-2xl font-extrabold text-slate-100 font-heading">AI Mentor Bot</h2>
                  <p className="text-sm text-slate-400">Switch focus modes on the flight to analyze code syntax, review placements, or explain syllabus nodes.</p>
                </div>

                {/* Modes panels */}
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    onClick={() => setChatMode("study")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold font-heading border transition ${chatMode === "study" ? "bg-indigo-600/10 text-indigo-200 border-indigo-500" : "bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200"}`}
                  >
                    📚 Study Mode
                  </button>
                  <button 
                    onClick={() => setChatMode("coding")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold font-heading border transition ${chatMode === "coding" ? "bg-cyan-600/10 text-cyan-200 border-cyan-500" : "bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200"}`}
                  >
                    💻 Coding Mode
                  </button>
                  <button 
                    onClick={() => setChatMode("placement")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold font-heading border transition ${chatMode === "placement" ? "bg-purple-600/10 text-purple-200 border-purple-500" : "bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200"}`}
                  >
                    💼 Placement Mode
                  </button>
                  <button 
                    onClick={() => setChatMode("motivation")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold font-heading border transition ${chatMode === "motivation" ? "bg-amber-600/10 text-amber-200 border-amber-500" : "bg-slate-950/20 border-slate-900 text-slate-400 hover:text-slate-200"}`}
                  >
                    🔥 Motivation
                  </button>
                </div>

                {/* Chat window viewport */}
                <div className="glass-panel rounded-2xl flex flex-col h-[400px]">
                  
                  {/* Chat feed list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line font-mono"}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {isAiThinking && (
                      <div className="flex justify-start">
                        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input panel bar */}
                  <div className="p-3 border-t border-slate-900 bg-slate-950/50 rounded-b-2xl flex gap-2">
                    <input 
                      type="text" 
                      placeholder={chatMode === "study" ? "Ask AI Friend to explain operating system CPU schedules..." : "Type custom programming or career doubt questions here..."}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/40"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition text-white"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: SKILL TRACKER */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                
                {/* Header titles */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-100 font-heading">AI Skill Tracker & Roadmap</h2>
                    <p className="text-sm text-slate-400">Sync external developer credentials automatically to structure personalized learning milestones.</p>
                  </div>
                  
                  <button 
                    disabled={isSyncingProfiles}
                    onClick={simulateSyncProfiles}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${isProfileSynced ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-cyan-600 hover:bg-cyan-500 text-white"}`}
                  >
                    {isSyncingProfiles ? (
                      <>Syncing commits...</>
                    ) : isProfileSynced ? (
                      <><UserCheck className="w-4 h-4" /> Developer Accounts Synced</>
                    ) : (
                      <><Code2 className="w-4 h-4" /> Sync GitHub & LeetCode</>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left: current skills status & tracker logs */}
                  <div className="glass-panel p-5 rounded-2xl lg:col-span-1 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" /> Active Verified Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {manualSkills.map((skill, index) => (
                        <span key={index} className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          {skill}
                        </span>
                      ))}
                    </div>

                    <form onSubmit={handleAddManualSkill} className="pt-3 border-t border-slate-900 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add coding skill manually..."
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs focus:outline-none focus:border-indigo-500/40"
                      />
                      <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition text-white">
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Right: AI Weaknesses and Roadmaps analysis */}
                  <div className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> AI Skill Assessment Diagnostics
                    </h3>

                    <div className="bg-slate-950/30 border border-slate-900 p-4 rounded-xl">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Dynamic Level Estimate</p>
                      <p className="text-lg font-extrabold text-indigo-400 mt-0.5">{skillsAnalysis.level}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Strong Knowledge Spheres</p>
                        <ul className="space-y-1">
                          {skillsAnalysis.strongAreas.map((area: string, i: number) => (
                            <li key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Identified Weak Areas</p>
                        <ul className="space-y-1">
                          {skillsAnalysis.weakAreas.map((area: string, i: number) => (
                            <li key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-900">
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">Recommended Career Roadmap Triggers</p>
                      <div className="flex flex-col gap-2">
                        {skillsAnalysis.missingSkills.map((skill: string, index: number) => (
                          <div key={index} className="flex justify-between items-center p-2.5 rounded-xl border border-slate-900 bg-slate-950/30">
                            <span className="text-xs font-semibold text-slate-200">{skill} roadmap pathway</span>
                            <button 
                              onClick={() => triggerXpAward(40, "Dynamic roadmap generated for " + skill)}
                              className="px-2.5 py-1 text-[10px] rounded bg-indigo-950 text-indigo-300 border border-indigo-500/20 font-bold hover:bg-indigo-950/50"
                            >
                              Generate Path
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB: SUBJECTIVE MOCK TEST AI */}
            {activeTab === "mock-test" && (
              <div className="space-y-6">
                
                {/* Header titles */}
                <div className="border-b border-slate-900 pb-5">
                  <h2 className="text-2xl font-extrabold text-slate-100 font-heading">AI Subjective Mock Tests</h2>
                  <p className="text-sm text-slate-400">Generate syllabus tests, practice subjective writing under ticking timers, and get grades via Gemini Pro APIs.</p>
                </div>

                {/* Setup Mode state */}
                {mockTestState === "setup" && (
                  <div className="glass-panel p-6 rounded-3xl max-w-xl mx-auto space-y-4">
                    <h3 className="text-md font-bold text-slate-200 font-heading flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-400" /> Choose Subjective Test Parameters
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Syllabus Subject</label>
                        <select 
                          value={mockSubject}
                          onChange={(e) => setMockSubject(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:outline-none"
                        >
                          <option>Operating Systems</option>
                          <option>Database Management Systems</option>
                          <option>Design & Analysis of Algorithms</option>
                          <option>Software Engineering</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Syllabus Unit</label>
                        <select 
                          value={mockUnit}
                          onChange={(e) => setMockUnit(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:outline-none"
                        >
                          <option>Unit 1 - General Overview</option>
                          <option>Unit 2 - Scheduling & Deadlocks</option>
                          <option>Unit 3 - Normalization & Queries</option>
                          <option>Unit 4 - System Design Principles</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Difficulty</label>
                          <select 
                            value={mockDifficulty}
                            onChange={(e: any) => setMockDifficulty(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:outline-none"
                          >
                            <option value="easy">Easy (Conceptual Definitions)</option>
                            <option value="medium">Medium (Detailed Explanations)</option>
                            <option value="hard">Hard (Relational Scenarios / Math)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Question Score Types</label>
                          <select 
                            value={mockType}
                            onChange={(e: any) => setMockType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:outline-none"
                          >
                            <option value="2_marks">2-Mark Definitions</option>
                            <option value="5_marks">5-Mark Concept Explanations</option>
                            <option value="10_marks">10-Mark Multi-Stage Problems</option>
                          </select>
                        </div>
                      </div>

                      <button 
                        onClick={generateMockTest}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold tracking-wide transition duration-300 flex items-center justify-center gap-2 glow-indigo"
                      >
                        <Sparkles className="w-4 h-4" /> Orchestrate Gemini Test Generator
                      </button>
                    </div>
                  </div>
                )}

                {/* Generating Loading screen state */}
                {mockTestState === "generating" && (
                  <div className="text-center py-16 glass-panel rounded-3xl max-w-xl mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-full border-t-2 border-indigo-500 animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-slate-200 font-heading">AI Mock Test Engine Generating Questions...</p>
                    <p className="text-xs text-slate-500">Contacting Gemini 1.5 Pro to compile syllabus answers, definitions, and grading rubrics.</p>
                  </div>
                )}

                {/* Testing interface screen state */}
                {mockTestState === "testing" && (
                  <div className="glass-panel p-6 rounded-3xl max-w-3xl mx-auto space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{mockSubject} Mock Assessment</h3>
                        <span className="text-[10px] text-slate-400">{mockUnit} • Difficulty: {mockDifficulty}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold font-mono">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>{Math.floor(mockTimer / 60)}:{(mockTimer % 60).toString().padStart(2, "0")} Remaining</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">Q{activeQuestion + 1}</span>
                        <span className="text-xs font-bold text-slate-400">Max Marks: {mockQuestions[activeQuestion].maxMarks}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-200">{mockQuestions[activeQuestion].text}</p>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Write Your Subjective Answer:</label>
                        <textarea 
                          rows={6}
                          placeholder="Type your explanation, variables, and formulas explicitly to earn maximum credit..."
                          value={userAnswers[activeQuestion]}
                          onChange={(e) => setUserAnswers(prev => {
                            const next = [...prev];
                            next[activeQuestion] = e.target.value;
                            return next;
                          })}
                          className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500/40"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-900 pt-4 mt-6">
                      <div className="flex gap-1.5">
                        {mockQuestions.map((_, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setActiveQuestion(idx)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition ${activeQuestion === idx ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 border border-slate-800"}`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {activeQuestion < mockQuestions.length - 1 ? (
                          <button 
                            onClick={() => setActiveQuestion(prev => prev + 1)}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300"
                          >
                            Next Question
                          </button>
                        ) : (
                          <button 
                            onClick={submitMockTest}
                            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white flex items-center gap-1.5"
                          >
                            <FileCheck2 className="w-4 h-4" /> Submit to grading
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Grading evaluation loading screen state */}
                {mockTestState === "grading" && (
                  <div className="text-center py-16 glass-panel rounded-3xl max-w-xl mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-full border-t-2 border-emerald-500 animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-slate-200 font-heading">AI Professor Evaluating Your Answer Text...</p>
                    <p className="text-xs text-slate-500">Matching answers against relational formulas, theoretical points, and checking missing keywords.</p>
                  </div>
                )}

                {/* Report Card Screen state */}
                {mockTestState === "report" && gradingReport && (
                  <div className="glass-panel p-6 rounded-3xl max-w-2xl mx-auto space-y-6">
                    <div className="text-center border-b border-slate-900 pb-5">
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 uppercase tracking-widest border border-emerald-500/20">Evaluation Success</span>
                      <h3 className="text-xl font-bold font-heading text-slate-200 mt-3">{mockSubject} Test Report Card</h3>
                      <p className="text-sm text-slate-400 mt-1">Syllabus node scores, weaknesses check, and suggested resources.</p>
                      
                      <div className="mt-4 text-3xl font-extrabold text-indigo-400 font-heading">
                        {gradingReport.totalObtained} / {gradingReport.maxMarks} Marks
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Line-Item Evaluations</p>
                      
                      {gradingReport.breakdown.map((item: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-900 bg-slate-950/30 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-200">Question {idx + 1} Score</span>
                            <span className="text-xs font-bold text-indigo-400">{item.obtainedMarks} / {mockQuestions[idx].maxMarks}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed"><strong className="text-indigo-300">AI Feedback:</strong> {item.feedback}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-900">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">Missing Conceptual Keywords</p>
                        <ul className="space-y-1">
                          {gradingReport.aiSummary.missingConcepts.map((c: string, i: number) => (
                            <li key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">AI Recommended Study Paths</p>
                        <ul className="space-y-1">
                          {gradingReport.aiSummary.suggestedResources.map((res: any, i: number) => (
                            <li key={i} className="text-xs text-indigo-400 hover:underline flex items-center gap-1.5">
                              <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <a href={res.url} target="_blank" rel="noreferrer">{res.title}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button 
                      onClick={() => setMockTestState("setup")}
                      className="w-full mt-4 py-3 text-center text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
                    >
                      Take Another Subject Mock Test
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* TAB: PROGRESS TRACKER */}
            {activeTab === "tracker" && (
              <div className="space-y-6">
                
                {/* Header titles */}
                <div className="border-b border-slate-900 pb-5">
                  <h2 className="text-2xl font-extrabold text-slate-100 font-heading">Progress hour logger</h2>
                  <p className="text-sm text-slate-400">Log study and coding hours to instantly calculate consistency metrics and update streaks.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left: Input log form */}
                  <div className="glass-panel p-5 rounded-2xl lg:col-span-1 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" /> Log Today's Study Hours
                    </h3>

                    <form onSubmit={handleLogHours} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Syllabus Study Hours</label>
                        <input 
                          type="number" 
                          step="0.5"
                          min="0"
                          value={logForm.study}
                          onChange={(e) => setLogForm(prev => ({ ...prev, study: Number(e.target.value) }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Algorithms & Coding Hours</label>
                        <input 
                          type="number" 
                          step="0.5"
                          min="0"
                          value={logForm.coding}
                          onChange={(e) => setLogForm(prev => ({ ...prev, coding: Number(e.target.value) }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Gym / Fitness Hours</label>
                          <input 
                            type="number" 
                            step="0.5"
                            min="0"
                            value={logForm.gym}
                            onChange={(e) => setLogForm(prev => ({ ...prev, gym: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Project Coding Hours</label>
                          <input 
                            type="number" 
                            step="0.5"
                            min="0"
                            value={logForm.projects}
                            onChange={(e) => setLogForm(prev => ({ ...prev, projects: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Save and log metrics
                      </button>
                    </form>
                  </div>

                  {/* Right: graphs tracking and diagnostic logs */}
                  <div className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" /> Weekly productivity graphs
                    </h3>

                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trackerLogs}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                          <XAxis dataKey="day" stroke="#475569" fontSize={11} />
                          <YAxis stroke="#475569" fontSize={11} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#090a0f', 
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '8px'
                            }} 
                            labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                          />
                          <Bar dataKey="productivity" name="Productivity %" fill="#818cf8" radius={[4, 4, 0, 0]}>
                            {trackerLogs.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.productivity > 85 ? '#06b6d4' : '#6366f1'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-indigo-950/20 border border-indigo-500/15 p-4 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-indigo-300">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs font-bold uppercase tracking-wider">AI Best Version Growth Audit</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{aiBestVersionReport.timeWastedInsight}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-4 border-t border-slate-900 pt-3">
                        <div className="text-center">
                          <p className="text-lg font-extrabold text-indigo-400 font-heading">{aiBestVersionReport.productivityScore}%</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-wide">Productivity Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-extrabold text-cyan-400 font-heading">{aiBestVersionReport.focusScore}%</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-wide">Focus Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-extrabold text-purple-400 font-heading">{aiBestVersionReport.consistencyScore}%</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-wide">Consistency Score</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: COMMUNITY FORUM */}
            {activeTab === "community" && (
              <div className="space-y-6">
                
                {/* Header details */}
                <div className="border-b border-slate-900 pb-5">
                  <h2 className="text-2xl font-extrabold text-slate-100 font-heading">Forums & Student Community</h2>
                  <p className="text-sm text-slate-400">Ask questions, share class notes, display projects, and gain reputation badges (Reddit + StackOverflow style).</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left: post list */}
                  <div className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-400" /> Student Discussion board
                    </h3>

                    <div className="space-y-3.5">
                      {forumPosts.map((post) => (
                        <div key={post.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/30 flex gap-4 hover:border-slate-800 transition">
                          
                          {/* Upvotes panel */}
                          <div className="flex flex-col items-center justify-center pr-2 border-r border-slate-900 text-slate-400 select-none">
                            <button 
                              onClick={() => handleUpvotePost(post.id)}
                              className="text-slate-500 hover:text-indigo-400 transition"
                            >
                              ▲
                            </button>
                            <span className="text-xs font-bold my-1 text-slate-300">{post.votes}</span>
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500">By {post.author} ({post.reputation} Rep)</span>
                              {post.hasAccepted && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                                  ✓ Accepted Answer
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-slate-200 hover:text-indigo-400 cursor-pointer">{post.title}</h4>
                            
                            <div className="flex justify-between items-center pt-2">
                              <div className="flex gap-1">
                                {post.tags.map((tag, i) => (
                                  <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">#{tag}</span>
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" /> {post.replies} responses
                              </span>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Publish a new question form */}
                  <div className="glass-panel p-5 rounded-2xl lg:col-span-1 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cyan-400" /> Start Discussion Thread
                    </h3>

                    <form onSubmit={handleCreatePost} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">What is your question / topic title?</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Memory leaks inside Express Node buffers"
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tags (Comma-separated)</label>
                        <input 
                          type="text" 
                          placeholder="react, express, academics"
                          value={newPostTags}
                          onChange={(e) => setNewPostTags(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder-slate-700"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                      >
                        Publish Post thread
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: PLACEMENTS HUB */}
            {activeTab === "placements" && (
              <div className="space-y-6">
                
                {/* Header details */}
                <div className="border-b border-slate-900 pb-5">
                  <h2 className="text-2xl font-extrabold text-slate-100 font-heading">Placement Simulator Hub</h2>
                  <p className="text-sm text-slate-400">Prepare for recruitment rounds: track DSA lists, perform simulated resume ATS evaluations, and run interactive interviews.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: DSA problem tracker & checklists */}
                  <div className="glass-panel p-5 rounded-2xl lg:col-span-1 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" /> Placement DSA Tracker
                    </h3>
                    <div className="bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/10 mb-2">
                      <div className="flex justify-between text-xs mb-1 text-indigo-300 font-bold">
                        <span>Overall DSA Prep</span>
                        <span>{Math.round((dsaProblems.filter(p => p.solved).length / dsaProblems.length) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${(dsaProblems.filter(p => p.solved).length / dsaProblems.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {dsaProblems.map((prob) => (
                        <div key={prob.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-900 bg-slate-950/20">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={prob.solved}
                              onChange={() => handleSolveProblem(prob.id)}
                              className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                              <p className={`text-xs font-semibold ${prob.solved ? "text-slate-500 line-through" : "text-slate-200"}`}>{prob.title}</p>
                              <span className="text-[8px] font-bold text-slate-500 uppercase">{prob.platform} • {prob.difficulty}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: ATS Resume Evaluator & Placement simulator */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* ATS Evaluator */}
                    <div className="glass-panel p-5 rounded-2xl space-y-4">
                      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" /> AI ATS Resume Score Review
                      </h3>

                      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-slate-300">Upload your PDF developer resume. Our AI scanner calculates corporate matching and suggestions.</p>
                          <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center text-xs text-slate-500 cursor-pointer hover:border-indigo-500/30 transition">
                            Drag & Drop your Resume.pdf here or click browse.
                          </div>
                        </div>

                        <div className="shrink-0 text-center bg-slate-950/60 p-4 rounded-2xl border border-slate-900 w-36">
                          {isAtsEvaluating ? (
                            <div className="w-6 h-6 border-t-2 border-indigo-500 animate-spin mx-auto my-3" />
                          ) : atsScore !== null ? (
                            <div>
                              <p className="text-3xl font-extrabold text-emerald-400 font-heading">{atsScore}%</p>
                              <p className="text-[9px] text-slate-500 uppercase tracking-wide mt-1">ATS Score Match</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-3xl font-extrabold text-slate-600 font-heading">--</p>
                              <p className="text-[9px] text-slate-500 uppercase tracking-wide mt-1">No Scan Yet</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {atsFeedback.length > 0 && (
                        <div className="space-y-1 bg-slate-950/30 border border-slate-900 p-3.5 rounded-xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">AI ATS Suggestions</p>
                          {atsFeedback.map((fb, i) => (
                            <p key={i} className="text-xs text-slate-300 leading-relaxed">{fb}</p>
                          ))}
                        </div>
                      )}

                      <button 
                        disabled={isAtsEvaluating}
                        onClick={handleAtsEvaluate}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                      >
                        Launch AI ATS Scan
                      </button>
                    </div>

                    {/* Interview simulator */}
                    <div className="glass-panel p-5 rounded-2xl space-y-4">
                      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-400" /> AI Interview Simulator
                      </h3>

                      {interviewState === "setup" && (
                        <div className="space-y-3.5">
                          <p className="text-xs text-slate-300">Run a dynamic mock technical interview. Speak or write answers, and receive corporate placement grades.</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Target Developer Role</label>
                              <select 
                                value={interviewRole}
                                onChange={(e) => setInterviewRole(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:outline-none"
                              >
                                <option>Full Stack Developer</option>
                                <option>Frontend Engineer</option>
                                <option>Node Backend Developer</option>
                              </select>
                            </div>
                          </div>
                          <button 
                            onClick={startInterview}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                          >
                            Orchestrate Interview Panel
                          </button>
                        </div>
                      )}

                      {interviewState === "active" && (
                        <div className="space-y-4">
                          <div className="h-44 overflow-y-auto border border-slate-900 p-3 bg-slate-950/40 rounded-xl space-y-3">
                            {interviewMessages.map((msg, i) => (
                              <div key={i} className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
                                <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed max-w-[80%] ${msg.sender === "student" ? "bg-indigo-600 text-white" : "bg-slate-900 border border-slate-850 text-slate-200"}`}>
                                  <strong className="text-[10px] text-indigo-200 font-bold block mb-1 uppercase tracking-wide">
                                    {msg.sender === "student" ? "Jane Doe (You)" : "Corporate Interviewer"}
                                  </strong>
                                  {msg.text}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Type your structured technical answer..."
                              value={interviewInput}
                              onChange={(e) => setInterviewInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSendInterview()}
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-850 bg-slate-950 text-xs focus:outline-none focus:border-indigo-500/40 text-slate-200"
                            />
                            <button 
                              onClick={handleSendInterview}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                            >
                              Submit Answer
                            </button>
                          </div>
                        </div>
                      )}

                      {interviewState === "report" && interviewReport && (
                        <div className="bg-indigo-950/20 border border-indigo-500/10 p-4 rounded-xl space-y-3">
                          <div className="text-center">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">{interviewReport.overallStatus}</span>
                            <p className="text-2xl font-extrabold text-indigo-400 mt-2 font-heading">{interviewReport.score}% Interview Grade</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                            <div>
                              <p className="font-bold text-emerald-400">Observed Key Strengths</p>
                              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                {interviewReport.strengths.map((str: string, i: number) => <li key={i}>{str}</li>)}
                              </ul>
                            </div>
                            <div>
                              <p className="font-bold text-amber-500">Corporate Feedback Advice</p>
                              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                {interviewReport.improvements.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                              </ul>
                            </div>
                          </div>
                          <button 
                            onClick={() => setInterviewState("setup")}
                            className="w-full mt-3 py-2 text-center text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                          >
                            Restart Interview Simulation
                          </button>
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB: ADMIN REVIEW QUEUE */}
            {activeTab === "admin" && (
              <div className="space-y-6">
                
                {/* Header details */}
                <div className="border-b border-slate-900 pb-5">
                  <h2 className="text-2xl font-extrabold text-slate-100 font-heading">Admin Review Dashboard</h2>
                  <p className="text-sm text-slate-400">Review notes, syllabus guides, exam attachments, and publish approved materials to the main Library index.</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400" /> Pending Materials upload Queue
                  </h3>

                  <div className="space-y-3">
                    {notes.filter(note => note.status === "pending").map((note) => (
                      <div key={note.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-800 transition">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500">Author: {note.author}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 uppercase tracking-wider">Awaiting Verification</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 mt-1">{note.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Target Folder: <span className="text-indigo-400 font-bold font-mono">{getFolderPathForNote(note.folderId)}</span> • Type: <span className="text-indigo-400 font-bold">{note.type === "shortnotes" ? "⚡ Short Note" : "📚 Archive Note"}</span></p>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApproveNote(note.id)}
                            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Publish
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm("Are you sure you want to reject and delete this note proposal?")) {
                                handleDeleteNote(note.id);
                              }
                            }}
                            className="px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
                          >
                            <X className="w-3.5 h-3.5" /> Reject & Delete
                          </button>
                        </div>
                      </div>
                    ))}

                    {notes.filter(n => n.status === "pending").length === 0 && (
                      <div className="text-center py-8 text-xs text-slate-500">
                        <CheckCircle2 className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                        No pending notes uploads inside review queue. Everything is up to date!
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </main>
        </div>
      )}

      {/* GLOBAL FOOTER NOTES DIALOG */}
      <footer className="py-4 border-t border-slate-900 bg-slate-950/20 text-center relative z-10 text-[10px] text-slate-600">
        <p>© 2026 Study Buddy SaaS Inc. All rights reserved. Designed for B.Tech, BCA, MCA and Diploma students globally.</p>
      </footer>

      {/* Note upload Modal container */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-indigo-500/20">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h3 className="text-sm font-bold text-slate-200 font-heading flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400 animate-pulse" /> 
                {isUploading ? "Uploading Study Document..." : "Upload Study Guide (PDF)"}
              </h3>
              {!isUploading && (
                <button 
                  onClick={() => {
                    setIsUploadOpen(false);
                    setSelectedFile(null);
                    setSelectedFileName("");
                    setSelectedFileSize("");
                  }} 
                  className="text-slate-500 hover:text-slate-200 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isUploading ? (
              /* High-Fidelity Simulated PDF Upload Progress & Terminal Logs Console */
              <div className="py-4 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-indigo-300">
                    <span>PDF Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-900 text-[10px] font-mono text-emerald-400 space-y-1.5 h-36 overflow-y-auto custom-scrollbar">
                  {uploadLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-1.5 items-start">
                      <span className="text-slate-600 select-none">▶</span>
                      <span className="break-all">{log}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-center text-slate-500 leading-normal">
                  ⚡ Do not close the window or reload. Mappings are being persistently committed to Firebase Cloud Storage.
                </p>
              </div>
            ) : (
              /* Upload Input Form */
              <form onSubmit={handleUploadNotes} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Note Document Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Operating Systems CPU Scheduling Notes"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500/40 text-slate-100"
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 bg-slate-950/50 p-2.5 rounded-xl border border-slate-900">
                  <span>Section: <span className="text-indigo-400 font-bold">{activeSection === "notes" ? "📚 Notes Archive" : "⚡ Short Notes"}</span></span>
                  <span>Upload Folder: <span className="text-indigo-400 font-bold">{currentFolderId ? folders.find(f => f.id === currentFolderId)?.name || currentFolderId : "Root Directory"}</span></span>
                </div>

                {/* PDF File Picker Zone */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Select PDF Notes Document</label>
                  
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="notes-pdf-picker"
                  />

                  {selectedFileName ? (
                    <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-between text-xs text-emerald-200">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold truncate">{selectedFileName}</p>
                          <p className="text-[9px] text-emerald-400 font-mono mt-0.5">{selectedFileSize}</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setSelectedFile(null);
                          setSelectedFileName("");
                          setSelectedFileSize("");
                        }}
                        className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/30 transition shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label 
                      htmlFor="notes-pdf-picker"
                      className="p-5 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center text-xs text-slate-500 block cursor-pointer hover:border-indigo-500/30 hover:bg-slate-950/70 transition duration-300"
                    >
                      <Upload className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                      <p className="font-semibold text-slate-400">Click to browse your local files</p>
                      <p className="text-[10px] text-slate-600 mt-1">Only .pdf attachments are permitted (Max size 10MB)</p>
                    </label>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition duration-300"
                >
                  {userRole === "admin" ? "🛠️ Directly Publish Note (Admin)" : "Submit PDF for Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Folder Creation Modal Container */}
      {isCreateFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-indigo-500/20">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h3 className="text-sm font-bold text-slate-200 font-heading flex items-center gap-2">
                <Folder className="w-4 h-4 text-indigo-400 animate-pulse" /> 
                📁 Create New Folder
              </h3>
              <button 
                onClick={() => {
                  setIsCreateFolderOpen(false);
                  setNewFolderName("");
                }} 
                className="text-slate-500 hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Folder Name
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Unit 6, CSE AI & ML, DSA"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500/40 text-slate-100"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 bg-slate-950/50 p-2.5 rounded-xl border border-slate-900">
                <span>Section: <span className="text-indigo-400 font-bold">{activeSection === "notes" ? "Notes Archive" : "Short Notes"}</span></span>
                <span>Parent Folder: <span className="text-indigo-400 font-bold">{currentFolderId ? folders.find(f => f.id === currentFolderId)?.name || currentFolderId : "Root Directory"}</span></span>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition duration-300"
              >
                Create Folder
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
