# NexusFlow AI

Next.js 14 (App Router) · TypeScript · Tailwind · shadcn/ui · MongoDB Atlas (Mongoose) · NextAuth v5 · Recharts

## Phase 1 (this drop)
Project setup, cached Atlas connection (`lib/db.ts`), Zod-validated env (`lib/env.ts`), NextAuth v5
(Google + Credentials, JWT, OWNER/ADMIN/MEMBER), middleware guarding `/dashboard` and `/admin`,
and the analytics dashboard (MRR, active projects, tasks).

## Run
```bash
npm install
cp .env.example .env.local   # fill in MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL, GOOGLE_*
npm run dev
```

Google OAuth redirect URI: `{NEXTAUTH_URL}/api/auth/callback/google`

## Deploy to Vercel
1. Push to GitHub and import the repo in Vercel.
2. Add every variable from `.env.example` (set `NEXTAUTH_URL` to your production URL).
3. In Atlas > Network Access, allow `0.0.0.0/0` (Vercel uses dynamic IPs).
4. Add the production redirect URI to your Google OAuth client.

## Next phases
Clients CRUD, Projects + Kanban, Stripe billing, AI proposals, invoices (Resend), settings, UploadThing.
