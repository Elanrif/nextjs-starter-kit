# CLAUDE.md — Nextjs Starter Kit

Ce fichier est lu automatiquement par Claude à chaque conversation. Il documente l'architecture complète du projet pour permettre une adaptation rapide à n'importe quel domaine métier.

---

## Stack technique

| Outil                   | Usage                                                |
| ----------------------- | ---------------------------------------------------- |
| Next.js 15 (App Router) | Framework principal                                  |
| TypeScript (strict)     | Typage                                               |
| Tailwind CSS v4         | Styling (`bg-linear-to-br`, pas `bg-gradient-to-br`) |
| shadcn/ui               | Composants UI                                        |
| react-hook-form + zod   | Formulaires et validation                            |
| react-toastify          | Notifications toast                                  |
| lucide-react            | Icônes                                               |
| NextAuth v5             | Authentification (stratégie JWT, Credentials)        |
| axios                   | HTTP client                                          |

---

## Dépendances externes complètes

### Dépendances Main (Production)

| Package                    | Version  | Usage                                           |
| -------------------------- | -------- | ----------------------------------------------- |
| `@hookform/resolvers`      | ^5.2.2   | Validation avec react-hook-form + zod           |
| `@tanstack/react-query`    | ^5.90.21 | Gestion du cache et fetching côté client        |
| `@types/nodemailer`        | ^7.0.11  | Types TypeScript pour nodemailer                |
| `axios`                    | ^1.13.5  | HTTP client avec intercepteurs                  |
| `class-variance-authority` | ^0.7.1   | Gestion variantes CSS pour composants           |
| `cloudinary`               | ^2.9.0   | CDN images (upload, manipulation, stockage)     |
| `clsx`                     | ^2.1.1   | Utilitaire jointure classes CSS                 |
| `lucide-react`             | ^0.575.0 | 500+ icônes SVG réactives                       |
| `next-cloudinary`          | ^6.17.5  | Composant `<CldImage>` optimisé Cloudinary      |
| `nodemailer`               | ^8.0.2   | Envoi emails (SMTP, OAuth2)                     |
| `pino`                     | ^10.3.1  | Logger haute performance JSON                   |
| `radix-ui`                 | ^1.4.3   | Primitives UI accessibles (Dialog, Alert, etc.) |
| `react-toastify`           | ^11.0.5  | Notifications toast (success, error, info)      |
| `rimraf`                   | ^6.1.3   | Suppression récursive fichiers/dossiers         |
| `server-only`              | ^0.0.1   | Prévention accès Server Components du client    |
| `tailwind-merge`           | ^3.5.0   | Fusion résolute classes Tailwind                |

### Dépendances Dev

| Package                           | Version | Usage                                     |
| --------------------------------- | ------- | ----------------------------------------- |
| `@commitlint/cli`                 | ^20.4.2 | Validation messages commit conventionnels |
| `@commitlint/config-conventional` | ^20.4.2 | Config Commitlint standard                |
| `@eslint/css`                     | ^0.7.0  | Linting CSS avec ESLint                   |
| `@eslint/eslintrc`                | ^3.3.3  | Config ESLint                             |
| `@eslint/js`                      | ^9.39.3 | Règles ESLint JavaScript                  |
| `@tailwindcss/postcss`            | ^4      | PostCSS plugin Tailwind v4                |
| `@tanstack/eslint-plugin-query`   | ^5.91.4 | Règles ESLint pour React Query            |
| `@types/js-cookie`                | ^3.0.6  | Types TypeScript js-cookie                |
| `eslint-config-prettier`          | ^10.1.8 | Config ESLint + Prettier compatible       |
| `eslint-plugin-import`            | ^2.32.0 | Règles imports ES6+                       |
| `eslint-plugin-prettier`          | ^5.5.5  | ESLint intégré Prettier                   |
| `eslint-plugin-unicorn`           | ^63.0.0 | Règles ESLint supplémentaires             |
| `eslint-plugin-unused-imports`    | ^4.4.1  | Détect/supprime imports inutiles          |
| `globals`                         | ^17.3.0 | Liste globals navigateur/Node.js          |
| `husky`                           | ^9.1.7  | Git hooks (pre-commit, pre-push)          |
| `lint-staged`                     | ^16.2.7 | Lint fichiers stagés uniquement           |
| `pino-pretty`                     | ^13.1.3 | Formatter output Pino                     |
| `prettier-plugin-classnames`      | ^0.9.0  | Plugin Prettier pour classNames           |
| `prettier-plugin-merge`           | ^0.10.0 | Plugin fusion propriétés CSS              |
| `shadcn`                          | ^3.8.5  | CLI shadcn/ui (add components)            |
| `shx`                             | ^0.4.0  | Unix commands cross-platform              |
| `tailwind-csstree`                | ^0.1.4  | Analyse/optimise CSS Tailwind             |
| `tw-animate-css`                  | ^1.4.0  | Animations Tailwind CSS                   |

