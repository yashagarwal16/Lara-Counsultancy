# MyAssignmentHelp Website Implementation Plan

Reference: <https://myassignmenthelp.com>  
Project: `C:\files`  
Source audit: [REFERENCE_AUDIT.md](C:\files\REFERENCE_AUDIT.md)

This plan covers the publicly discoverable website surface. Page content and interactions were inspected without submitting forms, creating accounts, logging in, uploading files, or accessing private data.

## Current project assessment

- Framework: Next.js 16 App Router, React 19, TypeScript.
- Active root route: `app/page.tsx`, now rendering `components/MyAssignmentHelpHome.tsx`.
- Existing dashboard/auth/backend work is separate and must remain intact.
- Existing public routes `/about`, `/services`, `/insights`, `/contact`, `/privacy`, `/terms`, `/sign-in`, and `/dashboard/*` belong to the previous L.R. Tech Solutions/workspace product and should not be overwritten until a route migration decision is made.
- Existing useful APIs/models:
  - `POST /api/contact` -> `ContactInquiry` and automation logging.
  - `POST /api/order` -> existing `Order` model.
  - `POST /api/subscribe` -> existing subscriber flow.
  - Auth session/sign-in/sign-out routes and `UserProfile`/workspace store.
  - Dashboard, team, profile, project assignment, messages, notifications, and automation routes.
- No public-site CMS/content model currently exists. Public content should first be represented as typed local content maps; a CMS/content model can be added after the templates stabilize.
- No lint script exists in `package.json`; `npx tsc --noEmit` and `npm run build` are the current validation commands.

## Route inventory and status

Status meanings: **inspected** means the public page was visited during discovery; **linked/inferred** means it was found through public navigation or footer links but not individually visited.

### Tier 0: shared conversion and trust flows

| Reference URL | Local route | Purpose/template | Status | Priority |
|---|---|---|---|---|
| `/` | `/` | Homepage hero, order shell, trust, services, tools, reviews, FAQ, footer | inspected; Phase 1 shell implemented | P0 |
| `/Home/` | `/Home/` | Order/quote entry flow | linked/inferred; page load encountered reference markup variation | P0 |
| `/contact_us.html` | `/contact_us.html` | Contact/order assistance form | inspected | P0 |
| `/reviews/` | `/reviews/` | Review summary, testimonials, feedback CTA, FAQ | inspected | P0 |
| `/experts/` | `/experts/` | Expert directory/filtering and expert CTA | inspected | P0 |
| `/about-us.html` | `/about-us.html` | Company story, values, advantages, achievements, FAQ | inspected | P1 |
| `/Home/login.php` | `/Home/login.php` | Login with email/password, OTP, and Google options | inspected; do not submit | P1 |
| `/Home/signup.php` | `/Home/signup.php` | Account registration | inspected; do not submit | P1 |

### Tier 1: core service templates

| Reference URL | Local route | Template | Status | Priority |
|---|---|---|---|---|
| `/essay-help/` | `/essay-help/` | Service landing: hero/order form, process, features, reviews, subject coverage, FAQ, SEO content | inspected | P0 |
| `/homework/` | `/homework/` | Service landing with homework-specific proof/process/FAQ | inspected | P0 |
| `/dissertation/` | `/dissertation/` | Advanced service landing, dissertation process, expert proof, FAQ | linked; discovery evaluator hit a page-specific DOM exception | P0 |
| `/coursework/` | `/coursework/` | Service landing with features, reviews, coursework subject coverage, FAQ | inspected | P0 |
| `/programming-help/` | `/programming-help/` | Technical service landing | linked/inferred | P1 |
| `/case-study/` | `/case-study/` | Case-study service landing | linked/inferred | P1 |
| `/thesis-help/` | `/thesis-help/` | Thesis service landing | linked/inferred | P1 |
| `/research-writing.html` | `/research-writing.html` | Research-paper service landing | linked/inferred | P1 |
| `/research-proposal-help.html` | `/research-proposal-help.html` | Research proposal landing | linked/inferred | P1 |
| `/essay-editing-service.html` | `/essay-editing-service.html` | Editing service landing | linked/inferred | P1 |
| `/mba-essay-writing-service.html` | `/mba-essay-writing-service.html` | MBA essay landing | linked/inferred | P1 |
| `/term-paper.html` | `/term-paper.html` | Term-paper service landing | linked/inferred | P1 |
| `/take-my-online-class.html` | `/take-my-online-class.html` | Online-class support landing | linked/inferred | P1 |
| `/online-exam/` | `/online-exam/` | Online-exam support landing | linked/inferred | P1 |
| `/powerpoint-presentation-services.html` | `/powerpoint-presentation-services.html` | Presentation service landing | linked/inferred | P2 |

### Tier 1: academic subject and location templates

Representative inspected pages:

