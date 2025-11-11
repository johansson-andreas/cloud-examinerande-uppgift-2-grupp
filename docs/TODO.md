# TODO

Alternativ ur spec:en som vi vill fokusera på.

## Nya features:

- [x] Bryt ut backend från Next.js
- [x] Kunna redigera inlägg
- [x] Ta bort inlägg (med bekräftelse innan det tas bort)
- [x] Enkel sök (taggar)
- [x] Markdownsupport för inläggen
- [ ] Få in AI-komponenten som läser in de 10 senaste inläggen och ger användaren feedback. Alltså tänk en knapp som man kan trycka på och så får man svar från AI.

## CI/CD:

- [x] Hantera projektet med GitHub Projects
- [x] Sätt upp regler för branch management, commits och peer review vid merge requests
- [x] Deploya frontend till Vercel
- [x] Grundläggande CI/CD med Github Actions (t.ex. `lint` och `test`)
- [x] Implementera tester
- [x] Testa projektet med Docker
- [x] Generera automatiskt en CHANGELOG.md baserat på era commit-meddelanden.
- [x] Deploya backend och frontend på olika ställen
- [x] Deploya projektet med containerisering (Docker)
- [x] Bygga och pusha Docker images automatiskt till ett container registry när kod pushas

## Mer alternativ

Övriga alternativ från spec:en vi kan titta på om det finns tid över.

### Nya features:

- [ ] Darkmode
- [ ] Export (typ exportera allt som JSON)
- [ ] Taggar på inläggen (ex. humör eller andra kategorier)
- [ ] Kan man typ använda AI med structured outputs för att hitta mood i inläggen och kanske automatiskt kategorisera eller tagga inlägg?
- [ ] Utöver enkel sök, få in semantisk sökning eller sök med filtrering på typ taggar eller annan metadata typ datum (eller AI taggarna från förra featuren) etc.

### CI/CD:

- [ ] Använd en mer robust CI/CD pipeline och motivera era val i readme
- [ ] Typ security scanning (npm audit eller Snyk)
- [x] Lighthouse CI: Automatiska tester av prestanda, tillgänglighet, SEO och best practices. Samma verktyg som finns i Chrome DevTools.
- [ ] Deploy till staging-miljö innan production (men utan Vercel)
- [x] E2E (end-to-end) tester med Playwright eller Cypress
- [ ] En större och mer utförlig testsvit (som testar fler saker)
