# Style guide

## Branches

- `prod` - production deployment
- `main` - staging preview
- `{type}/{issue}` - working branches

Branches kan skapas via GitHub Projects för att direkt koppla en branch till ett specifikt issue. Då kan man lättare ta sig till den branch där någon arbetar på ett issue och titta på koden.

### Namngivning
Namnet på branches består av två delar:
- Type (`fix`, `feature`, `docs` etc. Se nedan för full lista med alternativ samt förklaringar)
- Kortfattat namn baserat på issue-titeln

Branch-namnet blir då t.ex: `feat/user-api-routes` eller `fix/broken-login-form`.

### Branch types

- `feature`: Lägger till ny funktionalitet.
- `fix`: Ändrar, optimerar eller fixar existerande kod.
- `chore`: Städar upp eller refaktorerar kod, uppdaterar dependencies, lägger till kommentarer, flyttar runt filer etc.
- `docs`: Bygger ut eller kompletterar dokumentation.
- `test`: Utveckling och implementation av tester.



## Commits

- [Commit-struktur som förenklar automatiserad Changelog](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Förslag på commit-struktur](https://cbea.ms/git-commit/)

Förslag på prefix för commits:
- `fix`
- `chore`
- `docs`
- `test`

(behandla commits utan prefix som en `feature`-implementation, så kan därför uteslutas)

## Pull requests

- En pull request från en `working branch` till `main` kräver review av **minst en person**
- En pull request från `main` till `prod` kräver review av **branch maintainer** (alt. **två personer**?)
- Branch skall raderas när den merge:as in i `main`.

## Formatering

Kodformatering genom Prettier körs innan commit. Detta automatiseras genom Husky när man gör en commit, så man behöver inte manuellt göra en formatering. Detta för att se till att git diffs blir lättare att läsa när man jämför kodändringar.
