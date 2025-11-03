# Tester

## End-to-End (Playwright)

| Kommando                                           | Syfte                                 |
| -------------------------------------------------- | ------------------------------------- |
| `npx playwright test`                              | Kör alla E2E‑tester                   |
| `npx playwright test e2e/entries.spec.ts --headed` | Kör ett test med synlig browser       |
| `npx playwright test e2e/entries.spec.ts --debug`  | Kör ett test i debug‑läge (inspektör) |
| `npx playwright show-report`                       | Visa senaste Playwright‑rapport       |

### Debug‑tips

- Använd `await page.pause()` i testen för att pausera och inspektera i Playwright Inspector.
- Kör enstaka tester i headed/debug för snabb felsökning: `npx playwright test e2e/entries.spec.ts --headed --debug`.
- Tester som kräver inloggning använder `playwright.global-setup` och `storageState.json` — se CI‑sekretess innan du kör i Actions.

Håll testen korta och oberoende; använd `test.use({ storageState: undefined })` eller en ny context för oautentiserade flöden.
