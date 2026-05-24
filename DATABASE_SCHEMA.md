# Study Buddy - MongoDB Database Schema & Index Design

This document details the complete MongoDB collection structure, Mongoose schema templates, structural indexes, and performance optimizations tailored for **Study Buddy**.

---

## 1. Mongoose Models & Schemas Definition

### User Schema (`models/user.model.ts`)
```typescript
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'student' | 'faculty' | 'admin';
  isVerified: boolean;
  googleId?: string;
  academicDetails: {
    branch: string;
    semester: number;
    college: string;
    cgpa?: number;
  };
  gamification: {
    xp: number;
    level: number;
    streak: number;
    lastActiveDate?: Date;
    badges: Array<{ name: string; icon: string; unlockedAt: Date }>;
  };
  codingProfiles: {
    github?: string;
    leetcode?: string;
    hackerrank?: string;
    codechef?: string;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student', index: true },
  isVerified: { type: Boolean, default: false },
  googleId: { type: String },
  academicDetails: {
    branch: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    college: { type: String, required: true },
    cgpa: { type: Number, min: 0, max: 10 }
  },
  gamification: {
    xp: { type: Number, default: 0, index: true },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    badges: [{
      name: { type: String, required: true },
      icon: { type: String, required: true },
      unlockedAt: { type: Date, default: Date.now }
    }]
  },
  codingProfiles: {
    github: { type: String },
    leetcode: { type: String },
    hackerrank: { type: String },
    codechef: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Optimization Indexes
UserSchema.index({ 'gamification.xp': -1, name: 1 }); // Leaderboard quick query

export const User = model<IUser>('User', UserSchema);
```

### Digital Note Schema (`models/note.model.ts`)
```typescript
import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  description: string;
  subject: string;
  semester: number;
  branch: string;
  unit: number;
  tags: string[];
  author: Types.ObjectId;
  pdfUrl: string;
  cloudinaryId: string;
  status: 'pending' | 'approved' | 'rejected';
  likes: Types.ObjectId[];
  downloads: number;
  comments: Array<{
    author: Types.ObjectId;
    text: string;
    createdAt: Date;
  }>;
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true, index: true },
  semester: { type: Number, required: true, min: 1, max: 8, index: true },
  branch: { type: String, required: true, index: true },
  unit: { type: Number, required: true, min: 1, max: 5 },
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pdfUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downloads: { type: Number, default: 0 },
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Full Text search optimization across Title, Description, and Subject
NoteSchema.index({ title: 'text', description: 'text', subject: 'text' });

export const Note = model<INote>('Note', NoteSchema);
```

### Subjective Mock Test Schema (`models/mock.model.ts`)
```typescript
import { Schema, model, Document, Types } from 'mongoose';

export interface IMockTest extends Document {
  userId: Types.ObjectId;
  subject: string;
  unit: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: '2_marks' | '5_marks' | '10_marks';
  questions: Array<{
    questionText: string;
    maxMarks: number;
    modelAnswer: string;
  }>;
  answers: Array<{
    questionIndex: number;
    userAnswer: string;
    obtainedMarks: number;
    feedback: string;
  }>;
  aiFeedbackSummary: {
    totalObtained: number;
    maxMarks: number;
    missingConcepts: string[];
    improvementAreas: string[];
    suggestedResources: Array<{ title: string; url: string }>;
  };
  isSubmitted: boolean;
  timerRemaining: number;
  submittedAt?: Date;
  createdAt: Date;
}

const MockTestSchema = new Schema<IMockTest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true },
  unit: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  questionType: { type: String, enum: ['2_marks', '5_marks', '10_marks'], required: true },
  questions: [{
    questionText: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    modelAnswer: { type: String, required: true }
  }],
  answers: [{
    questionIndex: { type: Number, required: true },
    userAnswer: { type: String, required: true },
    obtainedMarks: { type: Number, default: 0 },
    feedback: { type: String }
  }],
  aiFeedbackSummary: {
    totalObtained: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 0 },
    missingConcepts: [{ type: String }],
    improvementAreas: [{ type: String }],
    suggestedResources: [{
      title: { type: String },
      url: { type: String }
    }]
  },
  isSubmitted: { type: Boolean, default: false },
  timerRemaining: { type: Number, required: true },
  submittedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const MockTest = model<IMockTest>('MockTest', MockTestSchema);
```

### Progress Log Schema (`models/log.model.ts`)
```typescript
import { Schema, model, Document, Types } from 'mongoose';

export interface IProgressLog extends Document {
  userId: Types.ObjectId;
  date: string; // format YYYY-MM-DD
  hours: {
    study: number;
    coding: number;
    reading: number;
    gym: number;
    skills: number;
    projects: number;
  };
  aiSummary?: string;
  productivityScore: number;
  focusScore: number;
  consistencyScore: number;
}

const ProgressLogSchema = new Schema<IProgressLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true, index: true },
  hours: {
    study: { type: Number, default: 0 },
    coding: { type: Number, default: 0 },
    reading: { type: Number, default: 0 },
    gym: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    projects: { type: Number, default: 0 }
  },
  aiSummary: { type: String },
  productivityScore: { type: Number, default: 0 },
  focusScore: { type: Number, default: 0 },
  consistencyScore: { type: Number, default: 0 }
});

// Ensure a user can only have one unique progress entry per calendar date
ProgressLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const ProgressLog = model<IProgressLog>('ProgressLog', ProgressLogSchema);
```

---

## 2. Relational Optimizations & Query Indexing Plans

### Unique Indexing
All unique constraints are verified at the MongoDB storage engine level to ensure consistency during high concurrent loads:
1. `users.email` is declared as a unique index to prevent duplicate account signup pipelines.
2. `[progress_logs.userId, progress_logs.date]` forms a unique compound index. When a student enters their hours, a bulk `findOneAndUpdate` operation with `{ upsert: true }` will overwrite or update their daily log seamlessly without duplicating documents.

### High-Speed Leaderboards
The Student Leaderboard calculates ranking using global `gamification.xp` sorted descending:
- Index: `{ "gamification.xp": -1, "name": 1 }`
- This ensures that fetching the top 100 students for the global UI rank requires exactly $O(1)$ scans inside memory, rather than running an entire collection sort.

### Digital Library Text Search
Standard keyword lookups utilize multi-field text indexing:
- Index: `NoteSchema.index({ title: 'text', description: 'text', subject: 'text' })`
- Under Express route parsing, queries execute as:
  ```typescript
  const notes = await Note.find(
    { $text: { $search: searchQuery }, status: 'approved' },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
  ```
- This returns exact search relevance scores matching Google or Elasticsearch ranking algorithms directly on MongoDB.
