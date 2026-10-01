# Business Manager

A professional, responsive web app for organizing a real-estate & technical office: pending tasks, partners, clients, finances, appointments, useful info and technical inspections.

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Firebase (Firestore + Authentication)
- **Hosting:** GitHub Pages
- **Languages:** English (default) + Greek, with theme & font-size settings

## Applications

1. Pending tasks
2. Partners
3. Clients
4. Finances
5. Appointments
6. Useful info
7. Technical inspections

## Local development

```bash
npm install
npm run dev
```

## Build & lint

```bash
npm run build
npm run lint
```

## Deployment

Pushing to `main` builds and deploys to GitHub Pages automatically via GitHub Actions (`.github/workflows/deploy.yml`).

Firebase configuration lives in `src/lib/firebase.ts` (public keys; access is controlled by Firestore security rules + Authentication).
