# Study Buddy - Technical Architecture & Infrastructure Blueprint

This document details the project architecture, directory structure, environment configurations, Docker virtualization, and CI/CD pipelines for **Study Buddy**, your AI-Powered College Companion.

---

## 1. System Topology & Flow

Study Buddy is structured as a decentralized, cloud-native monorepo consisting of a Next.js 15 frontend client and a Node.js/Express service container:

```
[ Next.js 15 Client (Vercel) ]
          │ (REST API / JWT Auth)
          ▼
[ Express.js Gateway (Render) ] ─── [ Redis Session/Rate Limiter ]
     ├── DB Query ──► [ MongoDB Atlas Cluster ]
     ├── Media Upload ──► [ Cloudinary Media Storage ]
     └── Prompt Evaluator ──► [ Gemini API Gateway (1.5 Pro / Flash) ]
```

---

## 2. Directory Structure

This structure guarantees clean separation of concerns, allowing multiple developers to work on frontend components and backend logic concurrently.

```
study-buddy/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD Pipeline
├── backend/
│   ├── src/
│   │   ├── config/             # Connection pooling configurations
│   │   │   ├── db.ts           # MongoDB client setup
│   │   │   ├── cloudinary.ts   # Cloudinary storage instance
│   │   │   └── gemini.ts       # Google Gen AI initialization
│   │   ├── controllers/        # Route controllers handling inputs/responses
│   │   │   ├── auth.controller.ts
│   │   │   ├── library.controller.ts
│   │   │   ├── mock.controller.ts
│   │   │   └── tracker.controller.ts
│   │   ├── middlewares/        # Security layer
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validator.ts
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── user.model.ts
│   │   │   ├── note.model.ts
│   │   │   ├── mock.model.ts
│   │   │   └── log.model.ts
│   │   ├── routes/             # API routing
│   │   │   ├── auth.routes.ts
│   │   │   ├── library.routes.ts
│   │   │   ├── mock.routes.ts
│   │   │   └── tracker.routes.ts
│   │   ├── services/           # Heavy lift business logic & AI templates
│   │   │   ├── ai.service.ts
│   │   │   ├── gamification.service.ts
│   │   │   └── upload.service.ts
│   │   └── server.ts           # App bootstrapper
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── public/                 # Static SVG/PNG visuals and icons
│   ├── src/
│   │   ├── app/                # Next.js 15 App router
│   │   │   ├── layout.tsx      # Global shell, typography, and dark theme variables
│   │   │   ├── page.tsx        # Hero Landing page
│   │   │   ├── dashboard/      # Base Dashboard portal
│   │   │   ├── library/        # Study guides and approved PDFs
│   │   │   ├── mock-tests/     # Mock test screen, fullscreen timer, active inputs
│   │   │   ├── tracker/        # Streaks, consistency analytics, line charts
│   │   │   ├── AI-friend/      # Multi-mode conversational interface
│   │   │   └── community/      # Forum page
│   │   ├── components/         # Premium Shadcn atoms and composites
│   │   │   ├── ui/             # Buttons, inputs, modals, cards
│   │   │   ├── sidebar.tsx     # Floating dashboard navigator
│   │   │   └── stats-grid.tsx  # Dynamic numeric statistics with charts
│   │   ├── context/            # Global state context
│   │   │   ├── AuthContext.tsx
│   │   │   └── GameContext.tsx
│   │   ├── hooks/              # Reusable React hooks
│   │   ├── lib/                # Utility helpers (cn, formatters, api client)
│   │   └── types/              # Type interfaces
│   ├── tailwind.config.ts
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml          # Container configuration for local testing
```

---

## 3. Local Docker Virtualization

To ensure identical execution across Developer machines (Windows, MacOS, Linux) and Staging servers, use `docker-compose.yml`:

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://db:27017/studybuddy
      - REDIS_URL=redis://cache:6379
      - JWT_SECRET=dev_jwt_secret_token_123!
      - GEMINI_API_KEY=dev_key_here
      - CLOUDINARY_URL=dev_cloudinary_url
    depends_on:
      - db
      - cache

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    depends_on:
      - backend

  db:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  cache:
    image: redis:7.0
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

---

## 4. Production Environment Variables Blueprint

These settings must be configured across your respective deployment control panels (Vercel & Render):

### Backend Environment Variables (`.env.production`)
```bash
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/studybuddy?retryWrites=true&w=majority
JWT_SECRET=super_secret_production_key_must_be_64_chars_long
JWT_EXPIRE=7d
REDIS_URL=redis://default:<password>@<redis-cloud-instance>:6379

# Storage Setup
CLOUDINARY_CLOUD_NAME=studybuddy-storage
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=cloudinary_api_secret_hash

# AI API Access Keys
GEMINI_API_KEY=AIzaSyA_Gemini_Production_Key_Here
OPENAI_API_KEY=sk-proj-OpenAI_Production_Key_Here

# Application Host Config
CLIENT_URL=https://studybuddy-college.vercel.app
```

### Frontend Environment Variables (`.env.production`)
```bash
NEXT_PUBLIC_API_URL=https://studybuddy-api.render.com/api/v1
NEXT_PUBLIC_APP_ENV=production
```

---

## 5. Automated CI/CD Deployment Pipeline

This GitHub Action automatically triggers on pushing changes to your `main` branch, running security lints, running builds, and triggering Webhooks to launch Vercel and Render builds:

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: './backend/package.json'

      - name: Install & Test Backend
        run: |
          cd backend
          npm ci
          npm run lint
          npm run test --passWithNoTests

      - name: Install & Build Frontend
        run: |
          cd ../frontend
          npm ci
          npm run build

  deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: |
          curl -X POST https://api.vercel.com/v1/integrations/deploy/prod_webhook_id

      - name: Deploy Backend to Render
        run: |
          curl -X POST https://api.render.com/deploy/srv-prod_service_id?key=${{ secrets.RENDER_DEPLOY_KEY }}
```
