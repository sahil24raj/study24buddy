# Study Buddy - Monetization & Business Blueprint

This document details the target monetization channels, SaaS pricing tiers, business strategy, and core user workflows for **Study Buddy**, your AI-Powered College Companion.

---

## 1. Monetization Strategy

Study Buddy leverages a hybrid B2C (Freemium subscriptions for students) and B2B (Institutional licensing for universities) SaaS strategy to capture value.

### B2C: Premium Student Tier
- **Target Price**: $4.99 / month (or ₹299 / month in emerging markets)
- **Features Included**:
  - **Unlimited AI Mock Assessments**: Deep grading for unlimited subjective papers.
  - **External Integrations**: Automated LeetCode, GitHub, and Codeforces sync.
  - **ATS Resume Builder Pro**: AI-powered resume parsing and scoring.
  - **Interview Simulator AI**: Multi-turn voice/text mock interviews for core tech companies (TCS, Infosys, Amazon, etc.).
  - **High-Fidelity PDF Exports**: Premium, downloadable reports for certificates, progress reviews, and study guides.

### B2B: Institutional / College Portal
- **Target Price**: $1.50 / student / semester
- **B2B Licensing Features**:
  - **Faculty Dashboards**: Monitor overall branch, class, and semester progress and study consistency ratios.
  - **Direct Notice Broadcast**: Pin official university and department circulars directly to students' dashboards.
  - **Placement Officer Access**: Identify top students, filter by CGPA or coding metrics, and directly recommend candidates to recruiting companies.
  - **Audit Logs**: Verified student participation records for academic credit evaluations.

---

## 2. Platform Tiers Breakdown

| Feature | Free Tier | Student Premium Pro | B2B Institutional Portal |
| :--- | :---: | :---: | :---: |
| **Digital Library** | Standard uploads & reads | Unlimited downloads & bookmarks | Admin review queue |
| **AI Subjective Mock Tests** | 3 tests / month | Unlimited | Unlimited |
| **Progress Tracker** | Standard logging & stats | Advanced AI productivity insights | Department aggregation |
| **Skill Tracker** | Manual profile inputs | Automated GitHub & LeetCode tracking | Verified student resumes |
| **Career Roadmaps** | 1 roadmap generation | Unlimited with timeline metrics | Custom college syllabus mapping |
| **College Updates** | View notices | View notices | Broadcast administrative notices |
| **Placements Hub** | View DSA lists | ATS Review + Mock Interviews | Direct recruiter recommendations |

---

## 3. Core System Workflows & User Flows

### 3.1 Student User Journey (Academics & Coding)
```
Student Logs In (Dashboard)
    │
    ├──► Progress Tracker: Logs study (4h) & coding (2h)
    │     └── AI computes consistency score -> awards +15 XP
    │
    ├──► Mock Test AI: Generates Unit 3 Operating Systems test
    │     └── Student types answers -> Submits -> AI grades paper
    │     └── Feedback highlights missed deadlock formulas -> XP awarded
    │
    └──► Skill Tracker: Integrates GitHub & LeetCode profiles
          └── AI detects weak area in DFS/BFS algorithms
          └── Dynamically suggests DSA preparation nodes
```

### 3.2 Digital Library Approval Workflow (Faculty & Admins)
```
Student uploads "Compiler Design Notes.pdf" (Status: Pending)
    │
    ├──► Admin Panel: Receives email notification of pending note
    │     └── Admin reviews title, branch, and semester tags
    │
    ├──► Option A: Approve -> Note status set to 'Published'
    │     └── Author student rewarded +100 XP (Community reputation rise)
    │     └── Note becomes instantly search-indexed for all students
    │
    └──► Option B: Reject -> Status set to 'Rejected'
          └── System emails feedback reason to student author
```

### 3.3 Placement Preparation Workflow (Student & Recruiter)
```
Student opens Placement Hub
    │
    ├──► ATS Checker: Student uploads their developer resume PDF
    │     └── AI reviews text against target "Full Stack Engineer" roles
    │     └── Identifies ATS compliance score (e.g., 72%) and highlights missing keywords
    │
    ├──► Interview Simulator: Launches mock behavior & system design test
    │     └── AI fires situational developer questions based on resume
    │     └── Evaluates answers and prints complete grading reports
```
