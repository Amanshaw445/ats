# Asansol Tech Solutions — React + Vite + Vercel

## One-Time Setup (Windows PowerShell)

```powershell
# 1. Go into the project folder
cd ats-vite

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd api
npm install
cd ..

# 4. Login to Vercel (opens browser)
npx vercel login

# 5. Deploy!
npx vercel --prod
```

> Use `npx vercel` instead of `vercel` — npx downloads it temporarily if needed.

---

## Environment Variables (set in Vercel Dashboard)

After deploying, go to: **vercel.com → your project → Settings → Environment Variables**

| Variable | Value |
|---|---|
| `JWT_SECRET` | any long random string e.g. `my-super-secret-key-abc123` |
| `ADMIN_PASSWORD` | `aman45@shaw` |

Then redeploy: `npx vercel --prod`

---

## Local Development

```powershell
# Terminal 1 — Frontend (React/Vite)
npm run dev

# Terminal 2 — Backend (API functions locally via Vercel CLI)
npx vercel dev
```

---

## URLs after deploy
- **Website:** `https://your-project.vercel.app/`
- **Admin:**   `https://your-project.vercel.app/admin`
- Password: `aman45@shaw`

---

## Why no better-sqlite3?

`better-sqlite3` requires compiling native C++ code (needs Visual Studio on Windows).
This project uses `@libsql/client` — pure JavaScript SQLite, works on Windows, Mac, Linux and Vercel with zero compilation.

## Persistent Database (Optional)

By default the database uses `/tmp` on Vercel (resets occasionally).
For permanent data, sign up free at **turso.tech**, create a database, and set:
- `TURSO_URL` = `libsql://your-db.turso.io`
- `TURSO_AUTH_TOKEN` = your token

No code changes needed — the app detects and uses Turso automatically.
