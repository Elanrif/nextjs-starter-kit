# Jose — Gestion des sessions JWT

Jose est la librairie utilisée pour créer, signer et vérifier les tokens JWT dans ce projet. Elle remplace Better Auth / NextAuth pour la gestion de session.

---

## Pourquoi Jose ?

- **Edge-compatible** : fonctionne dans le middleware Next.js (runtime Edge), contrairement aux librairies Node-only
- **Aucun appel réseau** : la session est lue depuis un cookie httpOnly, pas depuis une base de données ou un serveur externe (~1ms)
- **Contrôle total** : on encode exactement ce qu'on veut dans le token (user complet sans mot de passe)

---

## Architecture

```
src/lib/auth/jose/
├── jwt.ts            # encrypt() / decrypt() — edge-compatible, pas de next/headers
├── session.server.ts # createSession() / updateSession() / deleteSession() — server-only
├── jose.service.ts   # auth() — lit la session depuis le cookie (DAL)
└── index.ts          # re-export encrypt / decrypt
```

### Règle d'import critique

| Fichier                  | Peut être importé depuis                                                |
| ------------------------ | ----------------------------------------------------------------------- |
| `jwt.ts`                 | partout (middleware, server, actions)                                   |
| `session.server.ts`      | server components, actions uniquement — **jamais depuis le middleware** |
| `jose.service.ts` (auth) | server components, actions, services — **jamais depuis le client**      |

---

## Flux complet

### Sign In

```
1. signIn(credentials)           → auth.service.ts
2. apiClient.post(loginUrl)      → backend retourne User
3. createSession(user)           → jose/session.server.ts
   └── encrypt({ user, expiresAt })  → JWT signé HS256
   └── cookies().set("session", jwt, { httpOnly, secure, sameSite: "lax" })
4. auth()                        → lit le cookie → decrypt → retourne Session
```

### Lecture de session (Server Component / Service)

```typescript
import { auth } from "@/lib/auth/jose/jose.service";
// OU via le barrel:
import { auth } from "@/lib/auth";

const session = await auth();
if (!session.ok) redirect("/sign-in");
session.data.user.firstName; // disponible directement, aucun fetch
session.data.access_token; // = le JWT brut (envoyé au backend comme Bearer token)
```

### Sign Out

```typescript
await deleteSession(); // supprime le cookie "session"
```

### Edit Profile (mise à jour du cookie)

```typescript
// auth.action.ts — après édition du profil
const result = await editProfile(data);
if (result.ok) {
  await createSession(result.data); // recrée le cookie avec les nouvelles données
  revalidatePath("/account");
}
```

---

## Ce qui est stocké dans le cookie

```typescript
// SessionUser — données user encodées dans le JWT
type SessionUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
};

// SessionPayload — structure complète du JWT
interface SessionPayload {
  user: SessionUser;
  expiresAt: Date;
}

// Session — ce que auth() retourne
type Session = {
  user: SessionUser;
  isAuth: boolean;
  expiresAt?: Date;
  access_token?: string; // = le JWT brut, utilisé comme Bearer token vers le backend
};
```

**Important** : `access_token` dans la Session = le JWT lui-même. Le backend reçoit ce token en `Authorization: Bearer <token>` et peut le vérifier de son côté.

---

## Détails techniques

### Algorithme

- **HS256** (HMAC SHA-256)
- Clé : `process.env.SESSION_SECRET` (variable d'environnement obligatoire)
- Durée : **7 jours**

### Cookie

```typescript
{
  httpOnly: true,           // inaccessible depuis JavaScript côté client
  secure: ENV === "production",
  sameSite: "lax",
  path: "/",
  expires: Date.now() + 7j
}
```

### Cache React (`cache()`)

`auth()` est wrappé dans `React.cache()` — dans une même requête server-side, les appels multiples à `auth()` ne re-lisent pas le cookie plusieurs fois.

---

## Variables d'environnement requises

```env
SESSION_SECRET=une-clé-secrète-longue-et-aléatoire   # obligatoire
ENV=production                                          # active le flag secure sur le cookie
```

---

## Utilisation dans les services

Tous les services serveur qui nécessitent une authentification suivent ce pattern :

```typescript
// Dans n'importe quel *.service.ts
import { auth } from "@/lib/auth/jose/jose.service";

const session = await auth();
if (!session?.ok) return { ok: false, error: unauthorizedApiError() };

const config: Config = { access_token: session.data.access_token };
// config est passé à apiClient pour envoyer le Bearer token au backend
```
