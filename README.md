# Personal Portfolio — Next.js 16 + Turso + AI Chatbot

A full-featured developer portfolio built with Next.js 16, featuring a password-protected admin panel, AI chatbot assistant, PDF CV generation, Cloudinary image uploads, and a Turso (LibSQL) database.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Turso](https://img.shields.io/badge/Turso-LibSQL-4FF8D2)

---

## Features

### Public Portfolio
- **Hero** — name, title, bio, social links, and CV download button
- **Experience** — work history with company, role, type, dates, and rich-text descriptions
- **Projects** — gallery with image carousel, live/GitHub links, and tech-stack tags; each project has a dedicated detail page
- **Skills** — categorized technical skills
- **Education** — academic background with institution, degree, and years
- **Certifications** — professional certifications with issuer, dates, and credential links
- **Languages** — native languages and CEFR proficiency levels (A1–C2)
- **Contact** — contact form that saves messages to the database
- **AI Chat Widget** — floating assistant powered by Groq that answers questions about your portfolio
- **CV Download** — generates a professional PDF on-the-fly from live database content

### Admin Panel (`/admin`)
Password-protected dashboard to manage every section of the portfolio:
- Personal info, experience, projects, skills, education, certifications, languages
- Image uploads via Cloudinary with drag-and-drop
- Rich text editor (TipTap) for experience and project descriptions
- Visibility toggle to show/hide items without deleting them
- Display order control
- Inbox for contact form messages with read/unread status

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3, Framer Motion |
| UI Components | shadcn/ui, Radix UI, Lucide Icons |
| Database | Turso (LibSQL / SQLite) |
| ORM | Prisma 7 with `@prisma/adapter-libsql` |
| Auth | NextAuth 5 (Auth.js), JWT sessions |
| AI | Vercel AI SDK 6, Groq (`llama-3.1-8b-instant`) |
| PDF | `@react-pdf/renderer` |
| Images | Cloudinary |
| Rich Text | TipTap |
| Forms | React Hook Form + Zod |
| Toasts | Sonner |

---

## Getting Started

### Prerequisites

- **Node.js** 20.9 or later
- **Turso CLI** — `npm install -g @tursodatabase/cli` ([docs](https://docs.turso.tech/cli/introduction))
- A free account on: [Turso](https://turso.tech), [Groq](https://console.groq.com), [Cloudinary](https://cloudinary.com)

### 1. Clone the repository

```bash
git clone https://github.com/elnatal/portfolio.git
cd portfolio
npm install
```

### 2. Create the Turso database

```bash
turso auth login
turso db create portfolio-db
turso db show portfolio-db           # copy the URL
turso db tokens create portfolio-db  # copy the token
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Turso database
TURSO_DATABASE_URL="libsql://your-db-name.turso.io"
TURSO_AUTH_TOKEN="your-turso-token"

# NextAuth — generate a secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Admin login credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-password"

# Groq AI (free tier — https://console.groq.com/keys)
GROQ_API_KEY="gsk_..."

# Cloudinary (https://console.cloudinary.com → Settings → API Keys)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Run the development server

```bash
npm run dev
```

This automatically applies any pending database migrations, then starts the server.

- Portfolio: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Database

### Schema

```
PersonalInfo    — name, title, bio, email, phone, location, social links
Experience      — company, role, type, start/end date, description, visible
Project         — name, summary, description, tags (JSON), images (JSON), links, featured, visible
Skill           — name, category, order, visible
Education       — institution, degree, field, start/end year, description, visible
Certification   — name, issuer, issue/expiry date, credential URL, image, visible
Language        — name, isMother, CEFR levels (listening/reading/writing/spoken), visible
ContactMessage  — name, email, subject, message, read
```

### Migrations

Migrations live in `prisma/migrations/`. To create a new one after modifying `prisma/schema.prisma`:

```bash
# Generate the SQL diff (does NOT touch any database)
npx prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script > prisma/migrations/$(date +%Y%m%d%H%M%S)_description/migration.sql

# Apply to Turso
npm run db:migrate
```

Migrations are applied automatically on both `npm run dev` and `npm run build`.

---

## Deployment (Vercel)

### 1. Push to GitHub and import in Vercel

Connect your repository at [vercel.com/new](https://vercel.com/new).

### 2. Set environment variables

In your Vercel project → **Settings → Environment Variables**, add all values from `.env.example` with production values:

| Variable | Notes |
|---|---|
| `TURSO_DATABASE_URL` | Your Turso database URL |
| `TURSO_AUTH_TOKEN` | Your Turso auth token |
| `NEXTAUTH_URL` | Your production URL, e.g. `https://yourname.vercel.app` |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate |
| `ADMIN_EMAIL` | Your admin login email |
| `ADMIN_PASSWORD` | Your admin login password |
| `GROQ_API_KEY` | From [console.groq.com/keys](https://console.groq.com/keys) |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |

### 3. Deploy

Every push to `main` automatically:
1. Regenerates the Prisma client
2. Applies any new migrations to Turso
3. Builds the Next.js bundle

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # SQL migration files
│   └── seed.ts                 # Optional seed script
├── scripts/
│   ├── turso-migrate.mjs       # Apply migrations to Turso
│   └── sqlite-to-turso.mjs     # One-time: copy local SQLite data to Turso
├── src/
│   ├── app/
│   │   ├── page.tsx            # Public portfolio home
│   │   ├── layout.tsx          # Root layout
│   │   ├── admin/              # Protected admin panel
│   │   ├── api/                # API route handlers
│   │   ├── login/              # Login page
│   │   └── projects/[id]/      # Project detail page
│   ├── components/
│   │   ├── portfolio/          # Public-facing sections + chat widget
│   │   ├── admin/              # Admin forms and components
│   │   ├── layout/             # Navbar, admin sidebar
│   │   └── ui/                 # shadcn/ui primitives
│   └── lib/
│       ├── auth.ts             # NextAuth configuration
│       ├── auth.config.ts      # Edge-safe auth config (proxy)
│       ├── prisma.ts           # Prisma client singleton
│       ├── portfolio-context.ts # Builds AI chatbot context from DB
│       ├── cv-pdf.tsx          # PDF CV document component
│       └── utils.ts            # Utilities
├── prisma.config.ts            # Prisma v7 config with Turso adapter
└── next.config.mjs
```

---

## Customization

All content is managed through the admin panel at `/admin` — no code changes needed to update your profile.

For visual customization:

| What | Where |
|---|---|
| Colors & theme | `src/app/globals.css` (CSS variables) |
| Fonts | `src/app/layout.tsx` |
| CV layout & styling | `src/lib/cv-pdf.tsx` |
| AI chatbot persona & system prompt | `src/app/api/chat/route.ts` |
| Portfolio sections shown | `src/app/page.tsx` |

---

## Scripts

```bash
npm run dev          # Apply migrations + start dev server
npm run build        # Apply migrations + build for production
npm run start        # Start production server
npm run db:migrate   # Apply pending migrations to Turso manually
npm run lint         # Run ESLint
```

---

## License

MIT — free to use and adapt for your own portfolio.
