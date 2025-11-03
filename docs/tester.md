# Tester

## e2e med Playwright

Kör alla tester i `/__tests__/` genom Playwright:

```zsh
npx playwright test
```

Kör ett specifikt test (headed):

```zsh
npx playwright test __tests__/entries.spec.ts --headed
```

Kör ett specifict test (debug):

```zsh
npx playwright test __tests__/entries.spec.ts --debug
```

Visa senaste rapporten:

```zsh
npx playwright show-report
```
