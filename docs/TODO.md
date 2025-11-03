# TODO

Alternativ ur spec:en som vi vill fokusera på.

## Nya features:
- [ ] Bryt ut backend från Next.js
- [ ] Kunna redigera inlägg
- [ ] Ta bort inlägg (med bekräftelse innan det tas bort)
- [ ] Enkel sök (taggar)
- [ ] Markdownsupport för inläggen
- [ ] Få in AI-komponenten som läser in de 10 senaste inläggen och ger användaren feedback. Alltså tänk en knapp som man kan trycka på och så får man svar från AI.
- [ ] Lägg in så att användaren kan lägga upp filer (använd någon typ av Storage)

## CI/CD:
- [x] Hantera projektet med GitHub Projects
- [ ] Sätt upp regler för branch management, commits och peer review vid merge requests
- [ ] Deploya frontend till Vercel (?)
- [x] Grundläggande CI/CD med Github Actions (t.ex. `lint` och `test`)
- [x] Implementera tester
- [ ] Testa projektet med Docker
- [ ] Generera automatiskt en CHANGELOG.md baserat på era commit-meddelanden.
- [ ] Deploya backend och frontend på olika ställen
- [ ] Deploya projektet med containerisering (Docker)
- [ ] Bygga och pusha Docker images automatiskt till ett container registry när kod pushas

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
- [ ] Lighthouse CI: Automatiska tester av prestanda, tillgänglighet, SEO och best practices. Samma verktyg som finns i Chrome DevTools.
- [ ] Deploy till staging-miljö innan production (men utan Vercel)
- [ ] E2E (end-to-end) tester med Playwright eller Cypress
- [ ] En större och mer utförlig testsvit (som testar fler saker)
