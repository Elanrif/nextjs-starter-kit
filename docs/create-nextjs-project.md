# Installation du projet

Étapes à suivre dans l'ordre pour initialiser le projet from scratch.

---

## 1. Créer le projet Next.js

```bash
npx create-next-app@latest my-app
```

> Inclut déjà : `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `eslint`, `eslint-config-next`, `@types/*`, `globals`.

---

## 2. Initialiser shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add card
```

> Inclut déjà automatiquement : `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `radix-ui`, `tw-animate-css`.

---

## 3. Installer les dépendances externes

### Formulaires & Validation

```bash
npm install react-hook-form @hookform/resolvers zod
```

| Package               | Usage                                  |
| --------------------- | -------------------------------------- |
| `react-hook-form`     | Gestion performante des formulaires    |
| `@hookform/resolvers` | Connecteur zod ↔ react-hook-form       |
| `zod`                 | Validation de schémas TypeScript-first |

---

### Fetching & HTTP

```bash
npm install @tanstack/react-query axios
```

| Package                 | Usage                                           |
| ----------------------- | ----------------------------------------------- |
| `@tanstack/react-query` | Cache, fetching et synchronisation état serveur |
| `axios`                 | HTTP client avec intercepteurs                  |

---

### Notifications

```bash
npm install react-toastify
```

| Package          | Usage                                               |
| ---------------- | --------------------------------------------------- |
| `react-toastify` | Notifications toast (success, error, info, warning) |

---

### Images — Cloudinary

```bash
npm install cloudinary next-cloudinary
```

| Package           | Usage                                             |
| ----------------- | ------------------------------------------------- |
| `cloudinary`      | SDK Cloudinary — upload, transformation, stockage |
| `next-cloudinary` | Composant `<CldImage />` optimisé pour Next.js    |

---

### Email

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

| Package             | Usage                             |
| ------------------- | --------------------------------- |
| `nodemailer`        | Envoi d'emails via SMTP ou OAuth2 |
| `@types/nodemailer` | Types TypeScript pour nodemailer  |

---

### Logging

```bash
npm install pino
npm install -D pino-pretty
```

| Package       | Usage                                                   |
| ------------- | ------------------------------------------------------- |
| `pino`        | Logger haute performance au format JSON                 |
| `pino-pretty` | Formate la sortie Pino en mode lisible (dev uniquement) |

---

### Utilitaires serveur

```bash
npm install server-only rimraf
```

| Package       | Usage                                                                     |
| ------------- | ------------------------------------------------------------------------- |
| `server-only` | Empêche l'import accidentel de modules serveur côté client                |
| `rimraf`      | Suppression récursive de fichiers/dossiers (utilisé dans les scripts npm) |

---

### Dates

```bash
npm install moment
```

| Package  | Usage                                       |
| -------- | ------------------------------------------- |
| `moment` | Parsing, formatage et manipulation de dates |

---

### React Compiler _(expérimental)_

```bash
npm install babel-plugin-react-compiler
```

| Package                       | Usage                                        |
| ----------------------------- | -------------------------------------------- |
| `babel-plugin-react-compiler` | Mémoïsation automatique des composants React |

---

### Prettier

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier prettier-plugin-classnames prettier-plugin-merge
```

| Package                      | Usage                                                |
| ---------------------------- | ---------------------------------------------------- |
| `prettier`                   | Formateur de code automatique                        |
| `eslint-config-prettier`     | Désactive les règles ESLint en conflit avec Prettier |
| `eslint-plugin-prettier`     | Exécute Prettier comme règle ESLint                  |
| `prettier-plugin-classnames` | Formate et trie les `className` Tailwind             |
| `prettier-plugin-merge`      | Fusionne les plugins Prettier entre eux              |

---

### ESLint — Plugins supplémentaires

```bash
npm install -D @eslint/css eslint-plugin-import eslint-plugin-unicorn eslint-plugin-unused-imports @tanstack/eslint-plugin-query
```

| Package                         | Usage                                         |
| ------------------------------- | --------------------------------------------- |
| `@eslint/css`                   | Linting des fichiers CSS                      |
| `eslint-plugin-import`          | Règles sur l'ordre et la validité des imports |
| `eslint-plugin-unicorn`         | Règles ESLint best practices supplémentaires  |
| `eslint-plugin-unused-imports`  | Détecte et supprime les imports inutilisés    |
| `@tanstack/eslint-plugin-query` | Règles ESLint spécifiques à React Query       |

---

### Git Hooks & Commits conventionnels

```bash
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

| Package                           | Usage                                            |
| --------------------------------- | ------------------------------------------------ |
| `husky`                           | Gestion des Git hooks (pre-commit, commit-msg)   |
| `lint-staged`                     | Lance le lint uniquement sur les fichiers stagés |
| `@commitlint/cli`                 | Valide les messages de commit                    |
| `@commitlint/config-conventional` | Config basée sur Conventional Commits            |

---

### Utilitaires CLI & Build

```bash
npm install -D shx tailwind-csstree
```

| Package            | Usage                                              |
| ------------------ | -------------------------------------------------- |
| `shx`              | Commandes Unix cross-platform dans les scripts npm |
| `tailwind-csstree` | Analyse et optimise l'arbre CSS Tailwind           |

---

## Récapitulatif — Commandes complètes

```bash
# Production
npm install \
  react-hook-form @hookform/resolvers zod \
  @tanstack/react-query axios \
  react-toastify \
  cloudinary next-cloudinary \
  nodemailer \
  pino \
  server-only rimraf \
  moment \
  babel-plugin-react-compiler

# Dev
npm install -D \
  @types/nodemailer \
  pino-pretty \
  prettier eslint-config-prettier eslint-plugin-prettier prettier-plugin-classnames prettier-plugin-merge \
  @eslint/css eslint-plugin-import eslint-plugin-unicorn eslint-plugin-unused-imports @tanstack/eslint-plugin-query \
  husky lint-staged @commitlint/cli @commitlint/config-conventional \
  shx tailwind-csstree
```
