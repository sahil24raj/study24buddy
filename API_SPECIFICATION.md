# Study Buddy - REST API Reference & Integration Manual

All requests to the backend must be made with the prefix `/api/v1` and feature absolute JSON formatting.

---

## 1. Global Error Schema
When a route execution encounters validation flaws or runtime errors, the API will output a consistent response envelope:

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST_VAL",
    "message": "The request body failed to pass security schemas.",
    "details": [
      { "field": "email", "issue": "Invalid email address format." }
    ]
  }
}
```

---

## 2. API Endpoints Catalog

### 2.1 Authentication & Profile Setup
Authentication routes use standard JWT signature validation. Protect subsequent routes with the HTTP header `Authorization: Bearer <token>`.

#### `POST /auth/signup`
Creates a student or faculty account.
- **Request Payload**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@university.edu",
  "password": "SecurePassword123!",
  "role": "student",
  "academicDetails": {
    "branch": "CSE",
    "semester": 4,
    "college": "State Technical University"
  }
}
```
- **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Account created successfully. Please verify your email.",
  "userId": "6640c31e9a2b5e001f3b890a"
}
```

#### `POST /auth/login`
Validates credentials and delivers access token.
- **Request Payload**:
```json
{
  "email": "jane.doe@university.edu",
  "password": "SecurePassword123!"
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6640c31e9a2b5e001f3b890a",
    "name": "Jane Doe",
    "role": "student",
    "gamification": {
      "xp": 340,
      "level": 3,
      "streak": 5
    }
  }
}
```

#### `POST /auth/google-mock`
Authenticates a user via mock Google token for rapid prototyping.
- **Request Payload**:
```json
{
  "email": "google.student@gmail.com",
  "name": "Alex Mercer"
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "token": "mock-jwt-token-alex-mercer-987654",
  "user": {
    "id": "6640c31e9a2b5e001f3b89ff",
    "name": "Alex Mercer",
    "role": "student",
    "gamification": {
      "xp": 10,
      "level": 1,
      "streak": 1
    }
  }
}
```

---

### 2.2 Digital Library Management

#### `POST /library/upload`
Uploads a new study file. Restricted strictly to `.pdf` assets up to 10MB.
- **Headers**: `Content-Type: multipart/form-data`, `Authorization: Bearer <token>`
- **Form-data Parameters**:
  - `file`: (Binary PDF Buffer)
  - `title`: "Operating Systems Lecture Notes - Unit 3"
  - `description`: "Covers CPU Scheduling algorithms, Gantt charts, and Deadlocks."
  - `subject`: "Operating Systems"
  - `semester`: 4
  - `branch`: "CSE"
  - `unit`: 3
  - `tags`: "OS, CPU-Scheduling, CPU, BTech"
- **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "note": {
    "id": "6640c42c9a2b5e001f3b891b",
    "title": "Operating Systems Lecture Notes - Unit 3",
    "pdfUrl": "https://res.cloudinary.com/studybuddy/image/upload/v12345/notes/os_u3.pdf",
    "status": "pending"
  }
}
```

#### `GET /library/notes`
Fetches approved academic notes with advanced filtering, full text indexing, and paging.
- **Query Parameters**:
  - `search`: Keywords (e.g. `OS`)
  - `branch`: `CSE`
  - `semester`: `4`
  - `unit`: `3`
  - `page`: `1`
  - `limit`: `10`
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "6640c42c9a2b5e001f3b891b",
      "title": "Operating Systems Lecture Notes - Unit 3",
      "subject": "Operating Systems",
      "author": { "name": "Jane Doe" },
      "likesCount": 42,
      "downloads": 128
    }
  ],
  "pagination": {
    "total": 1,
    "pages": 1,
    "currentPage": 1
  }
}
```

---

### 2.3 Subjective Mock Test AI Engine

#### `POST /mock-tests/generate`
Orchestrates Gemini to create an exam based on selected parameters.
- **Request Payload**:
```json
{
  "subject": "Database Management Systems",
  "unit": "Unit 2 - Relational Model",
  "topic": "Normalization (1NF, 2NF, 3NF, BCNF)",
  "difficulty": "medium",
  "questionType": "5_marks"
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "testId": "6640c5f99a2b5e001f3b892c",
  "subject": "Database Management Systems",
  "questions": [
    {
      "questionIndex": 0,
      "questionText": "Explain 3NF with a suitable relation example. How does it differ from BCNF?",
      "maxMarks": 5
    },
    {
      "questionIndex": 1,
      "questionText": "What are dependency-preserving decompositions? Detail their mathematical verification.",
      "maxMarks": 5
    }
  ]
}
```

#### `POST /mock-tests/:id/submit`
Submits user answers to the subjective assessment, triggering the AI grading model.
- **Request Payload**:
```json
{
  "answers": [
    {
      "questionIndex": 0,
      "userAnswer": "3NF requires a table to be in 2NF and has no transitive dependencies. BCNF is stricter..."
    },
    {
      "questionIndex": 1,
      "userAnswer": "Dependency preservation means that when we split a schema, the original functional dependencies can still be checked on the projection tables without requiring join operations."
    }
  ]
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "grades": {
    "totalObtained": 8.5,
    "maxMarks": 10,
    "breakdown": [
      {
        "questionIndex": 0,
        "obtainedMarks": 4,
        "feedback": "Clear explanation of 3NF transitive dependencies. Missed a concrete mathematical schema example for BCNF differences."
      },
      {
        "questionIndex": 1,
        "obtainedMarks": 4.5,
        "feedback": "Perfect definition of dependency preservation. Excellent theoretical verification."
      }
    ],
    "aiSummary": {
      "missingConcepts": ["BCNF non-trivial dependency definitions"],
      "improvementAreas": ["Include schematic mock tables in relational decomposition problems."],
      "suggestedResources": [
        {
          "title": "GeeksforGeeks Normalization Guide",
          "url": "https://www.geeksforgeeks.org/normal-forms-in-dbms/"
        }
      ]
    }
  }
}
```

---

### 2.4 Progress Log & Productivity Tracker

#### `POST /tracker/log`
Logs activity hours. Triggers Best Version score calculation instantly.
- **Request Payload**:
```json
{
  "hours": {
    "study": 4.5,
    "coding": 3.0,
    "reading": 0.5,
    "gym": 1.0,
    "skills": 2.0,
    "projects": 1.5
  }
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "date": "2026-05-24",
  "scores": {
    "productivityScore": 88,
    "focusScore: ": 90,
    "consistencyScore": 95
  },
  "gamification": {
    "xpEarned": 50,
    "newXpTotal": 390
  }
}
```