---

## Architecture des routes (App Router)

```
src/app/
├── (auth)/                         # Groupe auth (sign-in, sign-up, forgot-password, reset-password)
├── (account)/account/              # Espace utilisateur connecté
│   ├── layout.tsx                  # Layout avec UserSidebar (sidebar blanche)
│   ├── page.tsx                    # Accueil compte
│   ├── profile/page.tsx            # Voir profil
│   ├── profile/edit/page.tsx       # Modifier profil
│   └── settings/change-password/  # Changer mot de passe
├── (dashboard)/dashboard/          # Backoffice admin
│   ├── layout.tsx                  # Layout avec AppSidebar (sidebar noire)
│   ├── page.tsx                    # Accueil dashboard
│   ├── users/                      # CRUD utilisateurs
│   ├── posts/                      # CRUD posts
│   └── comments/                   # CRUD commentaires
└── api/                            # API Routes Next.js
    ├── auth/                       # login, register, session
    ├── users/[id]/
    ├── posts/[id]/
    └── comments/[id]/
```

---

## Architecture lib/ — Pattern par entité

Chaque entité métier suit exactement ce pattern :

```
src/lib/{entity}/
├── models/
│   └── {entity}.model.ts           # Types TypeScript + schéma Zod
└── services/
    ├── {entity}.service.ts         # Service serveur (appels API backend)
    └── {entity}.client.service.ts  # Service client (fetch depuis le browser)
```

### Exemple : entité `post`

**`post.model.ts`**

```ts
export type Post = { id: number; title: string; content: string; isActive: boolean; createdAt: string; author?: User }
export type PostFormData = { title: string; content: string; ... }
export const PostSchema = z.object({ title: z.string().min(1), ... })
```

**`post.service.ts`** (serveur)

```ts
export async function getPosts(): Promise<ApiResponse<Post[]>>;
export async function getPostById(id: number): Promise<ApiResponse<Post>>;
export async function createPost(data): Promise<ApiResponse<Post>>;
export async function updatePost(id, data): Promise<ApiResponse<Post>>;
export async function deletePost(id): Promise<ApiResponse<void>>;
```

**`post.client.service.ts`** (client — appelle les API routes Next.js)

```ts
export async function createPost(data): Promise<{ ok: true } | { ok: false; error }>;
export async function updatePost(id, data);
export async function deletePost(id);
```

---

## Architecture composants — Pattern par entité

```
src/components/features/dashboard/{entity}/
├── {entity}-list.tsx               # Tableau avec DataTable + ConfirmModal
├── {entity}-detail.tsx             # Page détail (hero + grille infos)
├── {entity}-create-form.tsx        # Formulaire création
└── {entity}-edit-form.tsx          # Formulaire édition (pré-rempli)
```

### Pages (App Router) — 1 page = 1 composant

