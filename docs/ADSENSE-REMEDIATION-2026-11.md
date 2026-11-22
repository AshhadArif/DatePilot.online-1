# DatePilot AdSense Low-Value Content Remediation

**Review date:** 22 November 2026  
**Scope:** repository audit following the AdSense “Low-value content” notice, checked against the supplied Google video subtitles and the four policy/help links in the notice.

## Finding

This repository already contains substantial remediation work: working date/time tools with explanatory content, 17 guides, topic hubs and navigation, site/editorial/methodology/contact policies, a visible correction channel, server-rendered route shells, and AdSense ownership code. The right response is not to pad pages to an invented word count. Google publishes no minimum word count or minimum page count for this review. It asks that pages have enough distinct, useful information to explain the site and give people a reason to visit, that content not be repetitive or scraped, and that navigation be accurate and easy to use.

This combines repository review with limited live spot checks. The homepage, a deep guide, robots.txt, and sitemap each returned HTTP 200 in one pass; later requests were intermittent, so a complete 58-URL live crawl could not be completed. This cannot confirm what Googlebot sees from its own network, whether Search Console ownership is verified, whether the account's `ca-pub-8166232264627968` is the correct account, whether the email address is monitored, or whether users return to the site. AdSense approval cannot be guaranteed by repository changes.

## Full repository and production-route review

The production build generated **58 prerendered route pages** and 58 sitemap entries. The sitemap routes cover 22 calculators/converters, 17 guides, the homepage, 5 topic/index pages, FAQ, and 12 trust, author, methodology, changelog, advertising, and policy pages. All rendered pages contain main content and one main heading. Main-content text on calculator and guide pages ranges from **1,371 to 2,705 words** in the generated HTML; this includes the tool interface, methodology, FAQs, and navigation within `<main>`. These counts are editorial diagnostics, not word-count targets, and the audit enforces no minimum.

The page-level pass checked route metadata, generated HTML, JSON-LD syntax, the sitemap, robots directives, AdSense snippet placement, internal content links, related-tool and guide references, and the site's existing methodology and correction pages. It found unique titles and descriptions on all routes and no empty pages, invalid canonicals, or broken internal route links. The 25 repository tests pass, including route-to-sitemap synchronization, internal-link integrity, metadata coverage, content/methodology presence, robots behavior, and privacy/ad disclosures. `npm run lint` is clean. The production build succeeds with a **large-client-bundle warning**: 850 kB minified JavaScript (250 kB gzip). This is a user-experience/performance improvement opportunity, not evidence that the AdSense code or route rendering is broken.

Editorial changes in this pass removed two redundant age-calculation sections while retaining the hand-calculation method, leap-day edge cases, exact-versus-approximate distinction, worked cases, and related links. A repeated source-introduction sentence was removed from guide pages because their references remain visible under a specific “Sources and further reading” heading. Repeated tool-methodology copy was removed from calculator pages; the central methodology page already explains reproducible examples. Duplicate AdSense status callouts were removed from policy pages whose body already describes the current advertising status. The remaining repeated paragraphs are dynamic date answers or context-specific source lists, not repeated article bodies. Structured data no longer reports the site launch date as the publication date or founding date for pages and the publisher; every page now uses its tracked review date as `dateModified`.

### Route families reviewed

| Family | Coverage | Review focus |
|---|---:|---|
| Date calculators | 11 | Unique task, inclusive/exclusive conventions, examples, limits, holiday assumptions |
| Calendar tools | 5 | Gregorian rules, ISO week-year, quarter and ordinal-date conventions |
| Time tools | 5 | Local clock and zone assumptions, overnight behavior, live versus fixed calculations |
| Date converter | 1 | Ambiguous numeric order, ISO/RFC format scope |
| Guides | 17 | Separate subject matter, linked references, worked examples, boundaries and exceptions |
| Home, hubs, and FAQ | 7 | Navigation, distinct grouping, answers and route links |
| Trust and operational pages | 12 | Publisher identity, editorial process, contact/corrections, privacy, advertising status |

The route family counts total 58. Policies and support pages are not counted as editorial articles. Their inclusion in the sitemap is intentional for discovery and transparency, but they do not replace the tools and guides as the site's main value.

## Follow-up after public-site comparison

The 58-route figures above describe the initial review before the comparison follow-up. The two standalone Add Days and Subtract Days routes used the same calculator interface and substantially overlapping task scope as the Date Calculator. They are now consolidated into that one tool, which accepts positive or negative amounts and days, weeks, months, or years. The old URLs receive permanent redirects in both Apache and Vercel configuration, related links point to the consolidated tool, and the hand-maintained `public/sitemap.xml` was removed so the build-generated sitemap remains the source of truth. The route inventory now contains 56 URLs. The Date Calculator form also states directly that negative amounts move backward.

