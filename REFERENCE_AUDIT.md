# MyAssignmentHelp Reference Audit

Audit scope: public homepage inspection only. Reference URL: <https://myassignmenthelp.com/>. The page was reachable during the audit. No forms were submitted, no account actions were performed, and no private APIs or data were accessed. REA, installation, and Ghidra setup were not used because this is a browser/reference-audit task.

## Page and navigation inventory

- Page title: `Assignment Help & Writing Service | Do My Assignment Safe & Fast`
- Primary header navigation: Services, Experts (`/experts/`), Reviews (`/reviews/`), About us (`/about-us.html`), Resources, Academic Tools, account/login control, and Order Now (`/Home/`).
- Services menu groups:
  - Writing: Essay Editing, MBA Essay Writing, Essay Help, Research Proposal Writing, Research Paper Writing, Ghost Writer.
  - Problem Solving: Programming Assignment Help, Assessment Help, Pay Someone To Do My Homework, Take My Online Class.
  - More Services: Take My Online Exam, Dissertation, Term Paper, Homework, Case Study, Coursework, Thesis, and PowerPoint Presentation services.
- Resources: Samples (`/free-samples/`) and Blog (`/blog/`).
- Academic Tools: PDF Summarizer, Plagiarism Checker, Essay Typer, Paraphrasing Tool, Grammar Checker, Essay Checker, and Factoring Calculator.
- High-priority homepage destinations: `/Home/` order flow; `/experts/`; `/reviews/`; `/about-us.html`; `/essay-help/`; `/homework/`; `/dissertation/`; `/coursework/`; `/plagiarism-checker.php`; `/paraphrasing-tool.php`; `/pdf-summarizer.html`; `/citation-machine.html`; `/grammar-checker.html`; `/word-counter.html`; `/free-tools.php`; `/faqs.html`; `/how_it_works.html`; `/contact_us.html`.

## Homepage section order

1. Header and hero with the primary order form.
2. Trust/rating strip: “Trusted by 1.5M+ happy customers” with review-provider marks.
3. Assignment-helper introduction: “Meet Assignment Helpers Who Understand Your Academic Requirements”.
4. Three-step workflow: share requirements, make a secure payment, receive completed work.
5. Reliability criteria: plagiarism-free work, on-time delivery, free revisions, 24/7 chat, privacy, and budget-friendly pricing.
6. Service cards: essay, homework, dissertation, and coursework help.
7. Student reviews with provider tabs and review cards, followed by a conversion CTA.
8. University subject coverage and included features such as referencing, revisions, plagiarism checks, formatting, proofreading, and edits.
9. Free online tools: plagiarism checker, paraphraser, PDF summarizer, citation generator, grammar checker, word counter, factoring calculator, and more.
10. Long-form informational/SEO content with headings, lists, tables, and internal links.
11. FAQ accordion and a multi-column footer with app, contact, social, payment, policy, and legal links.

## Hero and visible content

- H1: “Get Reliable Assignment Help for U.S. University Students”.
- Supporting copy explains help with briefs, sources, calculations, arguments, referencing, complex tasks, and organization before submission.
- Trust message: “Trusted by 1.5M+ happy customers”.
- Order form title: “AI-Free Assignment Help from Real Experts to Do My Assignment”.
- Form modes: Writing, Technical, and Online Class.
- Visible fields/controls: email, subject/course code, deadline/date, time, page count, country/phone, description, file attachment, terms/offers checkbox, and “Do My Assignment” CTA.
- Benefit row: Guaranteed Grade or Refund, No AI, and 24/7 Support.

## Design tokens and typography estimates

These values were read from the rendered page where possible; colors not measured directly are marked as visual estimates.

| Token | Observation |
|---|---|
| Font | Poppins, sans-serif |
| Body | 16px, 24px line height, regular weight; rendered text color approximately `rgb(95,95,95)` |
| Desktop H1 | 54px, 70.2px line height, bold |
| Desktop H2 | 48px, 57.6px line height, bold; rendered color approximately `rgb(44,44,44)` |
| Base surface | White |
| Primary CTA | Bright orange, visually approximately `#ff6a00` to `#ff7200` |
| Text | Dark gray for body; near-black for headings |
| Hero accent | Multicolor headline treatment using orange, blue, and dark text |
| Section surfaces | White cards, pale lavender feature sections, and light-gray borders/dividers |
| Shape language | Rounded cards/controls, soft shadows, circular step artwork, fixed floating contact buttons |

The page uses generous vertical spacing, a wide desktop two-column hero, large headline typography, and card-based content sections. Mobile typography is visibly reduced and the hero becomes a single column; exact mobile type sizes should be measured during implementation rather than inferred from the screenshot.

