<div align="center">

<br/>

```
██████╗ ██████╗  █████╗ ██╗███╗   ██╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔═══██╗██╔════╝
██████╔╝██████╔╝███████║██║██╔██╗ ██║██║   ██║███████╗
██╔══██╗██╔══██╗██╔══██║██║██║╚██╗██║██║   ██║╚════██║
██████╔╝██║  ██║██║  ██║██║██║ ╚████║╚██████╔╝███████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
```

# 🧠 BrainOS — Personal Mental Health Operating System

**An AI-powered, full-stack mental wellness platform that monitors mood, stress, burnout, focus, sleep, and lifestyle — powered by Groq LLMs and built with Next.js 15 + MongoDB.**

<br/>

![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss)
![Groq](https://img.shields.io/badge/Groq-LLM%20API-F55036?style=for-the-badge)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Features](#-live-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Directory Structure](#-directory-structure)
- [Database Models](#-database-models)
- [API Routes](#-api-routes)
- [AI & Scoring Engine](#-ai--scoring-engine)
- [Authentication System](#-authentication-system)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)

---

## 🌐 Overview

**BrainOS** is a next-generation **Personal Mental Health Operating System** — a full-stack SaaS web application that acts as your cognitive performance dashboard. It continuously monitors and analyzes your mental health metrics (mood, stress, burnout risk, focus, sleep quality, energy) using a proprietary **scoring engine** and live **Groq LLM** AI coaching.

Key design principles:
- 🔐 **Privacy-first**: Data stored in your MongoDB instance + localStorage fallback
- 🤖 **AI-native**: Every module has Groq LLM-powered insights
- 📊 **Science-backed**: Scoring algorithms based on CBT, sleep science, ultradian rhythm research
- ⚡ **Blazing fast**: Optimistic UI with local-first state, async MongoDB sync in background
- 🎨 **Premium design**: Glassmorphic UI, animated aurora background, smooth motion animations

---

## ✨ Live Features

### 🏠 Landing Page
- Animated hero section with live score preview
- Feature highlights with animated glassmorphism cards
- FAQ accordion covering BrainOS concepts
- Animated entrance transitions (`motion`)

### 📊 Dashboard
- **Mental Health Index** — composite score (0–100) with animated gauge
- **5 Core Score Widgets**: Stress · Burnout Risk · Focus · Sleep · Energy
- **7-day Trend Chart** powered by Recharts (Mood, Energy, Stress, Sleep, Productivity)
- **AI Neural Insight Banner** — live Groq LLM-generated 2-sentence insight based on your scores
- **Personalized Recommendations** — rule-based engine generating prioritized action cards
- One-click navigation to all modules
- Confetti celebration on reaching milestones

### ✅ Daily Check-In
- Comprehensive 13-metric daily form:
  - Mood (1–10 with emoji labels)
  - Energy level
  - Stress level
  - Sleep hours & quality
  - Water intake (liters)
  - Exercise (minutes)
  - Work hours + Study hours
  - Screen time (hours)
  - Social interaction (minutes)
  - Meditation (minutes)
  - Productivity rating
  - Custom tags (predefined + free-form)
  - Personal notes
- Saves to MongoDB + localStorage simultaneously
- Groq LLM post-check-in analysis commentary

### 😊 Mood Tracker
- Daily mood rating with rich emoji-labeled scale
- Historical mood trend visualization (Recharts AreaChart)
- Mood label taxonomy: Thriving → Content → Neutral → Drained → Overwhelmed
- Streak tracking and mood pattern insights

### 😰 Stress Analyzer
- Multi-factor stress input: trigger identification, intensity rating, physical symptoms
- Coping strategy logging
- AI-powered analysis via Groq (stress trigger pattern recognition)
- Historical stress log with trend line
- MongoDB `StressLog` collection storage with Groq analysis field

### 🔥 Burnout Predictor
- Maslach Burnout Inventory-inspired 3-axis scoring:
  - **Exhaustion** (1–10)
  - **Cynicism** (1–10)
  - **Inefficacy** (1–10)
- Overtime hours input
- Calculated burnout risk % with status classification
- Groq LLM personalized recovery recommendation
- Risk status levels: Low Risk → Moderate Caution → High Warning → Imminent Burnout
- MongoDB `BurnoutMetric` collection

### 🎯 Focus Analyzer
- Focus session logger: task title, duration, distractions, flow state rating
- Ultradian rhythm coaching via Groq API
- Session history with analytics
- MongoDB `FocusSession` collection with AI tip storage
- Deep work hours calculation and tracking

### 🌙 Sleep Tracker
- Comprehensive sleep input: hours, quality rating, deep sleep minutes, REM minutes, disruptions, caffeine cutoff time
- Sleep score calculation with optimal range detection (7.5–8.5 hrs)
- Groq LLM sleep hygiene advice per session
- Historical sleep trend chart
- MongoDB `SleepLog` collection

### 📓 AI Journal
- Rich-text journaling with categories: Reflection · Gratitude · Stress Release · Goal Setting · Idea · General
- Mood rating per entry
- **Groq LLM Sentiment Analysis** per journal entry returning:
  - Primary Emotion (e.g., "Hopeful Determination")
  - Sentiment Score (−1.0 to +1.0)
  - Stress Level classification
  - Extracted keywords
  - 1-sentence AI summary
  - Actionable insights array
- Full CRUD: Create, Read, Update, Delete journal entries
- Sync to MongoDB `Journal` collection

### 🤖 AI Neural Coach
- Persistent conversational AI coach powered by Groq LLMs
- System prompt engineered with CBT, mindfulness, sleep science, and stress mitigation context
- **Live user metrics injected** into every conversation (Mental Health Index, Stress, Burnout, Focus, Sleep scores)
- Supports 4 selectable Groq models:
  | Model | Badge |
  |---|---|
  | `llama-3.3-70b-versatile` | 🟢 Recommended |
  | `deepseek-r1-distill-llama-70b` | 🔵 Reasoning |
  | `gemma2-9b-it` | ⚡ Fast |
  | `qwen-2.5-32b` | ⚖️ Balanced |
- Quick-prompt suggestions for common coaching scenarios
- Chat history persisted to localStorage
- Safety guardrails: no clinical diagnoses, immediate support redirect for crisis indicators
- Graceful fallback demo responses when no API key is set

### 📈 Reports & Analytics
- Comprehensive multi-metric historical analysis
- 7-day and 30-day trend breakdowns
- Score distribution visualizations
- Recharts-powered interactive charts

### ⚙️ Settings
- **Groq API Key** management (masked input, locally stored)
- **Model selector** — choose your preferred LLM for all AI features
- **Accent color themes**: Cyan · Purple · Emerald · Blue
- **Animation toggle** and sound effects
- **Personal targets**: sleep hours, water intake, exercise, deep work
- **Data Export**: full JSON backup download (`brainos_backup_YYYY-MM-DD.json`)
- **Data Import**: restore from JSON backup
- **Reset All Data**: clear all local and remote data

### 🏛️ Architecture View
- Interactive system architecture visualization
- Tech stack diagram

### 🔬 Research View
- Mental health research references and methodology

### 👤 About & Contact
- Project information and contact details

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | `^15.4.9` | React framework, App Router, SSR, API Routes |
| **React** | `^19.2.1` | UI library |
| **TypeScript** | `5.9.3` | Type safety across all layers |
| **TailwindCSS** | `4.1.11` | Utility-first CSS framework |
| **Motion (Framer Motion)** | `^12.23.24` | Page transitions and micro-animations |
| **GSAP** | `^3.15.0` | Advanced animation sequences |
| **Recharts** | `^3.10.0` | Interactive data visualization charts |
| **Lucide React** | `^0.553.0` | Icon system |
| **canvas-confetti** | `^1.9.4` | Celebration confetti effects |

### Backend & Database
| Technology | Version | Purpose |
|---|---|---|
| **MongoDB** | via Mongoose `^9.8.0` | Primary database for all user data |
| **Mongoose** | `^9.8.0` | ODM for MongoDB schema modeling |
| **Next.js API Routes** | App Router | REST API endpoints (serverless) |

### AI & Intelligence
| Technology | Version | Purpose |
|---|---|---|
| **Groq SDK** | `^1.3.0` | Ultra-fast LLM inference API |
| **@google/genai** | `^2.4.0` | Google AI integration |
| **Llama 3.3 70B** | via Groq | Primary AI coach model |
| **DeepSeek R1 70B** | via Groq | Reasoning-focused model |
| **Gemma 2 9B** | via Groq | Fast inference model |
| **Qwen 2.5 32B** | via Groq | Balanced performance model |

### Authentication
| Technology | Version | Purpose |
|---|---|---|
| **NextAuth.js** | `^4.24.15` | OAuth + Credentials authentication |
| **bcryptjs** | `^3.0.3` | Password hashing |
| **jsonwebtoken** | `^9.0.3` | JWT session tokens |
| **Google OAuth** | via NextAuth | Social sign-in |
| **GitHub OAuth** | via NextAuth | Social sign-in |
| **Nodemailer** | `^9.0.3` | Email verification / password reset |

### Forms & Validation
| Technology | Version | Purpose |
|---|---|---|
| **React Hook Form** | `^7.82.0` | Form state management |
| **Zod** | `^4.4.3` | Schema validation |
| **@hookform/resolvers** | `^5.2.1` | Zod + RHF integration |

### Utilities
| Technology | Version | Purpose |
|---|---|---|
| **clsx** | `^2.1.1` | Conditional className utility |
| **tailwind-merge** | `^3.3.1` | Tailwind class deduplication |
| **class-variance-authority** | `^0.7.1` | Component variants system |
| **tw-animate-css** | `^1.4.0` | TailwindCSS animation utilities |

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BrainOS Client                          │
│                                                                 │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐│
│  │ AuthScreen│  │           BrainOSProvider (Context)          ││
│  │  (Login / │  │                                              ││
│  │  Signup / │  │  State: checkIns | journals | chatHistory   ││
│  │  OTP)     │  │         settings | scores | recommendations  ││
│  └──────────┘  │                                              ││
│                │  useMemo: scoring-engine (real-time scores)   ││
│                │  useEffect: MongoDB sync on auth              ││
│                └──────────────────────────────────────────────┘│
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                    View Router (page.tsx)                  ││
│  │  landing | dashboard | checkin | mood | stress | burnout   ││
│  │  focus | sleep | journal | coach | reports | settings ...  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────────┐│
│  │ Navbar   │  │BackgroundAurora│  │         Footer            ││
│  │(nav + auth│  │(Canvas aurora  │  │                           ││
│  │ session) │  │ + particles)  │  │                           ││
│  └──────────┘  └──────────────┘  └───────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
           │
           │ fetch() API calls (optimistic local-first)
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                         │
│                                                                 │
│  /api/auth/[...nextauth]   → NextAuth OAuth + Credentials       │
│  /api/auth/signup          → User registration + bcrypt hash    │
│  /api/auth/send-code       → Email OTP via Nodemailer           │
│  /api/auth/reset-password  → Password reset flow                │
│  /api/checkin              → GET/POST DailyCheckIn documents    │
│  /api/journal              → GET/POST/DELETE Journal entries    │
│  /api/focus                → GET/POST FocusSession + Groq tip   │
│  /api/sleep                → GET/POST SleepLog + Groq advice    │
│  /api/stress               → GET/POST StressLog + Groq analysis │
│  /api/burnout              → GET/POST BurnoutMetric + Groq rec  │
│  /api/coach                → AI Coach streaming endpoint        │
└─────────────────────────────────────────────────────────────────┘
           │
           │ Mongoose ODM
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MongoDB Atlas                             │
│                                                                 │
│  Collections:                                                   │
│  ├── users          (User auth & profile)                       │
│  ├── checkins       (Daily metrics, 13 fields + scores)         │
│  ├── journals       (Entries + Groq AI analysis)                │
│  ├── focussessions  (Task, duration, flow + Groq tip)           │
│  ├── sleeplogs      (Sleep data + Groq advice)                  │
│  ├── stresslogs     (Trigger, symptoms + Groq analysis)         │
│  └── burnoutmetrics (Exhaustion/Cynicism/Inefficacy + Groq rec) │
└─────────────────────────────────────────────────────────────────┘
           │
           │ fetch()
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Groq LLM API                               │
│                  (api.groq.com/openai/v1)                       │
│                                                                 │
│  Models:                                                        │
│  ├── llama-3.3-70b-versatile  (Recommended — AI Coach)          │
│  ├── deepseek-r1-distill-llama-70b  (Reasoning)                 │
│  ├── gemma2-9b-it  (Fast)                                       │
│  └── qwen-2.5-32b  (Balanced)                                   │
│                                                                 │
│  Groq is used for:                                              │
│  ├── Dashboard AI Insight Banner                                │
│  ├── AI Neural Coach conversations                              │
│  ├── Journal Sentiment Analysis (JSON structured output)        │
│  ├── Focus Session cognitive tips                               │
│  ├── Sleep hygiene advice                                       │
│  ├── Stress trigger analysis                                    │
│  └── Burnout recovery recommendations                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
Brain Os/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx                # Root layout (NextAuth SessionProvider)
│   ├── page.tsx                  # Main SPA entry — view router
│   ├── globals.css               # Global styles, CSS variables, animations
│   └── api/                      # Serverless API endpoints
│       ├── auth/
│       │   ├── [...nextauth]/    # NextAuth handler
│       │   ├── signup/           # User registration
│       │   ├── send-code/        # Email OTP dispatch
│       │   └── reset-password/   # Password reset
│       ├── checkin/              # Daily Check-In CRUD
│       ├── journal/              # Journal CRUD + AI analysis
│       ├── focus/                # Focus session logging
│       ├── sleep/                # Sleep log management
│       ├── stress/               # Stress log management
│       ├── burnout/              # Burnout metric management
│       └── coach/                # AI Coach endpoint
│
├── components/
│   ├── auth/
│   │   └── AuthScreen.tsx        # Full auth flow (Login/Signup/OTP/Reset)
│   ├── providers/
│   │   └── AuthProvider.tsx      # NextAuth SessionProvider wrapper
│   ├── ui/
│   │   ├── BackgroundAurora.tsx  # Canvas aurora + floating particles
│   │   ├── Footer.tsx            # App footer
│   │   ├── GlassCard.tsx         # Reusable glassmorphism card
│   │   ├── Navbar.tsx            # Navigation + session controls
│   │   └── ScoreGauge.tsx        # Animated SVG score gauge
│   └── views/                    # 16 full-page view components
│       ├── LandingView.tsx
│       ├── DashboardView.tsx
│       ├── DailyCheckInView.tsx
│       ├── MoodTrackerView.tsx
│       ├── StressAnalyzerView.tsx
│       ├── BurnoutPredictorView.tsx
│       ├── FocusAnalyzerView.tsx
│       ├── SleepTrackerView.tsx
│       ├── JournalView.tsx
│       ├── AICoachView.tsx
│       ├── ArchitectureView.tsx
│       ├── ReportsView.tsx
│       ├── ResearchView.tsx
│       ├── SettingsView.tsx
│       ├── AboutContactView.tsx
│       └── NotFoundView.tsx
│
├── context/
│   └── BrainOSContext.tsx        # Global state (React Context + hooks)
│
├── lib/
│   ├── auth.ts                   # NextAuth config (Google, GitHub, Credentials)
│   ├── email.ts                  # Nodemailer OTP email service
│   ├── groq-service.ts           # Groq API client + AI functions
│   ├── mongodb.ts                # Mongoose connection singleton
│   ├── scoring-engine.ts         # Mental health score calculation algorithms
│   ├── storage.ts                # localStorage persistence helpers
│   ├── utils.ts                  # Utility functions (cn)
│   └── verificationStore.ts      # In-memory OTP verification store
│
├── models/                       # Mongoose schemas
│   ├── User.ts
│   ├── CheckIn.ts
│   ├── Journal.ts
│   ├── FocusSession.ts
│   ├── SleepLog.ts
│   ├── StressLog.ts
│   └── BurnoutMetric.ts
│
├── types/
│   └── brainos.ts                # All TypeScript interfaces & types
│
├── hooks/
│   └── use-mobile.ts             # Responsive breakpoint hook
│
├── assets/                       # Static assets
├── .env.example                  # Environment variable template
├── next.config.ts                # Next.js configuration
├── tailwind.config (inline)      # TailwindCSS v4 configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 🗄️ Database Models

### `User`
| Field | Type | Description |
|---|---|---|
| `email` | String (unique) | User's email address |
| `name` | String | Display name |
| `password` | String | bcrypt-hashed password (credentials auth) |
| `image` | String | Avatar URL (from OAuth) |
| `provider` | String | `credentials` / `google` / `github` |

### `CheckIn`
| Field | Type | Description |
|---|---|---|
| `userId` | String | Owner reference (email or ID) |
| `date` | String | YYYY-MM-DD |
| `mood` | Number | 1–10 |
| `moodLabel` | String | e.g., "Content" |
| `energy` | Number | 1–10 |
| `stress` | Number | 1–10 |
| `productivity` | Number | 1–10 |
| `sleepHours` | Number | Hours slept |
| `sleepQuality` | Number | 1–10 |
| `waterIntakeLiters` | Number | Daily hydration |
| `exerciseMinutes` | Number | Physical activity |
| `workHours` | Number | Work time |
| `studyHours` | Number | Study/learning time |
| `screenTimeHours` | Number | Total screen exposure |
| `socialMinutes` | Number | Social interaction |
| `meditationMinutes` | Number | Mindfulness practice |
| `tags` | String[] | Activity tags |
| `customNotes` | String | Personal notes |
| `scores` | Object | Computed: overall, stress, burnout, focus, sleep |
| `aiAnalysis` | String | Groq LLM commentary |

### `Journal`
| Field | Type | Description |
|---|---|---|
| `userId` | String | Owner reference |
| `title` | String | Entry title |
| `content` | String | Journal body |
| `mood` | String | Mood at time of writing |
| `tags` | String[] | Topic tags |
| `aiAnalysis` | Object | Groq: sentiment, emotion, summary, advice |

### `FocusSession`
| Field | Type | Description |
|---|---|---|
| `taskTitle` | String | What you were working on |
| `durationMinutes` | Number | Session length |
| `distractions` | Number | Interruption count |
| `flowStateRating` | Number | 1–10 subjective flow |
| `groqFocusTip` | String | AI-generated cognitive tip |

### `SleepLog`
| Field | Type | Description |
|---|---|---|
| `sleepHours` | Number | Total sleep duration |
| `qualityRating` | Number | 1–10 |
| `deepSleepMinutes` | Number | Deep sleep estimate |
| `remSleepMinutes` | Number | REM sleep estimate |
| `disruptions` | Number | Night wakings |
| `caffeineCutoffHour` | String | Last caffeine time |
| `groqSleepAdvice` | String | AI sleep hygiene tip |

### `StressLog`
| Field | Type | Description |
|---|---|---|
| `trigger` | String | Stress trigger description |
| `intensity` | Number | 1–10 |
| `symptoms` | String[] | Physical/mental symptoms |
| `copingStrategy` | String | What helped |
| `groqAnalysis` | String | AI pattern analysis |

### `BurnoutMetric`
| Field | Type | Description |
|---|---|---|
| `exhaustion` | Number | 1–10 (Maslach Axis 1) |
| `cynicism` | Number | 1–10 (Maslach Axis 2) |
| `inefficacy` | Number | 1–10 (Maslach Axis 3) |
| `overtimeHours` | Number | Extra hours worked |
| `calculatedRisk` | Number | 0–100% burnout risk |
| `groqRecommendation` | String | AI recovery plan |

---

## 🔌 API Routes

| Method | Route | Description |
|---|---|---|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth OAuth + Credentials handler |
| `POST` | `/api/auth/signup` | New user registration with bcrypt |
| `POST` | `/api/auth/send-code` | Send OTP verification email |
| `POST` | `/api/auth/reset-password` | OTP-verified password reset |
| `GET` | `/api/checkin?userId=` | Fetch all check-ins for user |
| `POST` | `/api/checkin?userId=` | Save new check-in + compute scores |
| `GET` | `/api/journal?userId=` | Fetch all journal entries |
| `POST` | `/api/journal?userId=` | Save journal + trigger Groq analysis |
| `DELETE` | `/api/journal?id=&userId=` | Delete journal entry |
| `GET` | `/api/focus?userId=` | Fetch focus sessions |
| `POST` | `/api/focus?userId=` | Log focus session + Groq tip |
| `GET` | `/api/sleep?userId=` | Fetch sleep logs |
| `POST` | `/api/sleep?userId=` | Log sleep + Groq advice |
| `GET` | `/api/stress?userId=` | Fetch stress logs |
| `POST` | `/api/stress?userId=` | Log stress + Groq analysis |
| `GET` | `/api/burnout?userId=` | Fetch burnout metrics |
| `POST` | `/api/burnout?userId=` | Log burnout + Groq recommendation |

---

## 🧮 AI & Scoring Engine

### Mental Health Scoring (`lib/scoring-engine.ts`)

All scores are calculated client-side in real-time from the last 7 check-ins:

#### 1. Stress Score (0–100)
```
stressScore = avg_stress × 10
+ (screenTime > 8h) × 3 per extra hour
+ (sleep < 7h) × 5 per hour deficit
− 8 if meditation ≥ 15 min/day
− 8 if exercise ≥ 30 min/day
```
**Risk Levels**: Optimal → Mild → Moderate → High → Critical

#### 2. Burnout Risk (0–100%)
```
burnoutIndex = (workHours > 9h) × 12
+ (stressScore > 50) × 0.9
+ (sleep < 6.5h) × 15
+ (energy < 5) × 8
+ (screenTime > 10h) × 5
− 10 if exercise ≥ 30 min
− 8 if meditation ≥ 10 min
```
**Status Levels**: Low Risk → Moderate Caution → High Warning → Imminent Burnout

#### 3. Sleep Score (0–100)
```
sleepScore = sleepQuality × 8 (base)
+ 20 if |sleep - 8h| ≤ 0.5h (optimal window)
+ 12 if |sleep - 8h| ≤ 1.5h
```

#### 4. Focus Score (0–100)
```
focusScore = productivity × 6 + energy × 3
− 15 if stressScore > 60
− 15 if sleep < 6h
+ 10 if meditation > 10 min
```

#### 5. Overall Mental Health Index
```
overallScore = mood × 10 × 0.25
+ (100 − stress) × 0.25
+ sleepScore × 0.20
+ focusScore × 0.15
+ energyScore × 0.15
```

### Groq AI Functions (`lib/groq-service.ts`)

| Function | Trigger | Output |
|---|---|---|
| `generateDashboardInsight()` | Dashboard load / refresh | 2-sentence neural insight |
| `generateAICoachResponse()` | AI Coach chat message | Contextual coaching reply |
| `analyzeJournalEntry()` | Journal save | JSON: emotion, sentiment, keywords, insights |
| Inline via API routes | Focus/Sleep/Stress/Burnout save | Domain-specific AI tips |

---

## 🔐 Authentication System

BrainOS supports **three authentication methods**:

### 1. Email + Password (Credentials)
- Registration via `/api/auth/signup`
- Password hashed with **bcryptjs**
- User stored in MongoDB `users` collection
- Email OTP verification for password reset
- Fallback: if MongoDB unavailable, creates a session-only user

### 2. Google OAuth
- One-click sign-in via Google account
- Automatically creates MongoDB user record on first sign-in
- Managed by NextAuth `GoogleProvider`

### 3. GitHub OAuth
- One-click sign-in via GitHub
- Same auto-user-creation flow as Google
- Managed by NextAuth `GitHubProvider`

### Session Management
- **Strategy**: JWT (no database sessions)
- **Session token**: HTTP-only cookie (`next-auth.session-token`)
- **Dual auth state**: NextAuth session + localStorage flag for instant UI
- **Auth flow**: `AuthScreen` → NextAuth → `BrainOSProvider` sync → Dashboard

### Email OTP System
- Generated using `lib/email.ts` with Nodemailer
- 6-digit code, 10-minute expiry
- In-memory verification store (`lib/verificationStore.ts`)
- HTML-templated branded email (BrainOS Security Enclave design)
- Graceful fallback: returns code in dev console when SMTP not configured

---

## 🌍 Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# ─── Groq LLM API ───────────────────────────────────────────────
NEXT_PUBLIC_GROQ_API_KEY=""          # Your Groq API key (free tier available)

# ─── MongoDB ────────────────────────────────────────────────────
MONGODB_URI=""                        # MongoDB Atlas connection string
                                      # Format: mongodb+srv://user:pass@cluster.mongodb.net/brainos

# ─── Email / SMTP ───────────────────────────────────────────────
SMTP_HOST="smtp.gmail.com"            # SMTP host
SMTP_PORT="587"                       # SMTP port (587 for TLS, 465 for SSL)
SMTP_USER=""                          # Email address (sender)
SMTP_PASS=""                          # App password (not regular password)
EMAIL_FROM=""                         # From address shown to recipients

# ─── Google OAuth ───────────────────────────────────────────────
GOOGLE_CLIENT_ID=""                   # From Google Cloud Console → OAuth 2.0
GOOGLE_CLIENT_SECRET=""

# ─── GitHub OAuth ───────────────────────────────────────────────
GITHUB_CLIENT_ID=""                   # From GitHub → Developer Settings → OAuth Apps
GITHUB_CLIENT_SECRET=""

# ─── NextAuth ───────────────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"  # Your app's base URL
NEXTAUTH_SECRET=""                    # Random secret (generate: openssl rand -base64 32)
JWT_SECRET=""                         # JWT signing secret
```

> **Note**: BrainOS works fully without a Groq API key — the scoring engine and local features remain fully functional. AI features degrade gracefully with fallback responses.

> **Note**: BrainOS works without MongoDB for local development — all data falls back to `localStorage`. MongoDB enables multi-device sync.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>= 20.x`
- **MongoDB Atlas** account (free tier works)
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository

```bash
git clone https://github.com/Muhammad-Ahmed-Developerr/BrainOS.git
cd "Brain Os"
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Configure environment

```bash
cp .env.example .env.local
# Fill in your values in .env.local
```

### 4. Run the development server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. (Optional) Configure OAuth

For Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI

For GitHub OAuth:
1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. Set Homepage URL to `http://localhost:3000`
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

---

## 📦 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean Next.js build cache |

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables from `.env.local` to your Vercel project settings.

### Docker / Standalone

The project is configured with `output: 'standalone'` in `next.config.ts`:

```bash
npm run build
node .next/standalone/server.js
```

### Environment Checklist for Production
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Set a strong `NEXTAUTH_SECRET` (32+ chars)
- [ ] Update OAuth redirect URIs for production domain
- [ ] Configure MongoDB Atlas IP whitelist to allow your server
- [ ] Configure SMTP credentials for email verification

---

## 🎨 Design System

BrainOS uses a **dark glassmorphism design system**:

- **Background**: `#020203` (near-black neural dark)
- **Primary Accent**: Cyan `#06B6D4` / `#22D3EE`
- **Secondary Accent**: Purple `#A855F7` / `#9333EA`
- **Glass Cards**: `bg-white/3 backdrop-blur-xl border border-white/8`
- **Aurora Background**: Canvas-based animated radial gradients + floating particles
- **Font**: System font stack (optimized via Next.js)
- **Animations**: Motion.js entrance animations + GSAP sequences
- **Charts**: Recharts with custom cyan/purple gradient fills

---

## 📄 License

This project is private and proprietary.

---

<div align="center">

**Built with 🧠 by Muhammad Ahmed**

*BrainOS — Optimize Your Mind. Elevate Your Life.*

</div>
