# Pipeline

## Automatisk Prettier formatering

Automatisk formatering med Prettier genom [Husky](https://typicode.github.io/husky/) git hook innan en commit exekuteras. Innebär att git diffs kommer se mycket renare ut och det blir lättare att jämföra kodändringar.

## Test och lint

När man gör en pull request till branchen `main` så kommer requesten gå igenom ett workflow som lintar och testar koden. Tester görs med jest och Playwight (e2e).

## Auto Changelog

Lägg automatiskt till inlägg i CHANGELOG.md genom [auto-changelog](https://github.com/CookPete/auto-changelog).

## Deploya Next.js app

Next.js-appen deployas automatiskt till Vercel när commits genomförs till branchen `prod`.

## Deploya serverless functions

Vi kommer att refaktorera backend-logik från Next.js-appen till en separat mapp för att deployas separat från appen. Vi vill utforska alternativ som **Supabase edge functions** eller **AWS Lamba** istället för att bygga en Express.js server.
