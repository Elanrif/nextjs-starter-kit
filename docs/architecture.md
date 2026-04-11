# Architecture globale

## Structure des fichiers

```bash
nextjs-starter-kit/
├── src/
│   ├── app/
│   │   ├── (website)/
│   │   │   ├── (auth)/
│   │   │   │   ├── sign-in/page.tsx
│   │   │   │   ├── sign-up/page.tsx
│   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   └── reset-password/page.tsx
│   │   │   ├── account/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── edit/page.tsx
│   │   │   │   ├── password/page.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   └── not-found.tsx
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       ├── error.tsx / not-found.tsx / loading.tsx
│   │   │       ├── {entities}/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── [id]/page.tsx + loading.tsx
│   │   │       │   ├── create/page.tsx
│   │   │       │   └── edit/[id]/page.tsx + loading.tsx
│   │   │       └── {other-entities}/  (idem)
│   │   ├── api/
│   │   │   ├── auth/login/route.ts + register/route.ts
│   │   │   ├── {entities}/route.ts + [id]/route.ts + search/route.ts
│   │   │   └── {other-entities}/route.ts + [id]/route.ts
│   │   ├── layout.tsx / page.tsx / globals.css
│   │   └── error.tsx / global-error.tsx / loading.tsx / not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui (button, input, dialog…)
│   │   │   └── form/                   # field.tsx, form-error.tsx, input-class.ts
│   │   ├── providers/                  # query-provider, modal-provider
│   │   ├── app-sidebar.tsx / user-sidebar.tsx
│   │   ├── nav-main.tsx / nav-main-user.tsx / nav-user.tsx
│   │   └── features/
│   │       ├── auth/                   # sign-in-form, sign-up-form, sign-out-button…
│   │       ├── account/                # profile-detail, profile-edit-form, change-password-form…
│   │       └── dashboard/
│   │           ├── data-table.tsx / confirm-modal.tsx / dashboard-hero.tsx
│   │           ├── {entities}/        # {entity}-list, {entity}-detail, {entity}-create-form, {entity}-edit-form
│   │           └── {other-entities}/ # idem
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── models/ + schemas/ + actions/ + hooks/ + context/
│   │   │   ├── auth.service.ts (server) + auth.client.service.ts
│   │   ├── {entity}/
│   │   │   ├── models/ + schemas/ + actions/ + hooks/
│   │   │   └── services/{entity}.service.ts + {entity}.client.service.ts
│   │   ├── {other-entities}/  (idem)
│   │   └── cloudinary/        (actions, config, hooks)
│   │
│   ├── config/
│   │   ├── api.config.ts / axios.config.ts / environment.config.ts
│   │   ├── logger.config.ts / mail.config.ts / auth.utils.ts
│   │   ├── axios/                      # base-request, frontend-http
│   │   └── interceptors/               # auth.interceptor, logger.interceptor
│   │
│   ├── shared/
│   │   ├── errors/                     # api-error.ts + api-error.server.ts
│   │   └── models/response.model.ts
│   │
│   ├── hooks/                          # use-mobile, use-password-validation, use-is-mounted
│   ├── context/auth.user.context.tsx
│   ├── utils/routes.ts + utils.ts + utils.server.ts
│   └── proxy.ts
│
├── public/                             # SVGs, images
├── env/                                # .env.local / .env.prod / .env.staging
├── docs/                               # clone.md, cloudinary.md, init.md…
├── .github/workflows/                  # CI/CD (review, release-docker, reviewdog)
├── Dockerfile / Makefile / bootstrap.sh
└── next.config.ts / tsconfig.json / eslint.config.mjs

```
