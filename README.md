# Ganpati Shloka — Vercel + Supabase Deployment Guide

This project is a static HTML/CSS/JavaScript app and is already suitable for Vercel deployment with no build step required.

## Project structure

- index.html — public homepage with the eight life-situation shlokas
- admin.html — authenticated admin dashboard for add / edit / view / delete / QR / print
- shloka.html — exact shloka detail page for a QR scan
- print.html — printable shloka cards
- styles.css — visual styling
- config.js — runtime Supabase config placeholders
- supabase.sql — Supabase schema and seed data

## What this project does

### 1. Admin Station — /admin.html
- Add shlokas manually
- See all shlokas
- View total count
- Download QR code PNG
- Open exact shloka
- Edit and delete shlokas
- Use Print Center

### 2. Public homepage — /
- Shows the welcome message
- Shows all eight shlokas visibly
- Each shloka card includes title, category, Sanskrit, preview and Read & Listen button

### 3. Individual shloka page — /shloka.html?id=...
- Loads one exact shloka by ID
- Shows Sanskrit, transliteration, English/Marathi/Hindi translations
- Provides browser voice support
- Handles unsupported browsers gracefully

### 4. Print center — /print.html
- Shows all printable QR cards
- Includes QR pointing to the exact shloka page
- Works with browser print

## Stack

- HTML
- CSS
- Vanilla JavaScript
- Supabase PostgreSQL
- QRCode.js CDN
- Browser Web Speech API
- Vercel static hosting

This is intentionally simple and production-friendly for a demo/test deployment.

## Supabase setup

STEP 1
Create a Supabase project.

STEP 2
Open the Supabase SQL editor and run the contents of supabase.sql.

STEP 3
After the SQL runs, note down:
- Project URL
- Anon/Public Key

STEP 4
Open config.js and replace these placeholders:

```js
window.SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
window.SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

IMPORTANT:
- Use the public anon key only in the browser.
- Never put the Supabase service-role key in frontend code, GitHub, or Vercel frontend config.
- Do not expose private credentials.

## Required database data

The SQL file includes eight teachings:
1. कर्म → निष्काम कर्म (Chapter 2, Verse 47)
2. ज्ञान → ज्ञान की शक्ति (Chapter 4, Verse 38)
3. धैर्य → स्थिरता (Chapter 18, Verse 33)
4. संयम → आत्मनियंत्रण (Chapter 2, Verse 58)
5. दृढ़ता → एकाग्र संकल्प (Chapter 2, Verse 41)
6. भक्ति → ईश्वराशी जोडलेले मन (Chapter 12, Verse 8)
7. समरसता → समत्व (Chapter 2, Verse 48)
8. सत्य → सत्यप्रिय वाणी (Chapter 17, Verse 15)

The SQL file removes only the six original demo pairs and uses an idempotent seed/update flow for the eight canonical records when re-run. The existing `message` column is retained as the database name for Life Message.

## Vercel deployment

This project is a static website and does not require any build command.

STEP 1
Create a GitHub repository for the project.

STEP 2
Push the existing project files to that repository.

STEP 3
Open Vercel and click Import Project.

STEP 4
Select the GitHub repository.

STEP 5
Use the default Vercel settings for a static site.
- Build command: leave empty or not required
- Output directory: leave empty or use the project root

STEP 6
Deploy.

STEP 7
After deployment, open the live URL.

Example:
https://your-project-name.vercel.app/

## Environment variables

This app is designed as a static frontend, so the browser reads the public Supabase values from config.js.

You do not need a backend or Vercel env file for the basic deployment.

If you choose to add a Vercel environment variable layer later, use only values that are safe to expose in the browser. Do not add service-role secrets.

## QR flow

Each shloka uses a deterministic URL in the format:

```text
/shloka.html?id=<database-id>
```

Example:

```text
https://your-project.vercel.app/shloka.html?id=5
```

The page reads the ID from the URL and loads that exact record from Supabase.

## Local testing

Run this in the project folder:

```bash
python -m http.server 8000
```

Then open:
- http://localhost:8000/
- http://localhost:8000/admin.html
- http://localhost:8000/print.html
- http://localhost:8000/shloka.html?id=1

## Recommended deployment checklist

Before going live, confirm:
- homepage shows all eight shlokas
- admin page works
- QR code links use the deployed domain
- shloka page loads the exact shloka by ID
- English/Marathi/Hindi translations work
- voice buttons work in supported browsers
- print page loads all cards
- no private secrets are committed to GitHub

## Security note

This is a simple static test/demo deployment.

The admin page is intentionally minimal and should not be treated as a production authentication setup. Before public production use, add proper admin authentication and tighten Supabase Row Level Security.

## Git commands

```bash
git init
git add .
git commit -m "Initial Ganpati Shloka deployment setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Vercel testing procedure

After deployment, test these pages:

1. Homepage
   - confirm it shows the welcome message and all eight shlokas
2. Admin page
   - confirm total count is eight
   - add a shloka
   - delete a shloka
3. QR generation
   - confirm the QR points to the live deployed origin
4. Single shloka page
   - open /shloka.html?id=1 and verify it loads the correct record
5. Translation tabs
   - verify English, Marathi and Hindi switch correctly
6. Voice buttons
   - confirm browser speech works when supported
7. Print page
   - confirm all cards render and QR links point to the correct shloka
8. Mobile layout
   - confirm text, buttons and QR pages fit on a phone screen

## Final deployment note

This app is intentionally kept static for speed, simplicity, and reliable Vercel deployment. It is suitable for a test or event deployment using Supabase and Vercel without introducing a backend build system.
