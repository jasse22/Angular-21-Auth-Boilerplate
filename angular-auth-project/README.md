# Angular 21 Auth Boilerplate — IPT 2026 Final Project

**Student:** Wilson Gayo  
**Course:** IPT 2026

---

## Features

- ✅ Email Sign Up with Verification
- ✅ JWT Authentication with Refresh Tokens
- ✅ Role-based Authorization (User & Admin)
- ✅ Forgot Password & Reset Password
- ✅ View and Update My Profile
- ✅ Admin section — Create, Edit, Delete Accounts
- ✅ Fake Backend for local dev (disabled in production)

---

## Live Deployment

| Service  | URL |
|----------|-----|
| Frontend | https://ipt-2026-frontend.onrender.com |
| Backend API Docs | https://ipt-2026-backend.onrender.com/api-docs/ |

---

## Local Development

```bash
npm install
ng serve
```

App runs at `http://localhost:4200`

> The **fake backend** runs automatically in development mode — no real backend needed.  
> Register an account, click the verification link shown in the alert.  
> First registered account is **Admin**; all others are **User**.

---

## Production Build

```bash
ng build --configuration production
```

Output: `dist/ipt-2026-frontend/`

---

## Render Deployment (Frontend)

| Setting | Value |
|---------|-------|
| Service Type | Static Site |
| Branch | main |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist/ipt-2026-frontend` |

**SPA Routing Rule** (Redirects/Rewrites):

| Source | Destination | Action |
|--------|-------------|--------|
| `/*` | `/index.html` | **Rewrite** *(not Redirect)* |

> ⚠️ Must be **Rewrite**, not Redirect — otherwise email verification links break.

---

## Project Structure

```
src/
├── app/
│   ├── _components/       Alert component
│   ├── _helpers/          AppInitializer, AuthGuard, Interceptors, FakeBackend
│   ├── _models/           Account, Alert, Role
│   ├── _services/         AccountService, AlertService
│   ├── account/           Login, Register, VerifyEmail, ForgotPassword, ResetPassword
│   ├── admin/             Overview, SubNav, Layout
│   │   └── accounts/      List, AddEdit
│   ├── home/              Home component
│   ├── profile/           Details, Update
│   ├── app.component.*    Root component + nav
│   ├── app.module.ts      Root module
│   └── app-routing.module.ts
├── environments/
│   ├── environment.ts           (dev → localhost:4000)
│   └── environment.prod.ts      (prod → Render backend URL)
└── index.html
```
