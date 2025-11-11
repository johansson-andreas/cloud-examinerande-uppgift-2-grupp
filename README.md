# Journal App - Student Assignment Starter

A minimalist journaling application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. This project serves as a starting point for students to practice debugging, adding features, and improving existing code.

Deployed link: [https://fjs24grupp4.onrender.com/](https://fjs24grupp4.onrender.com/)

## Tech Stack

- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (Authentication + PostgreSQL + Edge Functions)
- **Deployment**: GitHub Actions, Docker & Render

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dagboks-appen
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Skapa nytt projekt på supabase
2. Kör allt som finns i `supabase/schema.sql` i SQL-editorn
3. Hitta API-nycklar på Supabase och ersätt i .env.example

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Design Philosophy

This app follows a minimalist, editorial design approach:

- **Typography:** Serif fonts for headings, sans-serif for body text
- **Color Palette:** Cream backgrounds with dark brown text and warm gray accents
- **Spacing:** Generous whitespace for readability
- **Layout:** Clean, centered layouts with maximum content width
- **Interaction:** Subtle hover states and transitions

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Fyll på med era reflektioner nedan!

### Branchingstrategier

#### Namn på branches

Vi använder tydliga branchnamn som är kopplade till uppgifter i vår kanban. Vi använder `fix`, `feature`, `chore`, `docs` samt `test` som prefix i våra branchnamn för att tydligare kategorisera vad vad den huvudsakliga uppgiften för koden är i branchen. I våra commitmeddelanden följer vi en liknande strategi med prefix för att göra det tydligt vad fokuset för varje commit är, samt så ska man försöka att hålla titlarna på commits kortfattande och summariserande, med plats för mer förklaring och fördjupning i bodyn av commit:en.

#### `main`-branchen

Utöver ovanstående utvecklingsbranches finns även brancherna `main`, `preview` och `prod`. När man är färdig med till exempel en `feature`-branch så lägger man in en PR till `main`-branchen, där alla utvecklingsbranches samlas för att se till att all ny kod fungerar tillsammans. När kod körs in i main-branchen körs några grundläggande snabba tester och lint:ning.

#### `preview`-branchen

När koden i `main` ser bra ut ska den dras in i `preview`-branchen där tyngre tester som e2e-tester med Playwright köras, samt en performance utvärdering med Lighthouse CI.

#### `prod`-branchen

Nästa steg är att pusha in kod i `prod`-branchen, där projektet byggs till en Docker image som sedan deployas automatiskt till Render.

### Issues och PRs

(med code-reviews av andra i teamet (och kanske AI))

Jobba i Github Projects
Alltid bra att veta vad som är AI-genererat så skriv en rad om det i readmen också, hur ni använt AI för tester etc.

### Pipeline

#### Pre-commit (git hook med Husky)

Prettier-formatering som körs innan en commit läggs till i git-historiken.

#### Github Actions workflows (så vi kan jobba vidare med er CI/CD pipeline sen)

Vi har ett antal olika workflows som körs i olika delar av vår CI/CD pipeline. Det första workflower som körs vid varje pull request in till vår main branch körs ett simpelt lint och kompileringstest, för att se till att inga uppenbara misstag, såsom typos eller bortglömda imports existerar, och senare våra jest tester

Förklara CI/CD-pipelinen noggrannt i readmen, alltså varför du/ni gör vissa grejer etc. (så vi fattar)
En setup för att köra tester (jest, vitest etc.)
En Dockerfile så att vi kan köra docker build och sen docker run för att testa projektet!

### Vidareutveckling och förbättringar

- En mer robust utvecklingspipeline med testdatabas och preview deploy kopplad till `preview`-branchen
- Mer fördjupning i tester, vi har mest fokuserat på att bygga ett workflow och pipeline
