# Pipeline

## Automatisk Prettier formatering
Automatisk formatering med Prettier genom [Husky](https://typicode.github.io/husky/) git hook innan en commit exekuteras. Innebär att git diffs kommer se mycket renare ut och det blir lättare att jämföra kodändringar.

## Auto Changelog
Lägg automatiskt till inlägg i CHANGELOG.md genom [auto-changelog](https://github.com/CookPete/auto-changelog).

## Deploya Next.js app
Deploya Next.js appen till eventuellt Vercel eller liknande tjänst.

## Deploya serverless functions
Vi kommer att refaktorera backend-logik från Next.js-appen till en separat mapp för att deployas separat från appen. Vi vill utforska alternativ som **Supabase edge functions** eller **AWS Lamba** istället för att bygga en Express.js server.
