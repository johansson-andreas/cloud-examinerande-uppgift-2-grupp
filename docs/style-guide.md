# Style guide

## Branches

- `main` - production deployment
- `dev` - staging preview
- `{type}/{issue titel}` - working branches

Branches kan skapas via GitHub Project för att direkt koppla en branch till ett specifikt issue.

### Namngivning
Namnet på branches består av två delar:
- Förkortat namn baserat på label på issue:t (`fix`, `feat`, `docs` etc. Se nedan för full lista)
- Kortfattat namn baserat på issue-titeln

Branch-namnet blir då t.ex: `feat/user-api-routes` eller `fix/broken-login-form`.

### Branch types

- `feat` (feature): Lägger till ny funktionalitet 
- `fix`: Ändrar, optimerar eller fixar existerande kod
- `chore` Städar upp kod, lägger till kommentarer, refaktorerar kod, flyttar runt filer etc.
- `docs`: Bygger ut eller kompletterar dokumentation
- `test`: Utveckling och implementation av tester

## Commits

- [Commit-struktur som förenklar automatiserad Changelog](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Förslag på commit-struktur](https://cbea.ms/git-commit/)

## Pull requests

- En pull request från en `working branch` till `dev` kräver review av **minst en person**
- En pull request från `dev` till `main` kräver review av **branch maintaner** (alt. **två personer**?)

Branch skall raderas när den merge:as in i `dev`.

## Formatering

Kodformatering genom Prettier körs innan commit. Detta automatiseras genom Husky när man gör en commit, så man behöver inte manuellt göra en formatering. Detta för att se till att git diffs blir lättare att läsa när man jämför kodändringar.
