# Human Experience Matrix

Human Experience Matrix is a full-stack AI web application that helps users examine life problems through multiple human lenses: history, psychology, philosophy, entrepreneurship, science, and spirituality.

Users can ask a question, choose the perspectives they want, receive a structured AI analysis, and save or revisit previous conversations through an authenticated dashboard.

## Features

- Multi-perspective AI analysis for life questions and decisions
- Structured responses with historical parallels, patterns, lessons, and book recommendations
- Email-based sign in powered by NextAuth
- Guest sessions for trying the product without an account
- Conversation history, saved conversations, and single-conversation views
- Profile settings for authenticated users
- Local-first SQLite development setup
- Groq-backed AI responses
- Service-layer architecture for clean separation between UI, API routes, AI logic, and persistence

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 18, TypeScript, Tailwind CSS |
| Components | Radix UI primitives, Lucide icons |
| Auth | NextAuth v5, Prisma adapter |
| Database | SQLite for local development, Prisma ORM |
| AI | Groq API |
| Tooling | ESLint, TypeScript, Prisma CLI |

## Application Flow

```text
User question
  -> /api/chat
  -> AI service
  -> Prompt builder
  -> Groq response
  -> Conversation service
  -> Prisma database
  -> Response UI and dashboard history
```

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm
- SQLite CLI, available by default on most macOS/Linux machines

### Installation

```bash
git clone https://github.com/zulfie1003/HumanExperienceMatrix.git
cd HumanExperienceMatrix
npm install
```

### Environment Setup

Create your local environment file:

```bash
cp .env.example .env
```

For local development, this is enough to run the app:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="generate-a-secure-secret"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"

AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
NEXT_PUBLIC_GOOGLE_ENABLED="false"

GROQ_API_KEY="your-groq-api-key"
GROQ_MODEL="llama-3.3-70b-versatile"
GROQ_BASE_URL="https://api.groq.com/openai/v1"
GROQ_MAX_TOKENS="4096"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secure auth secret:

```bash
openssl rand -base64 32
```

`GROQ_API_KEY` must be set to a real Groq API key. If it is missing or still set to the placeholder value, the chat API returns a clear configuration error instead of a demo response.

### Database Setup

Generate the Prisma client:

```bash
npm run db:generate
```

Create the local SQLite tables:

```bash
npm run db:init
```

### Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If port `3000` is already in use, Next.js will automatically choose another port. Update `AUTH_URL`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_APP_URL` in `.env` to match the port you use.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:init` | Initialize the local SQLite database from `prisma/init.sql` |
| `npm run db:push` | Push Prisma schema changes to the configured database |
| `npm run db:migrate` | Create and apply a Prisma migration |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed demo data |

## Project Structure

```text
app/
  api/
    auth/                  NextAuth and guest session routes
    chat/                  Main AI analysis endpoint
    user/                  Conversation, saved item, and profile APIs
  ask/                     Main question flow
  dashboard/               History, saved conversations, settings, detail pages
  login/                   Email and guest login UI
  layout.tsx               Root layout
  page.tsx                 Landing page

components/
  ui/                      Reusable UI primitives
  QueryInput.tsx           Question input and submit flow
  PerspectiveSelector.tsx  Perspective picker
  ResponseView.tsx         Structured AI response renderer
  HistoryList.tsx          Conversation history list
  Navbar.tsx               Global navigation

hooks/
  useChat.ts               Client-side chat request state
  useGuestSession.ts       Guest session creation and storage

lib/
  auth.ts                  NextAuth configuration
  groq.ts                  Groq client setup
  prisma.ts                Prisma singleton
  prompts.ts               System and user prompt builders
  utils.ts                 Shared utilities

services/
  ai.service.ts            AI orchestration and response validation
  conversation.service.ts  Conversation persistence
  user.service.ts          User persistence

prisma/
  schema.prisma            Prisma schema
  init.sql                 Local SQLite initializer
  seed.ts                  Demo seed script

types/
  index.ts                 Shared TypeScript types
```

## Authentication

The app supports:

- Guest sessions for immediate use
- Email-based credentials login for local MVP auth
- Optional Google OAuth when credentials are configured

Google login is hidden by default in local development. To enable it:

```env
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_ENABLED="true"
```

## AI Mode

The AI service always calls Groq and expects a strict JSON response shaped by `types/index.ts`. There is no local demo fallback.

## Architecture Notes

- API routes stay thin and delegate business logic to services.
- AI provider logic is isolated in `services/ai.service.ts` and `lib/groq.ts`.
- Conversation storage and response parsing live in `conversation.service.ts`.
- The response contract is centralized in `types/index.ts`.
- The AI layer is RAG-ready; retrieval context can be injected before the LLM call in `services/ai.service.ts`.

## Production Notes

Before deploying:

- Replace all placeholder secrets with real production values.
- Use a production-ready database instead of the local SQLite file.
- Configure `AUTH_URL`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_APP_URL` for your deployed domain.
- Add a real `GROQ_API_KEY` for live AI responses.
- Enable Google OAuth only after adding valid OAuth credentials.
- Do not commit `.env` or `prisma/dev.db`.

## Verification

The current project has been verified with:

```bash
npm run db:generate
npm run db:init
npm run lint
npm run build
```

## License

This project is currently private. Add a license before publishing publicly if you want others to reuse or contribute to it.
