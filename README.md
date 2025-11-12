# Journal App - Student Assignment Starter

A minimalist journaling application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. This project serves as a starting point for students to practice debugging, adding features, and improving existing code.

Deployed link: [https://fjs24grupp4.onrender.com/](https://fjs24grupp4.onrender.com/)

## Tech Stack

- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (Authentication + PostgreSQL + Edge Functions)
- **Deployment**: GitHub Actions, Docker & Render

## Kom igång

### 1. Klona repot

```bash
git clone <repository-url>
cd dagboks-appen
```

### 2. Installera dependencies

```bash
npm install
```

### 3. Sätt upp Supabase

1. Skapa nytt projekt på supabase
2. Kör allt som finns i `supabase/schema.sql` i SQL-editorn
3. Hitta API-nycklar på Supabase och ersätt i .env
4. Lägg in referens till Supabase-projektets ref

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_PROJECT_REF=supabase-project-ref-here
```

### 4. Google API-nyckel

Registrera och hämta ut en API-nyckel genom Google AI studio för att aktivera AI-funktionaliteten i appen. Denna behöver också läggas till i `.env`.

```zsh
GOOGLE_API_KEY=your-api-key-here
```

### 5. Deployment

Vid deployment krävs att man har alla ovanstående nycklar, samt att man registrerar ett konto på Docker Hub dit projektets image kommer att laddas upp. Du kommer behöva ditt Docker-användarnamn (`DOCKER_USERNAME`) samt hämta ut en Personal Access Token (`DOCKER_PASSWORD`). Ditt projekts namn kommer användas som namnet på den byggda Docker image:en och anges i variabeln `IMAGE_NAME`.

Man behöver också registrera ett konto och skapa ett nytt projekt på [Render](https://render.com). Där kan du hämta ut en deploy hook (`RENDER_DEPLOY_HOOK`) som kommer användas för att sätta igång en deploy.

Alla variabler behöver sedan läggas in i GitHubs **Environment secrets** under en miljö som heter **production**.

```zsh
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_PROJECT_REF

# Docker
DOCKER_USERNAME
DOCKER_PASSWORD
IMAGE_NAME

# Render
RENDER_DEPLOY_HOOK
```

### Valfritt: E2E tester för att testa inloggad funktionalitet

Lägg in inloggningsuppgifter för ett konto som har tillgång att interagera med Supabase-databasen i `.env` för att testa lokalt, alt. lägg in i GitHub secrets för att köra i test-pipelinen:

```
TEST_USER_EMAIL
TEST_PASSWORD
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

---

## Reflektioner

### Branchingstrategier

#### Namn på branches

Vi använder tydliga branchnamn som är kopplade till uppgifter i vår kanban. Vi använder `fix`, `feature`, `chore`, `docs` samt `test` som prefix i våra branchnamn för att tydligare kategorisera vad vad den huvudsakliga uppgiften för koden är i branchen. I våra commitmeddelanden följer vi en liknande strategi med prefix för att göra det tydligt vad fokuset för varje commit är, samt så ska man försöka att hålla titlarna på commits kortfattande och summariserande, med plats för mer förklaring och fördjupning i bodyn av commit:en. Det fanns många olika alternativ på prefix vi hade kunnat implementera i vårt workflow, men vi valde att avgränsa det till några få val. För t.ex. `chore` valde vi att ha en ganska bred definition som annars det kanske är vanligare i större projekt att dela upp i flera olika prefix.

#### `main`-branchen

Utöver ovanstående utvecklingsbranches finns även brancherna `main`, `preview` och `prod`. När man är färdig med till exempel en `feature`-branch så lägger man in en PR till `main`-branchen, där alla utvecklingsbranches samlas för att se till att all ny kod fungerar tillsammans. När kod körs in i main-branchen körs några grundläggande snabba tester och lint:ning.

#### `preview`-branchen

När koden i `main` ser bra ut ska den dras in i `preview`-branchen där tyngre tester som e2e-tester med Playwright köras, samt en performance utvärdering med Lighthouse CI. Denna branch kan i just detta projekt som det ser ut just nu kännas lite överflödigt, men tanken är att om man bygger ut utvecklingsprocessen och inkluderar t.ex. deploy till en staging preview eller vill ha en utvecklings- och testmiljö så finns det rum i strukturen att koppla detta till preview-branchen.

#### `prod`-branchen

Nästa steg är att pusha in kod i `prod`-branchen, där projektet byggs till en Docker image som sedan deployas automatiskt till Render. Här pushas även nya inlägg till i `CHANGELOG.md` genom auto-changelog.

### Issues och PRs

Våran lösning med Github projects(kanban) hade möjligheten att kunna skapa en separat branch för varje issue. Med detta så höjdes tydligheten i att alltid kunna se branchen som uppdateras samt att kanban brädet flyttade issues automatiskt till done när man pushade upp till production.

(med code-reviews av andra i teamet (och kanske AI))

Jobba i Github Projects

### AI-användning i projektet

AI har framförallt varit ett bra verktyg för att hjälpa till att skriva tester, då tester ibland kan ta ännu längre tid än att skriva faktiskt funktionalitet. Det har varit hjälpsamt att lära sig om hur man skriver tester med olika libraries, samt vilka typer av tester som är bra att genomföra och att få en introduktion till best practices. Det har också hjälp en del som ett stöd skriva våra workflows.

### Pipeline

#### Pre-commit (git hook med Husky)

Det körs en Prettier-formatering innan en commit läggs till i git-historiken. Vi har valt att implementera detta då det kommer resultera i att git diffs kommer se mycket renare ut och det blir lättare att jämföra kodändringar i längden för projektet.

#### Github Actions workflows (så vi kan jobba vidare med er CI/CD pipeline sen)

Vi har ett antal olika workflows som körs i olika delar av vår CI/CD pipeline. Det första workflowet som körs vid varje pull request in till vår main branch är ett simpelt lint och kompileringstest, för att se till att inga uppenbara misstag, såsom typos eller bortglömda imports existerar, och senare våra jest tester. När en commit pushas till vår preview branch så körs de mer intensiva testerna som playwright och lighthouse. När allting är färdigt i det steget så pushas commiten till vår prod branch där vi har ett workflow som skapar en docker image, skickar upp den till docker hub och därmed även deployas till Render.

#### Tester

Vi har satt upp några grundläggande tester som körs vid push till `main`- och `preview`-branchen. I main har vi valt att bara köra mindre tester med Jest som går snabbare att köra för att göra det smidigare att köra in nya features i main branchen, och då snabbt kunna komma igång med att se till att allt är integrerat ordentligt. Detta står `dev-ci`-workflowet för, och kör endast tester som är taggade med `@smoke`.

`preview-ci`-workflowet kör alla tillgängliga tester, och kör utöver Jest-tester också e2e tester med Playwright, samt gör en performance review med Lighthouse CI.

Projektet hade med fördel kunnat byggas ut mer fler tester, men vi valde att fokusera just på hur man integrerar det i ett CI/CD workflow, så att skriva utförliga test-sviter var inte vår prioritet.

### Vidareutveckling och förbättringar

- En mer robust utvecklingspipeline med testdatabas och preview deploy kopplad till `preview`-branchen
- Mer fördjupning i tester, vi har mest fokuserat på att bygga ett workflow och pipeline
- Dyka lite djupare i auto-changelog, t.ex. bygga en egen template.