## Asset inventory and reuse boundaries

Observed public asset references include:

- Header logo: `cdnx.myassignmenthelp.com/assets/header/mah-logo-default.svg`
- Mobile logo/icon: `cdnx.myassignmenthelp.com/assets/header/logo-icon.svg`
- Mobile login and menu icons: `login-mob.svg`, `burger.svg`, and `closeMenu.svg`
- Rating marks: `assets/homepage/mah-rating2.svg`, `sidejabbar.svg`, and `reviews.svg`
- Service/benefit icon references including `tick-single.svg`, `Plagi-free.svg`, `ontime.svg`, `24x7-support.svg`, `quality.svg`, and `lowest-price.svg`
- Public app-store, social, payment, security, and DMCA marks in the footer

These URLs are an inventory, not permission to redistribute. Reuse branded logos, review marks, app-store marks, and third-party icons only where the project has the necessary rights. Recreate the layout, generic icons, decorative shapes, cards, and form controls with local code or licensed assets. Do not copy private, hidden, or access-controlled material. No assets were downloaded or added during this audit.

## Interaction inventory

- Desktop mega-menu/dropdowns for Services, Resources, and Academic Tools.
- Mobile header collapses to the logo icon, login icon, and hamburger menu.
- Account/login menu exposes login/signup/order entry points.
- Hero form has radio mode selection, date/time controls, page +/- controls, country/phone selection, file chooser, checkbox, and order CTA.
- Review-provider tabs switch review content.
- FAQ items and footer country groups are collapsible.
- Fixed WhatsApp and sales-chat buttons are visible on desktop and mobile.
- Footer contains app links, social links, phone link, policy links, and contact routes.

No form, chat, WhatsApp, login, signup, or account interaction was submitted.

## Desktop and mobile observations

### Desktop baseline

- Browser viewport: **1265 × 713**; measured document body width: **1251px**.
- Header is a white horizontal bar with full logo, text navigation, and orange Order Now button.
- Hero is a two-column layout: large multicolor headline and explanatory copy on the left; pale-yellow framed white order card on the right.
- Mid-page screenshots were captured for the trust strip, helper introduction, workflow, services/reviews, and footer.
- Floating WhatsApp and chat controls remain fixed at the right edge.

### Mobile baseline

- Browser viewport: **390 × 844**.
- Header shows the compact logo icon, login icon, and hamburger; desktop navigation and the desktop Order Now button are hidden.
- Hero stacks vertically. The headline wraps into four short lines and the order form moves below the initial viewport.
- The same floating contact controls remain visible and overlap the content edge.
- A horizontal scrollbar/overflow was visible at the bottom during inspection; this should be treated as a responsive defect to check during implementation.
- Mobile navigation uses the same destination groups but exposes them through the hamburger menu.

## Existing workspace and reuse plan

The existing Next.js project is at `C:\files` and already contains a usable application shell plus backend/domain work:

- Reuse the Next.js app structure and `app/page.tsx` entry point.
- Preserve and later reuse compatible existing models, APIs, dashboard code, and backend files under `C:\files\models`, `C:\files\app\api`, and related `lib` files.
- `components/PublicHome.tsx` and `components/public-home.css` currently describe an unrelated L.R. Tech Solutions marketing page. Preserve them until implementation begins, but do not treat their content or styling as the MyAssignmentHelp reference.
- `public/company-logo.jpg` is unrelated branding and should not be reused for the recreation unless the project explicitly needs that existing brand elsewhere.

No existing files were overwritten during this audit.

## Prioritized implementation plan

1. **P0 — Homepage shell:** recreate the responsive header, hero copy, trust strip, and a non-submitting order-form shell at the two recorded viewport sizes.
2. **P1 — Conversion sections:** add workflow, reliability cards, service cards, review-section shell, subject/features section, and footer using recreated/local visual assets.
3. **P2 — Supporting public flows:** add FAQ behavior, tools index, and the highest-value linked pages such as reviews, experts, how-it-works, essay help, homework, dissertation, and coursework.
4. **P3 — Customizable backend:** map content, services, testimonials, tool links, navigation, and order/inquiry settings onto the existing backend models/APIs; add admin editing only after the public shell is visually stable.

This phase intentionally stops before implementation so the audit remains a reference baseline.

## Recommended next step

Implement the **homepage first**, beginning with the responsive header + hero + static order-form shell. Reuse the existing Next.js entry point and backend structure, preserve the current models/APIs for later integration, and replace/refactor the unrelated `PublicHome` visual layer only when implementation starts. The smallest task that produces a visible result is a local, non-submitting hero shell that matches the **1265 × 713** desktop and **390 × 844** mobile baselines, with no external asset download required.