The public AdSense status wording now says the latest review identified a low-value-content issue and improvements are being made before another review is requested. It no longer says the site is awaiting review. The footer's review date is read from the same route-review record used by page metadata. These follow-up edits have not been included in a new production build in this turn, so the previously reported build and audit results remain a baseline, not verification of this follow-up.

## Audit against the Google video

| Google review point | Repository evidence | Remaining verification |
|---|---|---|
| Correct AdSense code on the submitted site | `index.html` places the async AdSense script in `<head>` with publisher ID `ca-pub-8166232264627968`; `public/ads.txt` has the matching seller entry. | Compare the publisher ID and submitted domain to the actual AdSense account. Confirm the deployed homepage serves this exact code. |
| Site is available and crawler-accessible | `public/robots.txt` allows crawling and references the sitemap. Production route shells and a real 404 are generated by the build. | Check homepage and representative deep URLs from multiple networks; ensure no login, WAF, geo block, or host error affects Google. Inspect Search Console URL Inspection and robots testing. |
| Original, substantial, non-repetitive content sitewide | Tool pages combine working interfaces with method/assumption explanations; topic guides have separate slugs; trust pages identify the operator/editorial process and provide correction routes. | Review every rendered route after deployment. Remove, consolidate, or noindex any page whose actual user value is only a near-duplicate search landing page. Keep examples and explanations accurate to the tool behavior. |
| Usable navigation | Main navigation, category hubs, guide index, related links, breadcrumbs, footer and 404 recovery links are implemented in the application. | Verify keyboard/mobile navigation and all links in the deployed build. |
| Review every page, not only signup URL | Route inventory in `src/content/lastmod.ts` includes the tool, guide, index, FAQ, and trust routes and drives the generated sitemap. | Compare deployed sitemap to the complete route inventory; inspect sampled URLs and Search Console coverage. |
| Keep site listed; place code on popular page | The code is on the global HTML shell, including the homepage. | Do not remove the site from the AdSense Sites list during review. “Popular page” is account/traffic-dependent and cannot be verified here. |

## Content, SEO, and GEO operating standard

* Give each indexable page one real user task or question. Make the tool work first; state inputs, output, calculation convention, edge cases, and limitations in plain language.
* Use worked examples that can be checked against the implementation. Do not add generic filler, repeated FAQs, keyword blocks, or text solely to hit a word target.
* Consolidate overlapping routes when their purpose and answer are substantially the same. Keep pages only when they serve a meaningfully distinct task.
* Keep titles, descriptions, headings, canonical URLs, visible copy, and structured data aligned. Structured data must describe visible content and must not imply credentials, reviews, or expertise that are not real.
* Keep useful sources and update dates on claims that depend on external standards or changing rules. Explain the method and source selection so people and answer systems can verify claims. “GEO” does not justify special hidden text or search-engine-only copy; prioritize clear, attributable answers for users.
* Maintain the visible author/operator, editorial standards, methodology, contact and correction paths. Keep those details truthful and monitor the advertised mailbox.
* Avoid doorway pages, mass-produced near-duplicates, scraped or lightly rewritten content, keyword stuffing, and promises of functionality the tool does not provide.
* Word count is an editorial diagnostic, not a policy quota. A short reference page can be complete; a long page can still be low-value.

## Pre-review actions for the publisher

1. In AdSense, confirm `datepilot.online` is the exact submitted site and the publisher ID matches `ca-pub-8166232264627968`; leave it listed while reviewed.
2. On the deployed site, open the homepage and several deep URLs in a clean browser and confirm they load without authentication or region restrictions. Check the page source for the unchanged AdSense snippet.
3. Check `https://datepilot.online/robots.txt` and `https://datepilot.online/sitemap.xml`; submit/inspect the sitemap in Search Console and use URL Inspection for home, a calculator, a guide, and trust pages.
4. Review all sitemap URLs for useful unique purpose, accurate calculations, correct internal links, and visible content. Consolidate or remove any exceptions found; do not rely on the homepage audit alone.
5. Confirm contact and correction channels work and that policy pages accurately describe actual data collection, advertising, and consent behavior.
6. After those checks, request review in AdSense. Describe the specific content changes actually made. Do not claim traffic, user interest, or live checks without evidence.

## Google references

* [AdSense content and user experience](https://support.google.com/adsense/answer/10015918)
* [AdSense program policies](https://support.google.com/adsense/answer/9335564?hl=en_GB)
* [Google Search spam policies](https://support.google.com/webmasters/answer/9044175#thin-content)
* [Publisher policy: spam policies for Google web search](https://support.google.com/publisherpolicies/answer/11035931)
* Google AdSense video subtitles supplied by the site owner (local transcript): correct ad code, site reachability/crawler access, sitewide original content, no replicated content, usable navigation, and retain the site in the Sites list during review.
