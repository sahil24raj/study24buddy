# Study Buddy - AI Engines & Prompt Orchestration Specs

This document details the AI architecture, model allocation, prompt templates, structured JSON outputs, and session state memory models for **Study Buddy**.

---

## 1. AI Model Allocation Plan

To maximize responsiveness while keeping API costs low, the platform dynamically splits workloads:

| Module | Purpose | Target Model | Context Window | Mode |
| :--- | :--- | :--- | :--- | :--- |
| **Subjective Mock Test Generator** | Creating questions, answers, and criteria | Gemini 1.5 Pro | 128k | JSON Schema / Structured |
| **Mock Test Evaluator** | Analyzing student text vs model solutions | Gemini 1.5 Pro | 128k | JSON Schema / Structured |
| **AI Best Version System** | Dynamic weekly multi-habit correlation | Gemini 1.5 Flash | 64k | JSON Schema / Structured |
| **AI Friend Chatbot** | Real-time multi-mode student companion | Gemini 1.5 Flash | 32k | Text (Markdown + MathJax) |
| **ATS Resume Evaluator** | Reviewing and scoring student resumes | Gemini 1.5 Pro | 128k | JSON Schema / Structured |

---

## 2. API Schema Definitions & Prompt Engineering Templates

### 2.1 Subjective Mock Test Generator
Generates $N$ highly specific, syllabus-aligned questions with matching model answers to grade students objectively.

#### System Prompt & JSON Instruction
```
You are an expert college professor designing a subjective question paper for:
Subject: ${subject}
Unit/Syllabus: ${unit}
Specific Topic: ${topic}
Target Difficulty: ${difficulty}
Question Type: ${questionType} (2_marks = Short Definition, 5_marks = Explain with Diagram reference, 10_marks = Complex Architectural Math).

Generate exactly 2 separate academic questions of this format.
You must output strictly JSON matching this structure:
{
  "questions": [
    {
      "questionText": "string",
      "maxMarks": number,
      "modelAnswer": "Detailed key facts, definitions, and mathematical equations needed to score full points on this question."
    }
  ]
}
```

---

### 2.2 Academic Subjective Evaluator (Gemini 1.5 Pro)
Grades user submissions by comparing student text against standard model answers, providing targeted feedback on what concepts were missed.

#### System Prompt & JSON Instruction
```
You are a strict academic evaluator. Contrast the user's submitted answer with the correct Model Answer.
Score the student fairly out of ${maxMarks} based on factual accuracy, clarity, and formula coverage.

Inputs:
- Question: "${questionText}"
- Standard Model Answer: "${modelAnswer}"
- Student Answer: "${studentAnswer}"

Produce a structured JSON review outlining marks obtained, strict feedback, specific mistakes, missing conceptual terms, and actionable tips.
JSON Schema:
{
  "obtainedMarks": number,
  "feedback": "string",
  "mistakes": ["string"],
  "missingConcepts": ["string"],
  "improvementAreas": ["string"],
  "suggestedResources": [
    { "title": "string", "url": "string" }
  ]
}
```

---

### 2.3 AI Best Version Analysis Engine (Gemini 1.5 Flash)
Analyzes study logs, coding hours, fitness logs, and sleep durations to generate productivity scores, streaks, and motivational advice.

#### Prompt Template
```
Analyze this student's daily progress logs over the last 7 days:
${JSON.stringify(progressLogs)}

Compare the statistics for sleep, study, coding, projects, fitness, and reading.
Generate a structured JSON output detailing:
- Key habits where time was wasted (e.g., lack of sleep, low coding volume).
- Dynamic, metrics-backed scores out of 100 for Focus, Consistency, and Productivity.
- Tomorrow's specific micro-action list.
- Next week's macro goals.

JSON Schema:
{
  "productivityScore": number,
  "focusScore": number,
  "consistencyScore": number,
  "timeWastedInsight": "string",
  "improvementsDetected": "string",
  "tomorrowPlan": ["string"],
  "weeklyGoals": ["string"]
}
```

---

## 3. Conversational "AI Friend" State Management

The AI Friend features five distinct conversation modes:
- `Study Mode`: Explains complex topics, creates short summaries, and generates practice questions.
- `Coding Mode`: Reviews code blocks, writes algorithms, and troubleshoots errors.
- `Placement Mode`: Runs mock developer interviews, reviews resume lines, and discusses placements.
- `Career Mode`: Explores tech specializations, paths, and internship guidelines.
- `Motivation Mode`: Provides mental support, focus techniques, and routines.

### Context Buffer & Memory Window
To prevent chatbot delays and keep API token consumption optimal, Study Buddy implements a sliding memory window:

```
[ Active System Instructions + Active Mode Prompt ]
                       │
[ Dynamic Summary of older history (stored in DB) ]
                       │
[ Last 10 conversation messages (full text) ]
                       │
[ Student's Current Query ]
```

When a conversation goes beyond 10 exchanges, the backend triggers an asynchronous summary task using Gemini Flash. This task consolidates older dialogue into a compact, bullet-pointed "summaryMemory" field in MongoDB, keeping latency under **600ms** per message.
