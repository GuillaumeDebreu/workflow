# AutoFlow - Marketplace d'Automatisations IA

Le Netflix des automatisations IA. Choisissez un workflow, configurez-le en 5 minutes, recevez les resultats par email.

## Lancement rapide

### 1. Cloner et installer
```bash
git clone <repo-url>
cd workflow
npm install
```

### 2. Demarrer les services (PostgreSQL + Redis)
```bash
docker compose up -d postgres redis
```

### 3. Configurer l'environnement
```bash
cp .env.example .env
# Editez .env avec vos cles API (Resend, Stripe, etc.)
```

### 4. Initialiser la base de donnees
```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 5. Lancer le serveur
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## Stack technique

- **Frontend** : Next.js 16 (App Router) + Tailwind CSS v4
- **Backend** : Next.js API Routes
- **BDD** : PostgreSQL (Prisma ORM)
- **Auth** : NextAuth.js (magic link + Google OAuth)
- **Paiements** : Stripe
- **Queue** : BullMQ + Redis
- **Email** : Resend

## Architecture

```
src/
  app/           - Pages et API routes (Next.js App Router)
  components/    - Composants React reutilisables
  lib/           - Utilitaires (prisma, stripe, credits, queue)
  workflows/     - 10 workflows autonomes (meta + config + execute)
```

## Ajouter un workflow

1. Creer un dossier dans `src/workflows/mon-workflow/`
2. Ajouter `meta.ts`, `config.ts`, `index.ts`
3. L'enregistrer dans `src/workflows/registry.ts`
4. Ajouter les donnees dans `prisma/seed.ts`
5. Relancer le seed : `npm run db:seed`