- `/finance/` — finance subject template, inspected.
- `/ca/` — country landing template, inspected.

Linked or inferred subject patterns include `/accounting/`, `/nursing/`, `/economics/`, `/mba-help/`, `/computer-science-assignment-help.html`, `/engineering-assignment-help.html`, `/autocad-assignment-help.html`, `/r-studio-assignment-help.html`, `/spss-assignment-help.html`, `/law_assignment_help.html`, `/stata-assignment-help.html`, `/business-assignment-help.html`, `/statistics_assignment_help.html`, `/software-engineering-assignment-help.html`, and programming subpaths such as `/programming-help/java-programming-assignment-help.html` and `/programming-help/c++-assignment-help.html`.

Location patterns discovered in the footer include `/ca/`, `/uk/`, `/ie/`, `/nz/`, `/se/`, `/my/`, `/sg/`, `/hk/`, `/in/`, `/mv/`, `/ae/`, `/qa/`, `/za/`, `/kw/`, `/om/`, `/sa/`, `/gh/`, and `/me/`. These require a location template with locally mapped country copy rather than duplicated generic text.

### Tier 1: tools, resources, and content

| Reference URL | Local route | Template | Status | Priority |
|---|---|---|---|---|
| `/blog/` | `/blog/` | Blog index with categories, featured cards, pagination | inspected | P1 |
| `/blog/[slug]` | `/blog/[slug]` | Article detail; slug pattern inferred from index links | linked/inferred | P1 |
| `/free-samples/` | `/free-samples/` | Samples index/filter page | linked; page-specific DOM evaluator exception | P1 |
| `/faqs.html` | `/faqs.html` | FAQ index | linked/inferred | P1 |
| `/how_it_works.html` | `/how_it_works.html` | Process explainer | linked/inferred | P1 |
| `/offers/` | `/offers/` | Promotions/offers | linked/inferred | P2 |
| `/plagiarism-checker.php` | `/plagiarism-checker.php` | Interactive tool page | linked; page-specific DOM evaluator exception | P1 |
| `/paraphrasing-tool.php` | `/paraphrasing-tool.php` | Interactive tool page | linked/inferred | P1 |
| `/pdf-summarizer.html` | `/pdf-summarizer.html` | Interactive tool page | linked/inferred | P1 |
| `/citation-machine.html` | `/citation-machine.html` | Citation form/tool, inspected | inspected | P1 |
| `/grammar-checker.html` | `/grammar-checker.html` | Interactive tool page | linked/inferred | P1 |
| `/paper-checker.html` | `/paper-checker.html` | Essay checker tool | linked/inferred | P2 |
| `/word-counter.html` | `/word-counter.html` | Word counter tool | linked/inferred | P2 |
| `/factoring-calculator.html` | `/factoring-calculator.html` | Calculator tool | linked/inferred | P2 |
| `/essay-typer.html` | `/essay-typer.html` | Writing tool | linked/inferred | P2 |
| `/free-tools.php` | `/free-tools.php` | Tool directory | linked/inferred | P2 |

### Tier 2: legal and policy pages

Discovered footer links: `/termsofuse.html` (inspected), `/privacy-policy.html`, `/revision-refund-policy.html`, and `/fair-use-policy.php` (linked/inferred). These use a legal-document template with careful disclaimer language and no order functionality.

### Tier 3: legacy/other publicly discoverable patterns

The homepage content links to region-prefixed subject/service paths such as `/uk/computer-science-assignment-help.html`, `/uk/finance-assignment-help.html`, `/ca/psychology-assignment-help.html`, and `/ca/marketing-assignment-help.html`. These should be implemented through the location + subject template after the top-level templates are stable. Pagination and article slugs should be discovered from the live index before generating static content.

## Reusable templates and components

1. `MahSiteHeader`: desktop navigation, hover/focus menus, account control, mobile drawer.
2. `MahSiteFooter`: app banner, link columns, region accordions, contact/social/legal rows.
3. `MahOrderForm`: shared static shell first; later adapter to `POST /api/order` after field mapping and consent copy are approved.
4. `MahPageHero`: title, intro, proof metrics, CTA, optional illustration.
5. `MahProcessSteps`: three-step service workflow.
6. `MahFeatureGrid`: service-specific benefits and reliability cards.
7. `MahReviewPanel`: provider tabs, rating summary, testimonial cards.
8. `MahSubjectGrid`: subject links plus free-feature list.
9. `MahToolCardGrid`: tool cards with a distinct tool-page shell.
10. `MahFaq`: accessible accordion with one or more open panels.
11. `MahArticleTemplate`: headings, lists, tables, related links, disclaimer blocks.
12. `MahAuthShell`: login/signup visual shell, preserving the existing workspace auth separately.

