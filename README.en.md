# Bookmark - Product Landing Page

**A recruitment task for a Junior Front-end Developer position: a responsive product page for the “Bookmark” browser extension, built twice - with React and with Angular.**

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Angular](https://img.shields.io/badge/Angular-22-dd0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-BEM-cc6699?logo=sass&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6e9f18?logo=vitest&logoColor=white)

**Live sites:** [React](https://bookmark-landing-react-stan.netlify.app) | [Angular](https://bookmark-landing-angular-stan.netlify.app)

🇬🇧 English | [🇵🇱 Polski](README.md)

---

## Two versions

Both versions look and behave the same: the same design, modal, newsletter validation, counter, accessibility and tests. Only the stack differs.

| Version          | Folder               | Stack                                                     | Documentation                  |
| ---------------- | -------------------- | --------------------------------------------------------- | ------------------------------ |
| **React** (main) | [`react`](react)     | React 19, TypeScript, Webpack 5, Babel, Sass              | [README](react/README.en.md)   |
| Angular          | [`angular`](angular) | Angular 22 (standalone, signals, zoneless), esbuild, Sass | [README](angular/README.en.md) |

The React version uses the tools named in the task (Webpack, Babel, Sass, React). The Angular version is a bonus.

![Desktop](react/images/desktop.png)

---

## Getting started

Each version is a separate project with its own `package.json`. Requires Node.js 22.12 or newer (the repository has an `.nvmrc` pinned to 24).

```bash
cd react           # or: cd angular
npm install
npm start          # React: http://localhost:3000, Angular: http://localhost:4200
npm run check      # types, lint, format, tests (Angular also runs the production build)
```

---

## Deployment (Netlify)

| Setting           | React                         | Angular                         |
| ----------------- | ----------------------------- | ------------------------------- |
| Base directory    | `react`                       | `angular`                       |
| Build command     | `npm run build`               | `npm run build`                 |
| Publish directory | `dist`                        | `dist/bookmark-landing/browser` |
| Node.js version   | 24 (`netlify.toml`, `.nvmrc`) | 24 (`netlify.toml`, `.nvmrc`)   |

---

## Repository structure

```
.
├─ react/                  # React version (Webpack, Babel, Sass)
├─ angular/                # Angular version (esbuild, Sass)
├─ README.md · README.en.md
└─ .gitignore · .gitattributes
```
