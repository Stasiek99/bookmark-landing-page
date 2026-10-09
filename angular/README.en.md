# Bookmark - Product Landing Page (Angular)

**Responsive product page for the “Bookmark” browser extension - a recruitment task for a Junior Front-end Developer position. A faithful recreation of the supplied design (mobile 375 px / desktop 1440 px) with a pop-up modal, newsletter validation and an animated counter, built with the latest Angular.**

![Angular](https://img.shields.io/badge/Angular-22-dd0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)
![esbuild](https://img.shields.io/badge/Builder-esbuild-ffcf00?logo=esbuild&logoColor=black)
![Sass](https://img.shields.io/badge/Sass-BEM-cc6699?logo=sass&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6e9f18?logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/angular--eslint-22-4b32c3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3-f7b93e?logo=prettier&logoColor=black)

<!-- After deploying, uncomment and fill in: **Live site:** [app-url](https://app-url) -->

🇬🇧 English | [🇵🇱 Polski](README.md)

> The same page built with React (the version using the Webpack, Babel and Sass named in the task): [`react`](../react).

---

## What it is

A product page built from the supplied design files (`mobile-design.jpg`, `desktop-design.jpg` and the active-state views) and the guidelines in `style-guide.md` (colours, Rubik font, 18 px base size). It is split into small, self-contained (standalone) components, styled with Sass using **BEM** naming and covered by unit tests.

In look and behaviour this version is identical to the React one.

---

## Screenshots

### Desktop (1440 px)

![Desktop](images/desktop.png)

### Mobile (375 px) and the mobile menu

<p>
  <img src="images/mobile.png" width="260" alt="Mobile view">
  &nbsp;&nbsp;
  <img src="images/mobile-menu.png" width="260" alt="Mobile menu">
</p>

### Modal (opened by hovering the header)

![Modal](images/modal.png)

### Active states - open FAQ and newsletter error

![Active states](images/states.png)

---

## Page sections

| Section    | Content                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------- |
| Header     | Logo, navigation, Login button; full-screen menu on mobile                                   |
| Hero       | Heading, copy, “Get it on Chrome / Firefox” buttons, illustration with a blue shape          |
| Features   | Tabs (Simple Bookmarking / Speedy Searching / Easy Sharing) with content and an illustration |
| Download   | Three browser cards (Chrome, Firefox, Opera)                                                 |
| FAQ        | Accordion with four questions                                                                |
| Newsletter | Form with validation and the “35,000+ already joined” counter                                |
| Footer     | Logo, links, social icons                                                                    |

---

## Features

### Interface

- **Responsive layout** - mobile-first; breakpoints at 768 px (typography, navigation layout) and 1100 px (two-column hero, feature panel and card row)
- **Mobile menu** - full-screen, locks page scroll, closes on `Esc` or when a link is chosen
- **Tabs** - WAI-ARIA tabs pattern: arrow keys, `Home`, `End`, roving `tabindex`
- **FAQ accordion** - one open answer at a time, smooth CSS-only expansion (`grid-template-rows`)

### Newsletter

- Validation on submit and when leaving the field (only if the user has started typing); once an error is shown, validation runs live
- Error message with `role="alert"`, linked to the input via `aria-describedby`
- Submission confirmation with `role="status"`
- A single field handled with signals - no forms library

### Modal and counter

- **Modal** - native `<dialog>`: focus trap, `Esc` and an inert background for free; also closes on a backdrop click
- **Triggers** - hovering the header, leaving the page through the top, 30 s after entering; shown once
- **Counter** - 20 s, `requestAnimationFrame`, cleaned up when the component is destroyed; screen readers get a fixed “Over 35,000” label

### Graphics

- **Blue shapes** drawn in CSS
- **Inline SVG** with `currentColor` and CSS variables - colours change with states and variants, no duplicated files

### Modern Angular

- **Standalone components**, **signals** (`signal`, `computed`, `linkedSignal`, `input()`, `output()`), the new template syntax (`@if`, `@for`, `@switch`)
- **Zoneless** - no `zone.js`, `ChangeDetectionStrategy.OnPush` on every component
- **Button as an attribute-selector component** (`<a appButton>`, `<button appButton>`) - keeps the native element and its semantics while the component only owns the look
- **`host` metadata** instead of `@HostBinding` / `@HostListener`

### Quality

- **BEM** (`block__element--modifier`) throughout
- **Performance** - self-hosted Rubik (latin subset only, weights 400/500), lazy loading of the browser logos in the download cards, hashed assets; about 188 KB of JavaScript (about 54 KB compressed)
- **Unit tests** - more than 70 tests (Vitest + TestBed)

---

## Accessibility

**What was done**

- **Semantics** - landmarks (`header`, labelled `nav`s, `main`, `footer`), a `h1 → h2 → h3` heading outline without skipped levels, `lang="en"`, a “Skip to main content” link
- **Keyboard** - everything works without a mouse; a visible focus ring (2 px) with at least 3:1 contrast, also on the blue newsletter band, in the navy footer and in the mobile menu (the ring colour is the `--focus-ring` CSS variable)
- **Mobile menu and modal** - the page behind an open overlay is `inert` (neither focus nor a screen reader can leave the menu), `Esc` closes the menu and hands focus back to its button; the modal is a native `<dialog>` with a focus trap
- **Form** - field label, `aria-invalid`, `aria-describedby`, a `role="alert"` message, and after a failed submit focus moves to the field that needs fixing
- **Motion** - `prefers-reduced-motion` switches off transitions and animations, and the counter shows its final value immediately
- **Targets** - at least 24×24 px (WCAG 2.5.8); links that open a new tab say so in their name

**How I checked**

- **axe-core 4.14** (WCAG 2.0 / 2.1 / 2.2 rules at levels A and AA plus best practices) on the page’s real states: default view, tab + open FAQ + newsletter error, modal, mobile, and the open mobile menu
- **Keyboard script** - Tab order, focus visibility and contrast, focus containment in the menu and modal, target sizes, reduced motion, document structure
- **Unit tests** for the a11y behaviours (inert, focus return, focus on the invalid field, reduced motion, skip link, link labels)

**Known limitations (deliberate)**

- **Colour contrast from the design.** The grey text `#9194a1` on white is 3.02:1, and white text on the red buttons (`Login`, `Contact Us`) is 3.20:1 - below the 4.5:1 AA requires. The colours were kept faithful to the design, and this is the only rule axe reports. If the design may change, a grey of `hsl(229, 8%, 48%)` (4.63:1) and a button red of `hsl(0, 94%, 48%)` (4.53:1) are enough.
- **Placeholder links.** `#pricing`, `#login`, `#chrome`, `#firefox`, `#opera` and `#more-info` have no destination pages because the task does not provide any.
- **The counter** animates for 20 s without a pause control (as the task requires); for users who prefer reduced motion the final value appears immediately (WCAG 2.2.2).

---

## Design decisions

In a few places I deliberately departed from, or clarified, the literal task text:

- **Counter direction.** The task says the “35,000+” figure should _fall_ to 0 within 20 s. A counter shrinking to zero suggests the opposite of what an “already joined” section wants to show, so the number **rises from 0 to 35,000+** and stops there. Reversing it takes two lines (the initial value and the formula) in `src/app/utils/count-up.ts`.
- **E-mail validation.** The task requires at least an `@`. The design, however, also shows the error for `example@email/com`, so the pattern is `x@y.z` (an `@` plus a domain containing a dot) - a superset of the rule in the task.
- **“Hovering the top part of the page”.** Interpreted as the cursor entering the header. On touch screens (`(hover: none)`) this trigger is skipped, because tapping the hamburger would emulate `mouseenter` and open the modal instead of the menu; the 30 s timer works everywhere.
- **Modal once per visit.** After it is closed it never comes back, whichever trigger fires.
- **1100 px breakpoint.** The designs only exist for 375 px and 1440 px; 1100 px is the width from which the desktop layout fits without clipping.
- **No forms library.** A single field does not justify Reactive Forms; Signal Forms had no confirmed stable status in the Angular 22 documentation, so the field state lives in plain signals.

---

## Tech stack

| Layer        | Technology                                                     |
| ------------ | -------------------------------------------------------------- |
| Framework    | Angular 22 (standalone, signals, zoneless, `OnPush`)           |
| Language     | TypeScript 6 (strict)                                          |
| Builder      | `@angular/build:application` (esbuild + Vite dev server)       |
| Styles       | Sass (SCSS), BEM, component styles (emulated encapsulation)    |
| Font         | Rubik (`@fontsource/rubik`)                                    |
| Tests        | Vitest 5 via `ng test`, `TestBed`, jsdom                       |
| Code quality | angular-eslint 22 (ESLint 10, `typescript-eslint`), Prettier 3 |

---

## Project structure

```
.
├─ public/                    # favicon, illustrations and logos supplied with the task
├─ src/
│  ├─ app/
│  │  ├─ ui/                  # button, logo, icon, blue-shape, modal, section-heading, social-links
│  │  ├─ layout/              # header (mobile menu), footer
│  │  ├─ sections/            # hero, features (+ feature-tabs), download (+ browser-card), faq (+ faq-item), newsletter
│  │  ├─ utils/               # count-up (signal-based counter)
│  │  ├─ data/content.ts      # copy and data (typed)
│  │  └─ app.ts · app.html    # root component, modal triggers
│  ├─ assets/                 # dotted separator background
│  ├─ styles/                 # Sass variables and mixins
│  ├─ testing/                # test helpers (matchMedia, DOM)
│  └─ test-setup.ts           # test setup (<dialog> polyfill)
├─ images/                    # README screenshots
├─ angular.json · eslint.config.js · tsconfig*.json
└─ package.json
```

Tests (`*.spec.ts`) live next to the code they cover.

---

## Getting started

Requires Node.js 22.12 or newer.

```bash
npm install
npm start          # dev server: http://localhost:4200
npm run build      # production build -> dist/bookmark-landing/browser
npm test           # unit tests in watch mode; npm run test:ci for a single run
npm run lint       # angular-eslint (lint:fix to autofix)
npm run format     # Prettier (format:check to only verify)
npm run check      # lint + format:check + tests + production build
```

---

## Deployment

The app is static (no routing), so it runs on any static host. Image paths are relative to `<base href>`, so publishing under a sub-path only needs `--base-href`.

| Setting                              | Value                                        |
| ------------------------------------ | -------------------------------------------- |
| Project directory (in a monorepo)    | `angular`                                    |
| Build command                        | `npm run build`                              |
| Publish directory                    | `dist/bookmark-landing/browser`              |
| Node.js version                      | `24` (`.nvmrc`, `netlify.toml`)              |
| Under a sub-path (e.g. GitHub Pages) | `npx ng build --base-href /repository-name/` |

The build settings are also stored in `netlify.toml`, and the Node.js version in `.nvmrc`.
