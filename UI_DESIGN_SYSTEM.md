# Study Buddy - UI/UX Design System & Custom Tokens

This document details the visual hierarchy, component configurations, interaction patterns, wireframes, and theme tokens (using CSS variables, HSL values, and Tailwind CSS configuration parameters) for **Study Buddy**.

---

## 1. Visual Token Architecture

The custom design system delivers a highly immersive, futuristic dark-mode UI ("Abyss Glow") with clean glassmorphic panels and bright cyber accents. Light mode ("Slate Crisp") offers standard accessibility and readability.

### HSL Color Specifications

```css
@layer base {
  :root {
    /* Premium Slate Light Mode Theme */
    --background: 210 40% 98%;      /* Slate White */
    --foreground: 222 47% 11%;      /* Deep Charcoal */
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 243 75% 59%;          /* Indigo */
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222 47% 11.2%;
    --accent: 188 86% 53%;           /* Cyan Cyber */
    --accent-foreground: 222 47% 11%;
    --border: 214.3 31.8% 91.4%;
    --ring: 243 75% 59%;
  }

  .dark {
    /* Abyss Futuristic Dark Theme */
    --background: 231 67% 4%;       /* Deep Abyss Midnight */
    --foreground: 210 40% 98%;      /* Vibrant White-Gray */
    --card: 224 71% 7%;             /* Deep Translucent Card */
    --card-foreground: 210 40% 98%;
    --popover: 224 71% 4%;
    --popover-foreground: 210 40% 98%;
    --primary: 243 75% 59%;          /* Neon Indigo */
    --primary-foreground: 210 40% 98%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 40% 98%;
    --accent: 188 86% 53%;           /* Electric Cyan Glow */
    --accent-foreground: 222 47% 11%;
    --border: 217 33% 17%;
    --ring: 243 75% 59%;
  }
}
```

---

## 2. Global Component Styling Configurations

To achieve an ultra-premium feel, all card interfaces in the application use custom glassmorphism styles in dark mode:

```css
/* Glassmorphism Panel styles */
.glass-panel {
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-panel:hover {
  border-color: rgba(99, 102, 241, 0.3); /* Subtle Indigo Glow on hover */
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.15);
}
```

### Motion Presets (Framer Motion)
Ensure every transition behaves organically:
- **Hover Trigger**:
  ```typescript
  export const hoverScale = {
    whileHover: { scale: 1.02, y: -4 },
    transition: { type: "spring", stiffness: 300, damping: 15 }
  };
  ```
- **Page Entrance (Reveal)**:
  ```typescript
  export const pageReveal = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.4, ease: "easeInOut" }
  };
  ```

---

## 3. Wireframes & Layout Structures

### Core Dashboard UI Wireframe
Below is the dashboard structure showing navigation, real-time stats, streaks, AI insights, and custom data charts:

```
┌────────────────────────────────────────────────────────────────────────┐
│  STUDY BUDDY  [Logo]                        [Streak: 🔥 14] [👤 Jane]   │
├──────────────┬─────────────────────────────────────────────────────────┤
│ 📂 Library   │  Welcome back, Jane! ✨                                 │
│ 🎯 Mock Test │  "You are performing 12% more consistently than last week!" │
│ 📈 Tracker   │                                                         │
│ 💬 AI Friend │ ┌───────────────────┐ ┌───────────────────┐ ┌─────────┐ │
│ 👥 Forum     │ │ Study hours: 4.5h │ │ Coding: 3.0h      │ │ Rank #4 │ │
│              │ └───────────────────┘ └───────────────────┘ └─────────┘ │
│ ⚙️ Admin     │                                                         │
│              │ ┌───────────────────────────────────┐ ┌───────────────┐ │
│              │ │   Weekly Coding Activity Graph     │ │ AI Best       │ │
│              │ │   [ Recharts Area Gradient Chart ]│ │ Version       │ │
│              │ │                                   │ │ Recommendations │ │
│              │ │                                   │ │ - Gym 1h more │ │
│              │ └───────────────────────────────────┘ └───────────────┘ │
└──────────────┴─────────────────────────────────────────────────────────┘
```

### Digital Note Upload Modal Wireframe
```
┌──────────────────────────────────────────────┐
│  Upload Study Document (PDF only)         [X] │
├──────────────────────────────────────────────┤
│  Drag & Drop PDF file here                   │
│  [ 📄 OS_Unit3_Draft.pdf (3.4 MB) ]          │
│                                              │
│  Title: [ Operating Systems - CPU Sched ]     │
│  Subject: [ Operating Systems          ]     │
│  Semester: [ 4 ]   Branch: [ CSE ]  Unit: [3]│
│  Tags: [ OS, Scheduling, BTech ]             │
│                                              │
│  [ Cancel ]               [ Upload to Library ]│
└──────────────────────────────────────────────┘
```

---

## 4. Icons & Asset Guidelines
- **Icon Set**: Use Lucide React (`lucide-react`) for clean, responsive vector geometry.
  - Sidebar: `BookOpen` (Library), `GraduationCap` (Mock Test), `Flame` (Streak), `Activity` (Tracker), `MessageSquare` (AI Friend), `User` (Profile), `Shield` (Admin).
  - Stat Cards: `Clock` (Study hours), `Code` (Coding hours), `TrendingUp` (Productivity Score).
- **Chart Visualizations**: Render using `recharts` responsive wrappers with custom HSL gradient fills matching target accent variables.
- **Images**: Create highly aesthetic user avatars, hero assets, and landing illustrations using professional vectors or AI graphics generators (stored securely inside the backend `/assets` database, or CDN).
