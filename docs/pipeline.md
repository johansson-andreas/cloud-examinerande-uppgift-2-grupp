# Pipeline

## Development

### Automatisk Prettier formatering

Automatisk formatering med Prettier genom [Husky](https://typicode.github.io/husky/) git hook innan en commit exekuteras. Innebär att git diffs kommer se mycket renare ut och det blir lättare att jämföra kodändringar i längden för projektet.

### Main: Lint och unit tests

`main`-branchen är en utvecklingsbranch där alla nya features samlas så att man kan se till att allt som kommer in fungerar tillsammans.

När man gör en push eller pull request till branchen `main` så kommer requesten gå igenom ett workflow som lintar och kör enklare tester på koden. Tester görs med jest och Playwight (e2e).

### Preview: Fulla tester

Vid push till `preview`-branchen så kommer större tester med jest och Playwright att köras, samt så görs en performance-utvärdering med Lighthouse.

## Deploy

Deployment av appens olika komponenter körs automatiskt när kod pushas in i `prod`-branchen.

### Next.js app

Next.js-appen deployas till [Render](https://render.com).

### Edge functions

Vår "backend" består av att göra anrop till "edge functions" som ligger hos Supabase.

### Auto Changelog

Lägger automatiskt till inlägg i CHANGELOG.md genom [auto-changelog](https://github.com/CookPete/auto-changelog) när kod pushas in i `prod`.