Templates should accept content objects so service pages share structure while retaining page-specific headings, feature groups, proof, related links, and FAQ content.

## Navigation and footer structure

- Header: Services mega menu; Experts; Reviews; About us; Resources (Samples, Blog); Academic Tools; account menu; Order Now.
- Services menu contains writing, problem-solving, and more-services groups from the audit.
- Footer groups: Get to know us, Subjects, Essay, Citation Tools, Best in countries, Contact us, app links, social links, payment/security, DMCA, disclaimer, and policy links.
- All internal links should use `next/link`; external app/social/WhatsApp links should remain explicit external destinations.

## Shared design requirements

- Poppins-based typography; desktop reference measurements: body 16/24, H1 approximately 54/70, H2 approximately 48/58.
- White base surface, dark gray text, orange primary CTA, blue hero accent, pale lavender/yellow section surfaces, rounded cards, soft shadows.
- Wide desktop two-column hero; stacked mobile layout; no horizontal overflow at 1265×713 or 390×844.
- Keyboard-accessible menus, buttons, accordions, radio groups, labels, file inputs, and focus states.
- Recreated generic icons and local CSS shapes are preferred unless branded assets are licensed. Logo, review-provider marks, app-store marks, and third-party badges require rights before redistribution.

## Existing backend and required additions

### Reuse

- `ContactInquiry` and `POST /api/contact` for contact form intake, after adapting the field names or adding an explicit adapter.
- `Order` and `POST /api/order` for order intake, after mapping subject, deadline, page count, service type, phone, and description.
- Existing auth/session routes for the project’s internal workspace; do not silently conflate them with the reference site’s student account system.
- Existing `Subscriber` flow for a future newsletter/app-offer capture.

### Required later

- Public content model or versioned content maps for navigation, service pages, FAQs, reviews, tools, blog posts, subject pages, country pages, and SEO metadata.
- Student account model separate from internal workspace roles if account behavior is implemented.
- Order status, assignment requirements, attachments, payment-provider integration, revision/refund state, and secure upload handling.
- Form validation, consent/audit logging, rate limiting, spam protection, email/notification delivery, and privacy retention rules.
- Tool-specific server actions or APIs only after each tool’s actual behavior and data-handling requirements are documented.

## Asset and lawful reuse boundaries

The reference exposes CDN logo, rating, service-icon, app-store, social, payment, security, and DMCA assets. Their public availability is not permission to redistribute. Use them only when licensed or supplied by the project owner; otherwise recreate layout and generic visual language with local or licensed equivalents. Do not scrape private data, bypass access controls, or bundle hidden/private assets.

## Desktop/mobile validation checklist

- [ ] Header and mobile drawer match the 1265×713 and 390×844 baselines.
- [ ] Hero/form alignment, readable type, and primary CTA match the audit.
- [ ] All route templates have no horizontal overflow at both baselines.
- [ ] Navigation menus work with mouse, keyboard, and touch.
- [ ] Forms have labels, visible focus, required-field handling, and no accidental submission during visual validation.
- [ ] Long tables, article content, tool panels, and footer accordions are usable on mobile.
- [ ] Each inspected route has title/description metadata and a meaningful H1.
- [ ] Internal links resolve locally or are explicitly marked as staged/inferred.
- [ ] `npx tsc --noEmit` and `npm run build` pass after each implementation stage.

## Staged implementation schedule

### Stage A — shared public foundation (current next stage)

- Extract header/footer/order/form primitives from the homepage shell.
- Add a shared public CSS token layer and metadata helpers.
- Refine homepage sections above the fold and add the audited trust/service/tool/footer shells.

### Stage B — highest-value service and trust pages

- Implement `/essay-help/`, `/homework/`, `/dissertation/`, `/coursework/` using distinct content maps.
- Implement `/experts/`, `/reviews/`, `/about-us.html`, `/contact_us.html`.
- Add static `/Home/`, `/Home/login.php`, and `/Home/signup.php` shells without connecting unapproved external account behavior.

### Stage C — resources/tools/legal

- Implement blog index/article template, samples, FAQ, how-it-works, citation machine, tool directory, and top tools.
- Implement policy/legal templates and preserve the reference disclaimer boundaries.

### Stage D — subject/location scale-out

- Add finance/accounting/nursing/business/statistics/computing and country templates with page-specific data.
- Add region-prefixed patterns only after representative pages are verified.

### Stage E — backend integration

- Document and map every form to an existing API or a justified new endpoint.
- Add content management, uploads, account separation, order lifecycle, and notification/payment requirements incrementally.

## Route completion checklist

For every implemented route: reference URL recorded; local route created; page purpose documented; page-specific content mapped; shared header/footer used; title/meta/H1 added; internal links checked; form behavior explicitly marked static or integrated; mobile layout checked; no unauthorized asset copied; TypeScript/build re-run.

