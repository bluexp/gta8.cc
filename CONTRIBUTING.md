# Contributing to GTA8.cc

Contributions from the GTA community are welcome—whether you're adding verified Leonida coordinates, improving English/Chinese translations, expanding the vehicle/weapon wiki, or enhancing map UX.

## Ways to Contribute

1. **Submit Map Pins Without Code**: Visit [https://gta8.cc/gta6/map](https://gta8.cc/gta6/map), right-click any coordinate, and click **Submit Pin** (or **Fix / Screenshot** on an existing marker).
2. **Code & Data PRs**:
   - Map markers seed data: `src/data/markers.ts`
   - Vehicles / Weapons / Cheats / Checklists / Guides: `src/data/*.ts`
   - English prose dictionary: `src/data/en-copy.ts`

## Local PR Checklist

Before opening a pull request, please verify:

```bash
npm run search:index
npm run typecheck
npm run build
```

- Keep all user-facing UI strings bilingual via `useLocale()` (`t(en, zh)`), with **English as the default**.
- Never commit `.dev.vars`, `.env.local`, or real secret tokens.
- Keep commit messages clear and scoped (e.g., `feat(map): add cluster spiderfy`, `docs: update API guide`).
