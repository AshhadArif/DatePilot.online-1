# DatePilot.online

DatePilot.online is a focused date, calendar, and time utility platform for calculating, understanding, comparing, and working with dates and time.

## Implementation

The application is a Vite React TypeScript site with prerendered pages for its calculators, guides, navigation hubs, and trust pages.

```text
npm install
npm run dev
npm run build
npm run audit:pages
npm run lint
```

Run `npm run build` before `npm run audit:pages`. The audit checks the generated sitemap routes for page content, unique titles and descriptions, canonical URLs, internal links, the AdSense review snippet, and the matching `ads.txt` publisher record. Its word counts are diagnostics, not minimum-length targets.

## Internal documentation

Planning and operational documents live under [`internal/docs/`](internal/docs/) and must not be copied into production output. Start with [Project Decisions](internal/docs/PROJECT-DECISIONS.md), [Product Requirements](internal/docs/PRD.md), the [SEO Plan](internal/docs/SEO-PLAN.md), [Keyword Research](internal/docs/KEYWORD-RESEARCH.md), and the [AdSense Compliance Rulebook](internal/docs/ADSENSE-COMPLIANCE.md).

## Status

The repository includes calculation and content integrity checks. Live hosting behavior, account ownership, and any legal review still require checks outside the repository.