```
src/app/(website)/dashboard/{entity}/
├── page.tsx                        # → <EntityList />  (React Query, pas de SSR)
├── [id]/page.tsx                   # → <EntityDetail entity={data} />  (SSR fetch)
├── create/page.tsx                 # → <EntityCreateForm />  (formulaire vide)
└── edit/[id]/page.tsx              # → <EntityEditForm loadedEntity={data} />  (SSR fetch)
```

---

## Conventions de nommage

| Élément             | Convention          | Exemple                      |
| ------------------- | ------------------- | ---------------------------- |
| Fichiers composants | kebab-case          | `product-list.tsx`           |
| Composants React    | PascalCase          | `ProductList`                |
| Fichiers services   | kebab-case          | `product.service.ts`         |
| Routes API          | `route.ts`          | `app/api/products/route.ts`  |
| Types/Modèles       | PascalCase          | `Product`, `ProductFormData` |
| Schémas Zod         | PascalCase + Schema | `ProductSchema`              |

---

## Design System — Couleurs par entité

| Entité            | Couleur principale | Usage                                  |
| ----------------- | ------------------ | -------------------------------------- |
| **Users**         | `emerald`          | Hero `via-emerald-950`, badge, boutons |
| **Posts**         | `blue`             | Hero `via-blue-950`, badge, boutons    |
| **Comments**      | `amber`            | Hero `via-amber-950`, badge, boutons   |
| **Auth/Account**  | `indigo`           | Layout account, formulaires auth       |
| **Password**      | `orange/red`       | Change password                        |
| **Danger/Delete** | `red/rose`         | ConfirmModal                           |

### Pattern hero sombre (pages detail + formulaires)

```tsx
<div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-{color}-950 to-slate-900 p-7 shadow-xl">
  <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-{color}-500/20 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-{color2}-500/15 blur-3xl" />
  {/* Icon + titre */}
</div>
```

### Pattern formulaire

```tsx
<div className="max-w-3xl lg:max-w-5xl mx-auto space-y-6">
  {/* Hero sombre */}
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7">
    <form className="space-y-5">
      {/* Grille 2 colonnes pour les champs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="..." icon={<Icon />} error={errors.x?.message}>
          <input className={ic} {...register("x")} />
        </Field>
      </div>
    </form>
  </div>
</div>
```

---

## Composants partagés dashboard

| Composant        | Fichier                       | Usage                                      |
| ---------------- | ----------------------------- | ------------------------------------------ |
| `DataTable`      | `dashboard/data-table.tsx`    | Tableau générique avec skeleton loading    |
| `ConfirmModal`   | `dashboard/confirm-modal.tsx` | Modal suppression avec hero rouge + alerte |
| `LoadingPage`    | `features/loading.tsx`        | Overlay de chargement plein écran          |
| `ValidationItem` | `ui/validation-item.tsx`      | Checklist validation mot de passe          |

---

## Authentification

NextAuth v5 (Credentials provider, stratégie JWT).

```
src/lib/auth.ts                          # Re-export server-only (signIn, signUp depuis auth.service)
src/lib/auth/
├── models/auth.model.ts                 # Types + Zod schemas auth (Login, Registrer, etc.)
├── schemas/auth.schema.ts               # Schémas formulaires (LoginSchema, RegisterSchema, etc.)
├── actions/auth.action.ts               # Server Actions ("use server") — signInAction, signUpAction, etc.
├── auth.service.ts                      # Service serveur ("server-only") — appels REST backend
├── auth.client.service.ts               # Service client — appels proxy API routes (browser)
├── hooks/use-auth.ts                    # React Query hooks — useSignIn, useSignUp, useChangePassword
└── context/auth.user.context.tsx        # AuthUserProvider (contexte custom si nécessaire)
```

**Règles d'import** :

```ts
// ✅ Server Component / API Route — session
import { auth } from "@/lib/auth/next-auth/auth";
const session = await auth();

// ✅ Server Action — appeler le service serveur
import { signInAction, signUpAction } from "@/lib/auth/actions/auth.action";

// ✅ Client Component — session NextAuth
import { useSession } from "next-auth/react";

// ✅ Client Component — hooks React Query
import { useSignIn, useSignUp } from "@/lib/auth/hooks/use-auth";

// ✅ Client Component — appel direct service client
import { signIn, signUp } from "@/lib/auth/auth.client.service";
```

---

## Sidebar & Layout

### Dashboard (admin)

- **Sidebar** : `AppSidebar` — fond `bg-slate-950`, accent `emerald`
- **Layout** : `app/(dashboard)/dashboard/layout.tsx`
- **Breadcrumb** : `DashboardBreadcrumb` (dynamique, lit le pathname)
- **NavMain** : `nav-main.tsx` — active state emerald, sous-items avec icônes

### Account (utilisateur)

- **Sidebar** : `UserSidebar` — fond `bg-white`, accent `indigo`
- **Layout** : `app/(account)/account/layout.tsx`
- **Breadcrumb** : `AccountBreadcrumb` (dynamique)
- **NavMain** : `nav-main-user.tsx` — active state indigo, sous-items avec icônes
- **Brand** : `AccountBrand` (logo indigo/violet)

### NavUser

- `variant="dark"` → utilisé dans AppSidebar (fond sombre)
- `variant="light"` → utilisé dans UserSidebar (fond blanc)

---

## Routes (utils/routes.ts)

```ts
ROUTES = {
  HOME,
  MY_ACCOUNT,
  VIEW_PROFILE,
  EDIT_PROFILE,
  CHANGE_PASSWORD,
  SETTINGS,
  DASHBOARD,
  USERS,
  POSTS,
  COMMENTS,
  SIGN_IN,
  SIGN_UP,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
};
```

Les routes CRUD dashboard se construisent comme :

```ts
`${DASHBOARD}${POSTS}` // /dashboard/posts
`${DASHBOARD}${POSTS}/${id}` // /dashboard/posts/123
`${DASHBOARD}${POSTS}/create` // /dashboard/posts/create
`${DASHBOARD}${POSTS}/edit/${id}`; // /dashboard/posts/edit/123
```

---

## Adapter le projet à un autre domaine

### Exemple : ajouter une entité `products`

1. **Modèle** : créer `src/lib/products/models/product.model.ts`
2. **Services** : créer `product.service.ts` + `product.client.service.ts`
3. **API routes** : créer `src/app/api/products/route.ts` + `[id]/route.ts`
4. **Pages** : créer `src/app/(website)/dashboard/products/` avec `page.tsx`, `[id]/page.tsx`, `create/page.tsx`, `edit/[id]/page.tsx`
5. **Composants** : créer `src/components/features/dashboard/products/` avec list, detail, create-form, edit-form
6. **Routes** : ajouter `PRODUCTS: "/products"` dans `utils/routes.ts`
7. **Sidebar** : ajouter l'entrée dans `app-sidebar.tsx` > `data.navMain`
8. **Couleur** : choisir une couleur (ex: `violet`, `teal`, `cyan`) et l'appliquer dans les composants

### Checklist par entité

- [ ] `{entity}.model.ts` — Type + FormData + Schema Zod
- [ ] `{entity}.service.ts` — CRUD serveur
- [ ] `{entity}.client.service.ts` — CRUD client
- [ ] `api/{entities}/route.ts` — GET (list) + POST (create)
- [ ] `api/{entities}/[id]/route.ts` — GET + PUT + DELETE
- [ ] `{entity}-list.tsx` — columns DataTable + ConfirmModal
- [ ] `{entity}-detail.tsx` — hero + grille infos
- [ ] `{entity}-create-form.tsx` — formulaire + validation
- [ ] `{entity}-edit-form.tsx` — formulaire pré-rempli
- [ ] Pages App Router (4 pages)
- [ ] Entrée dans `ROUTES` + sidebar

---

## Commandes utiles

```bash
npx tsc --noEmit          # Vérifier les erreurs TypeScript
npm run dev               # Développement
npm run build             # Build production
```
