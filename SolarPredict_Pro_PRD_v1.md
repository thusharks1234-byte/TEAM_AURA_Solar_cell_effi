# SolarPredict Pro
## Product Requirements Document — Version 1.0

> **Status:** Draft — For Review | **Last Updated:** April 2026 | **Audience:** Engineering, Design, Stakeholders

| Field | Details |
|---|---|
| Document Version | v1.0 — Initial Release |
| Tech Stack | React 18 + Vite 5, Supabase, Vercel |
| Hosting | Vercel (Frontend) + Supabase (BaaS) |
| Classification | Confidential & Proprietary |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Audience & Stakeholders](#3-target-audience--stakeholders)
4. [Technology Stack & Architecture](#4-technology-stack--architecture)
5. [User Authentication & Authorization](#5-user-authentication--authorization)
6. [Functional Requirements](#6-functional-requirements)
7. [Database Schema](#7-database-schema-supabase-postgres)
8. [Supabase Edge Functions API](#8-supabase-edge-functions-serverless-api)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [CI/CD Pipeline & Deployment](#10-cicd-pipeline--deployment)
11. [Development Milestones & Roadmap](#11-development-milestones--roadmap)
12. [Success Metrics](#12-success-metrics-kpis)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Glossary](#14-glossary)

---

## 1. Executive Summary

### 1.1 Product Vision

SolarPredict Pro is a full-stack, production-grade web application that combines machine learning model inference with an intuitive user interface to accurately predict and optimize solar cell efficiency. The platform is built using **React + Vite** for the frontend, **Supabase** as the Backend-as-a-Service (authentication, database, edge functions), and deployed globally via **Vercel's edge network**.

By providing real-time prediction, historical analysis, and role-based dashboards, SolarPredict Pro enables solar farm operators, photovoltaic engineers, and grid managers to make data-driven decisions that maximize renewable energy output and contribute directly to global sustainability goals.

### 1.2 Strategic Alignment with UN SDGs

- **SDG Goal 7 — Affordable & Clean Energy:** Directly advances metric 7.2.1 (Renewable energy share) by optimizing solar panel yield across deployments.
- **SDG Goal 13 — Climate Action:** Supports metric 13.2.2 (Emission reduction targets) by maximizing the viability and deployment of clean energy sources over fossil fuels.

### 1.3 High-Level Feature Summary

- Secure multi-provider user authentication (Email/Password, Google OAuth, GitHub OAuth) via Supabase Auth
- Role-based access control (Admin, Engineer, Operator, Viewer) with Row Level Security in Supabase
- Real-time solar efficiency prediction engine using Linear Regression, Ridge Regression, and Random Forest models
- Interactive feature importance dashboard with Recharts/D3 visualizations
- Historical prediction logs stored in Supabase Postgres with full CRUD access
- Serverless API via Supabase Edge Functions (Deno runtime) for ML inference
- Zero-downtime global deployment via Vercel with automatic CI/CD from GitHub

---

## 2. Problem Statement

Solar cell efficiency prediction is highly complex due to multiple dynamic, non-linear, and interdependent environmental variables. Current approaches suffer from three core problems:

### 2.1 Core Problems

1. **Prediction Inaccuracy:** Existing tools rely on static lookup tables or oversimplified linear models, failing to capture non-linear interactions between temperature, irradiance, and cell material properties.
2. **No Accessible Interface:** ML research in PV efficiency exists in academic silos (Jupyter notebooks, local scripts). There is no production-ready web interface for daily operational use by non-ML engineers.
3. **No User Identity or History:** Without authentication and persistent storage, operators cannot save predictions, compare historical outcomes, or share results across teams.

### 2.2 Business Impact

- Inaccurate predictions lead to sub-optimal deployment and over/under-provisioning of solar infrastructure.
- Operational inefficiencies reduce energy output, making renewable energy less reliable and less cost-effective.
- Absence of a team-based platform prevents collaborative analysis across solar farm sites.

---

## 3. Target Audience & Stakeholders

| Persona | Role in Platform | Primary Use Case | Pain Point Solved |
|---|---|---|---|
| Solar Farm Operators | Operator Role | Forecast daily energy yield; monitor panel degradation over time | No accessible web tool for real-time energy yield forecasting |
| PV Engineers | Engineer Role | Analyze material & environmental impact on cell efficiency via feature importance | Siloed research tools; no collaborative platform |
| Grid Managers | Viewer Role | Access read-only prediction dashboards to anticipate power fluctuations | No reliable prediction data integration |
| System Administrators | Admin Role | Manage users, roles, dataset uploads, and model configurations | No centralized management console |

---

## 4. Technology Stack & Architecture

### 4.1 Full Technology Stack

| Category | Technology | Purpose | Version |
|---|---|---|---|
| Frontend Framework | React 18 + Vite 5 | SPA, component architecture, HMR dev server | React 18.x / Vite 5.x |
| Routing | React Router v6 | Client-side routing, protected routes, lazy loading | v6.x |
| Styling | Tailwind CSS v3 | Utility-first responsive design system | v3.x |
| UI Components | shadcn/ui + Radix UI | Accessible, headless component primitives | Latest |
| State Management | Zustand | Lightweight global state (auth session, predictions) | v4.x |
| Data Fetching | TanStack Query (React Query) | Server state, caching, background refetch | v5.x |
| Charts & Visualization | Recharts + D3.js | Feature importance graphs, correlation charts | Recharts 2.x |
| Forms & Validation | React Hook Form + Zod | Type-safe form validation for input parameters | RHF 7.x |
| Backend (BaaS) | Supabase | Auth, Postgres DB, Storage, Edge Functions, Realtime | Latest |
| Authentication | Supabase Auth | Email/password, Google OAuth 2.0, GitHub OAuth | Built-in |
| Database | Supabase Postgres | Prediction logs, user profiles, dataset metadata | Postgres 15 |
| Serverless API | Supabase Edge Functions | ML inference wrapper (Deno runtime, TypeScript) | Deno 1.x |
| File Storage | Supabase Storage | Dataset CSV/JSON uploads, model artifact storage | Built-in |
| Hosting & CDN | Vercel | Global edge deployment, automatic CI/CD, preview URLs | Latest |
| CI/CD | GitHub Actions + Vercel | Automated test, build, and deploy on push to main | Latest |
| Type Safety | TypeScript 5 | End-to-end type safety across frontend and functions | v5.x |
| Testing | Vitest + React Testing Library | Unit and integration testing for components | Latest |
| Linting | ESLint + Prettier | Code quality enforcement and formatting | Latest |

### 4.2 System Architecture Overview

The application follows a three-tier architecture optimized for serverless deployment:

- **Tier 1 — Presentation Layer:** React + Vite SPA hosted on Vercel's global CDN. All routing is client-side (React Router v6). The app communicates exclusively via HTTPS to Supabase endpoints.
- **Tier 2 — API & Business Logic Layer:** Supabase Edge Functions (Deno, TypeScript) serve as lightweight serverless API endpoints. The ML inference logic (pre-trained model weights serialized to JSON/ONNX) is executed within these functions, returning predictions in under 2 seconds.
- **Tier 3 — Data Layer:** Supabase Postgres stores all relational data (users, predictions, datasets). Row Level Security (RLS) policies enforce authorization at the database level. Supabase Storage manages binary files (CSV datasets, model exports).

### 4.3 Deployment Architecture

- **Frontend (React/Vite):** Deployed to Vercel. Every push to the `main` branch triggers an automatic production deployment. Feature branches generate ephemeral preview URLs.
- **Backend (Supabase):** Supabase project is provisioned in the desired region (e.g., `ap-south-1` for India). Edge Functions are deployed via the Supabase CLI as part of the CI/CD pipeline.
- **Environment Variables:** Stored securely in Vercel project settings (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) and Supabase secrets for Edge Functions (`SERVICE_ROLE_KEY`).
- **Custom Domain:** The Vercel project is mapped to a custom domain with automatic TLS certificate provisioning via Let's Encrypt.

---

## 5. User Authentication & Authorization

All authentication is handled exclusively by **Supabase Auth**, which issues signed JWT tokens consumed by both the frontend and Edge Functions.

### 5.1 Authentication Methods

#### 5.1.1 Email & Password Authentication

- Users register with a valid email address and a password meeting minimum security requirements (minimum 8 characters, at least one uppercase letter, one number, one special character).
- Supabase Auth sends an email verification link upon registration. Accounts are not active until the email is verified.
- **Password reset flow:** Supabase sends a secure magic-link to the registered email. The link expires after 60 minutes.
- Passwords are hashed using bcrypt (managed entirely by Supabase — plaintext passwords are never stored or logged).

#### 5.1.2 OAuth 2.0 — Google Sign-In

- The platform integrates Google OAuth 2.0 via Supabase Auth providers. Users click "Sign in with Google", are redirected to Google's consent screen, and returned to the app with a session token.
- Scopes requested: `email`, `profile` (no sensitive scopes are requested).
- Supabase automatically creates a user record in the `auth.users` table upon first OAuth sign-in.

#### 5.1.3 OAuth 2.0 — GitHub Sign-In

- GitHub OAuth 2.0 is integrated for developer/engineer users. Scopes requested: `read:user`, `user:email`.
- Configuration requires registering a GitHub OAuth App with callback URL set to the Supabase project's Auth callback endpoint.

### 5.2 Session Management

- Supabase Auth issues a JWT access token (1-hour expiry) and a refresh token (stored in `httpOnly` cookie via Supabase SSR helper or `localStorage` in SPA mode).
- The frontend uses the `@supabase/supabase-js` client to automatically handle token refresh before expiry.
- All protected routes in React Router are guarded by an `AuthGuard` component that checks session validity from `supabase.auth.getSession()` before rendering.
- On session expiry or explicit sign-out, the user is redirected to `/login` and all local state is cleared.

### 5.3 Role-Based Access Control (RBAC)

Roles are stored in a custom `user_profiles` table in Supabase Postgres and enforced via Row Level Security (RLS) policies. The role is also embedded in the JWT custom claims via a Supabase database trigger.

| Feature | Admin | Engineer | Operator | Viewer | Guest (Unauth) | Notes |
|---|:---:|:---:|:---:|:---:|:---:|---|
| Run Predictions | ✅ | ✅ | ✅ | ❌ | ❌ | Operators can run but not configure models |
| View Dashboards | ✅ | ✅ | ✅ | ✅ | ❌ | Viewers have read-only dashboard access |
| View Feature Importance | ✅ | ✅ | ❌ | ❌ | ❌ | Engineer-level insight tool |
| Upload Datasets | ✅ | ✅ | ❌ | ❌ | ❌ | CSV/JSON uploads for model training |
| Manage Users | ✅ | ❌ | ❌ | ❌ | ❌ | Admin only |
| Configure Models | ✅ | ✅ | ❌ | ❌ | ❌ | ML model parameter tuning |
| View Prediction History | ✅ | ✅ | ✅ | ✅ | ❌ | All authenticated users |
| Export Reports (PDF/CSV) | ✅ | ✅ | ✅ | ❌ | ❌ | Requires authentication |
| Access Admin Console | ✅ | ❌ | ❌ | ❌ | ❌ | User management, audit logs |
| Delete Records | ✅ | ❌ | ❌ | ❌ | ❌ | Soft delete with audit trail |

### 5.4 Security Requirements

- All communication between the React app and Supabase must occur over **HTTPS/TLS 1.3**. No HTTP traffic is permitted.
- Supabase **Row Level Security (RLS) must be enabled on ALL tables**. No table should have RLS disabled in production.
- The Supabase `SERVICE_ROLE_KEY` must never be exposed to the frontend. It is used exclusively in Edge Functions (server-side).
- Rate limiting is enforced at the Supabase Auth level (email sign-in: 5 attempts per hour per IP) and at the Vercel edge level for the prediction API (100 requests per minute per authenticated user).
- **PKCE** (Proof Key for Code Exchange) flow must be used for all OAuth integrations to prevent authorization code interception attacks.
- All user inputs on the prediction form must be validated client-side (Zod schema) and server-side (Edge Function validation) before being processed.
- Personal Identifiable Information (PII) — email addresses, names — is stored only in Supabase Auth tables and `user_profiles`. It is never logged in prediction records.

---

## 6. Functional Requirements

### 6.1 Public-Facing Pages (Unauthenticated)

#### 6.1.1 Landing Page (`/`)

- Marketing landing page explaining the product's value proposition, feature highlights, and supported SDGs.
- Clear Call-to-Action (CTA) buttons: "Sign Up Free" and "Sign In".
- Includes a live demo section showing a sample prediction with dummy inputs (no auth required).
- Fully responsive — mobile-first design using Tailwind CSS breakpoints.
- Page load performance: Core Web Vitals (LCP < 2.5s, CLS < 0.1, FID < 100ms) must be met on Vercel's edge.

#### 6.1.2 Authentication Pages (`/login`, `/register`, `/forgot-password`, `/reset-password`)

- **Login Page (`/login`):** Email/password form with "Sign in with Google" and "Sign in with GitHub" OAuth buttons. Link to register and forgot-password pages.
- **Register Page (`/register`):** Full name, email, password, confirm-password fields. Supabase sends a verification email. User is shown a "Check your email" confirmation screen.
- **Forgot Password (`/forgot-password`):** Email input field. On submission, Supabase sends a password reset link. Success message is shown regardless of whether the email exists (prevents user enumeration).
- **Reset Password (`/reset-password`):** Accessed via the magic link in the reset email. New password + confirm password fields with Zod validation. On success, user is redirected to `/login`.

### 6.2 Authenticated Application Pages

#### 6.2.1 Dashboard (`/dashboard`)

- Post-login home screen. Shows a personalized greeting with user's display name fetched from `user_profiles`.
- Summary KPI cards: Total predictions run, Average predicted efficiency (%), Best model R² score, Last prediction timestamp.
- **Quick-Predict widget:** Pre-filled sample values; allows a one-click prediction without navigating to the full prediction form.
- **Recent predictions table:** Last 10 predictions with timestamps, input parameters, and predicted efficiency. Rows are clickable to view full detail.
- **Realtime updates:** Uses Supabase Realtime subscriptions so the recent predictions table updates live without page refresh.

#### 6.2.2 Prediction Engine (`/predict`)

- Multi-step form with real-time Zod validation for all numerical inputs.
- **Input fields:** Solar Irradiance (W/m²), Ambient Temperature (°C), Module Temperature (°C), Sunshine Hours, Relative Humidity (%), Wind Speed (m/s).
- **Model selector:** User can choose between Linear Regression, Ridge Regression, or Random Forest. Default: Random Forest.
- On submission: A `POST` request is made to the Supabase Edge Function (`/functions/v1/predict`). The function validates inputs, runs the inference, and returns the predicted efficiency and model metadata.
- **Results panel:** Displays predicted efficiency percentage, model used, confidence interval, and a visual gauge chart. The result is automatically persisted to the `predictions` table in Supabase Postgres.
- **Input history:** The last 5 entered parameter sets are saved to `localStorage` for quick re-use.

#### 6.2.3 Feature Importance Dashboard (`/analytics`) — Engineer & Admin Only

- Bar chart (Recharts) displaying feature importance scores from the Random Forest model (sorted descending).
- Scatter plot: Individual feature vs. predicted efficiency correlation — interactive, with brushing/zooming enabled.
- Heatmap: Pearson correlation matrix of all input features and the output variable.
- Model performance comparison table: R², RMSE, MAE, and training time for all three models side by side.
- Data is fetched from a Supabase Edge Function that loads pre-computed model metrics stored in Supabase Storage.

#### 6.2.4 Prediction History (`/history`)

- Full paginated table of the authenticated user's prediction history (Admins can see all users' history).
- **Columns:** ID, Date/Time, Irradiance, Temperature, Module Temp, Humidity, Wind Speed, Sunshine Hrs, Model Used, Predicted Efficiency (%), Actions.
- **Filtering:** By date range, model used, and efficiency range (slider).
- **Sorting:** Clickable column headers for client-side sort.
- **Export:** "Download CSV" and "Download PDF Report" buttons. CSV uses Supabase's data export; PDF is generated client-side using jsPDF.
- **Delete:** Soft-delete (`is_deleted` flag) with confirmation dialog. Admins can permanently delete records.

#### 6.2.5 Dataset Manager (`/datasets`) — Engineer & Admin Only

- **Upload interface:** Drag-and-drop or file-picker for CSV or JSON dataset files up to 50MB. Files are uploaded to Supabase Storage (`datasets` bucket, private access).
- Uploaded dataset metadata (name, size, upload date, record count, uploader) is stored in the `datasets` table.
- **Dataset preview:** First 50 rows rendered in a data table after upload for validation.
- **Column mapping UI:** Engineer maps uploaded CSV columns to the expected model input schema (irradiance, temperature, etc.).
- **Trigger retraining:** A button that calls a Supabase Edge Function to initiate a background model retraining job using the new dataset. Job status is tracked in a `model_training_jobs` table and updated via Supabase Realtime.

#### 6.2.6 User Profile (`/profile`)

- **View and edit:** Display name, profile photo (uploaded to Supabase Storage, public bucket), organization name, job title.
- **Password change:** Only available for email/password users (not shown for OAuth users).
- **Connected accounts:** Shows which OAuth providers are linked. Allows linking an additional provider (e.g., a user who signed up with email can add Google).
- **Account deletion:** Soft-delete with a 30-day recovery window. User must type `DELETE` to confirm.

#### 6.2.7 Admin Console (`/admin`) — Admin Only

- **User Management:** Full list of all users with their role, registration date, last login, and account status. Admins can change a user's role, suspend an account, or trigger a password reset email.
- **Audit Logs:** Timestamped log of all critical actions (user creation, role changes, model retraining, data deletion). Stored in an `audit_logs` table with immutable rows (INSERT only, no UPDATE/DELETE via RLS).
- **System Metrics:** Supabase database usage, storage utilization, and Edge Function invocation counts sourced from Supabase's Management API.
- **Model Configuration:** View and update hyperparameters for Ridge Regression (alpha value) and Random Forest (`n_estimators`, `max_depth`, `min_samples_split`).

---

## 7. Database Schema (Supabase Postgres)

### 7.1 `user_profiles`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PK, FK → `auth.users` | References Supabase Auth user ID |
| `full_name` | `TEXT` | NOT NULL | User's display name |
| `avatar_url` | `TEXT` | NULLABLE | URL to profile photo in Supabase Storage |
| `organization` | `TEXT` | NULLABLE | User's organization or company name |
| `job_title` | `TEXT` | NULLABLE | User's job title |
| `role` | `TEXT` | NOT NULL, DEFAULT `'viewer'` | One of: `admin`, `engineer`, `operator`, `viewer` |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Account active status |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Last update timestamp |

### 7.2 `predictions`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PK, DEFAULT `gen_random_uuid()` | Unique prediction record ID |
| `user_id` | `UUID` | FK → `auth.users`, NOT NULL | Authenticated user who made the prediction |
| `irradiance` | `NUMERIC(10,2)` | NOT NULL, CHECK > 0 | Solar irradiance in W/m² |
| `ambient_temp` | `NUMERIC(5,2)` | NOT NULL | Ambient temperature in °C |
| `module_temp` | `NUMERIC(5,2)` | NOT NULL | Module temperature in °C |
| `humidity` | `NUMERIC(5,2)` | NOT NULL, CHECK 0–100 | Relative humidity in percentage |
| `wind_speed` | `NUMERIC(5,2)` | NOT NULL, CHECK >= 0 | Wind speed in m/s |
| `sunshine_hours` | `NUMERIC(4,2)` | NOT NULL, CHECK 0–24 | Daily sunshine hours |
| `model_used` | `TEXT` | NOT NULL | One of: `linear`, `ridge`, `random_forest` |
| `predicted_efficiency` | `NUMERIC(5,4)` | NOT NULL | Predicted solar cell efficiency (0.0 to 1.0) |
| `r2_score` | `NUMERIC(5,4)` | NULLABLE | R² score of the model for this run |
| `is_deleted` | `BOOLEAN` | DEFAULT `false` | Soft delete flag |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Prediction timestamp |

### 7.3 `datasets`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PK, DEFAULT `gen_random_uuid()` | Unique dataset record ID |
| `name` | `TEXT` | NOT NULL | User-provided dataset name |
| `file_path` | `TEXT` | NOT NULL | Supabase Storage path (`datasets/{user_id}/{file}`) |
| `file_size_bytes` | `BIGINT` | NOT NULL | File size in bytes |
| `record_count` | `INTEGER` | NULLABLE | Number of data rows in the dataset |
| `uploaded_by` | `UUID` | FK → `auth.users` | User who uploaded the dataset |
| `status` | `TEXT` | DEFAULT `'uploaded'` | One of: `uploaded`, `validated`, `training`, `ready`, `error` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Upload timestamp |

### 7.4 `audit_logs`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PK, DEFAULT `gen_random_uuid()` | Unique audit log entry ID |
| `actor_id` | `UUID` | FK → `auth.users`, NULLABLE | User performing the action |
| `action` | `TEXT` | NOT NULL | Action performed (e.g., `USER_ROLE_CHANGED`) |
| `target_type` | `TEXT` | NOT NULL | Resource type (e.g., `user`, `prediction`, `dataset`) |
| `target_id` | `UUID` | NULLABLE | ID of the affected resource |
| `metadata` | `JSONB` | NULLABLE | Additional context (e.g., old value, new value) |
| `ip_address` | `INET` | NULLABLE | IP address of the actor |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Timestamp of the action |

> **RLS Note:** `audit_logs` uses INSERT-only RLS. No UPDATE or DELETE is permitted — even by admins — to preserve an immutable audit trail.

---

## 8. Supabase Edge Functions (Serverless API)

### 8.1 Endpoint Specifications

| Function Name | Method | Auth Required | Description |
|---|---|---|---|
| `/functions/v1/predict` | POST | YES (JWT) | Validates inputs, runs ML inference, returns predicted efficiency + R² score. Persists result to `predictions` table. |
| `/functions/v1/feature-importance` | GET | YES (Engineer+) | Returns pre-computed feature importance scores and correlation matrix from the latest trained Random Forest model. |
| `/functions/v1/model-metrics` | GET | YES (Engineer+) | Returns RMSE, MAE, R² for all three models from the most recent training run. |
| `/functions/v1/retrain` | POST | YES (Admin only) | Triggers background model retraining using a specified dataset ID. Updates `model_training_jobs` table. |
| `/functions/v1/export-csv` | GET | YES (Operator+) | Streams a CSV export of the calling user's prediction history (Admins get all users' data). |

### 8.2 Prediction API — Request/Response Contract

**Request Body (`POST /functions/v1/predict`):**

| Field | Type | Validation | Description |
|---|---|---|---|
| `irradiance` | `number` | Required, > 0, ≤ 1500 | Solar irradiance in W/m² |
| `ambient_temp` | `number` | Required, −40 to 80 | Ambient temperature in °C |
| `module_temp` | `number` | Required, −40 to 100 | Module temperature in °C |
| `humidity` | `number` | Required, 0 to 100 | Relative humidity in % |
| `wind_speed` | `number` | Required, ≥ 0, ≤ 50 | Wind speed in m/s |
| `sunshine_hours` | `number` | Required, 0 to 24 | Daily sunshine hours |
| `model` | `string` | Optional, default: `random_forest` | One of: `linear`, `ridge`, `random_forest` |

**Success Response (`200 OK`):**

```json
{
  "prediction_id": "uuid",
  "predicted_efficiency": 0.1842,
  "predicted_efficiency_pct": "18.42%",
  "model_used": "random_forest",
  "r2_score": 0.9421,
  "inference_time_ms": 312,
  "created_at": "2026-04-09T11:00:00Z"
}
```

**Error Response (`422 Unprocessable Entity`):**

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "irradiance", "message": "Must be greater than 0" }
  ]
}
```

---

## 9. Non-Functional Requirements

### 9.1 Performance

- Prediction API response time: **< 2 seconds (p95)** for all three models under normal load.
- Page load time: Largest Contentful Paint (LCP) < 2.5 seconds on a 4G mobile connection.
- Prediction history table: Must render 1,000 rows with virtual scrolling without UI jank (60 fps maintained).
- Vercel Edge CDN cache: Static assets (JS bundles, CSS) cached with `max-age=31536000` via cache-busting filenames.

### 9.2 Availability & Reliability

- Target uptime: **99.9% monthly uptime SLA** (achievable via Vercel + Supabase managed infrastructure).
- Supabase automatic daily backups with a 7-day point-in-time recovery (PITR) window.
- Vercel automatic failover across edge regions — if one region fails, requests are routed to the nearest healthy region within 100ms.

### 9.3 Scalability

- The Supabase Postgres database must be provisioned on a plan supporting connection pooling (PgBouncer) to handle up to 500 concurrent users.
- Vercel serverless functions scale automatically to handle traffic spikes without manual intervention.
- Dataset uploads are streamed to Supabase Storage — files are never buffered in memory server-side, enabling uploads of up to 50MB without timeout.

### 9.4 Security

- **OWASP Top 10 compliance:** The application must be audited against OWASP Top 10 vulnerabilities before production launch.
- **HTTPS enforcement:** Vercel automatically redirects HTTP to HTTPS. HSTS headers are set with `max-age=31536000`.
- **Content Security Policy (CSP):** Strict CSP headers configured at the Vercel edge to prevent XSS attacks.
- **Dependency scanning:** GitHub Dependabot or Snyk configured to automatically flag vulnerable npm packages.

### 9.5 Accessibility

- **WCAG 2.1 Level AA compliance:** All interactive elements must have accessible labels, keyboard navigation support, and sufficient color contrast ratios (≥ 4.5:1 for normal text).
- Screen reader compatibility: All charts must have descriptive `aria-label` attributes and data tables as accessible alternatives.

### 9.6 Usability

- The prediction form must be operable by a photovoltaic engineer with no ML background within 60 seconds of first use.
- All error messages must be actionable — they must explain what went wrong and how to fix it (not generic "An error occurred" messages).
- All asynchronous operations must show a visual loading indicator (skeleton loaders or spinners) within 100ms of initiation.

---

## 10. CI/CD Pipeline & Deployment

### 10.1 Repository Structure

- **Monorepo structure:** `/frontend` (React/Vite app) and `/supabase` (Edge Functions, migrations, seed data).
- **Branch strategy:** `main` (production), `develop` (staging), `feature/*` (individual feature branches).
- All pull requests require: (1) passing CI tests, (2) at least one code review approval, (3) no TypeScript errors, (4) Lighthouse score ≥ 90.

### 10.2 CI/CD Pipeline (GitHub Actions + Vercel)

1. **On push to `feature/*`:** Run Vitest unit tests, ESLint, TypeScript type-check. Generate Vercel preview deployment URL for the PR.
2. **On merge to `develop`:** Run full test suite. Deploy to Staging environment on Vercel. Run Supabase migration on staging Supabase project.
3. **On merge to `main`:** Run full test suite. Deploy to Production on Vercel (automatic via Vercel GitHub integration). Run Supabase migration on production project via Supabase CLI in GitHub Actions.
4. **Post-deploy health check:** Automated smoke tests hit the `/health` endpoint and the `/functions/v1/predict` endpoint with a test payload. If either fails, Vercel automatically rolls back to the previous deployment.

### 10.3 Environment Variables

| Variable | Scope | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend (public) | Supabase project URL. Safe to expose — enforced by RLS. |
| `VITE_SUPABASE_ANON_KEY` | Frontend (public) | Supabase anon key. Safe to expose — enforced by RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions only | **NEVER expose to frontend.** Used for admin DB operations. |
| `VITE_APP_URL` | Frontend | Base URL of the app (for OAuth callbacks, sharing links). |
| `GOOGLE_CLIENT_ID` | Supabase Auth Config | Configured in Supabase Auth dashboard, not in code. |
| `GITHUB_CLIENT_ID` | Supabase Auth Config | Configured in Supabase Auth dashboard, not in code. |

---

## 11. Development Milestones & Roadmap

| Phase | Milestone | Deliverables | Timeline | Owner |
|---|---|---|---|---|
| Phase 0 | Project Setup & Infrastructure | Supabase project, Vercel project, GitHub repo, CI/CD pipeline, domain configuration | Week 1–2 | Engineering Lead |
| Phase 1 | Authentication System | Login, Register, OAuth (Google + GitHub), Forgot/Reset Password, Route Guards, RBAC | Week 3–4 | Full-Stack Dev |
| Phase 2 | Core ML Engine | Supabase Edge Functions for predict, feature-importance, model-metrics; pre-trained model serialization | Week 5–6 | ML Engineer |
| Phase 3 | Prediction UI | Prediction form, results panel, Quick-Predict widget, input validation, persistence to Supabase | Week 7–8 | Frontend Dev |
| Phase 4 | Dashboard & Analytics | KPI cards, Realtime predictions table, feature importance charts, correlation heatmap | Week 9–10 | Frontend Dev |
| Phase 5 | History, Export & Datasets | Prediction history table, CSV/PDF export, dataset upload manager, column mapping UI | Week 11–12 | Full-Stack Dev |
| Phase 6 | Admin Console & Profile | User management, audit logs, system metrics, profile editor, account deletion | Week 13–14 | Full-Stack Dev |
| Phase 7 | Landing Page & Public UX | Marketing landing page, demo widget, responsive polish, SEO meta tags | Week 15 | Frontend Dev |
| Phase 8 | Testing & Hardening | Unit tests (Vitest), integration tests, OWASP audit, accessibility audit, performance profiling | Week 16–17 | QA / Engineering |
| Phase 9 | Production Launch | Production Vercel + Supabase deploy, custom domain TLS, monitoring setup (Sentry, Supabase dashboards) | Week 18 | DevOps / All |
| Phase 10 *(Future)* | ANN Model Integration | Add Artificial Neural Network model via ONNX.js or server-side Python microservice for comparison | TBD | ML Engineer |
| Phase 11 *(Future)* | IoT Sensor Integration | Real-time data ingestion from live solar panel sensors via MQTT / Supabase Realtime webhooks | TBD | Engineering |

---

## 12. Success Metrics (KPIs)

### 12.1 ML Model Metrics

- Random Forest model must achieve **R² ≥ 0.92** on the held-out test set.
- RMSE of predicted efficiency must be **≤ 2.5 percentage points** on validation data.
- Feature importance analysis must successfully rank the **top 3 environmental factors** with statistical significance (p < 0.05).

### 12.2 Application Performance Metrics

- Prediction API **P95 latency < 2 seconds** (measured by Vercel Analytics).
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms across all pages on desktop and mobile.
- **Lighthouse score ≥ 90** for Performance, Accessibility, Best Practices, and SEO.

### 12.3 User Engagement Metrics (30 Days Post-Launch)

- Month 1 target: **≥ 50 registered users** across Operator, Engineer, and Viewer roles.
- Prediction volume: **≥ 500 predictions** run in the first 30 days.
- Authentication: **< 2% authentication error rate** (failed logins, OAuth failures).
- Retention: **≥ 40% of users** who run a prediction return within 7 days.

### 12.4 Operational Metrics

- Uptime: **≥ 99.9% monthly availability.**
- Variance reduction: **≥ 15% reduction** in the variance between predicted and actual energy output for test solar arrays using operator-provided ground truth data.
- Support tickets: **< 5 critical bug reports** in the first 30 days post-launch.

---

## 13. Risks & Mitigations

| Risk | Severity | Likelihood | Mitigation Strategy |
|---|:---:|:---:|---|
| ML model underperforms on real-world data | High | Medium | Maintain a retraining pipeline; allow dataset uploads to retrain on new data. Expose R² score per prediction so users know model confidence. |
| Supabase RLS misconfiguration causes data leakage | Critical | Low | Automated RLS policy tests in CI. Regular penetration testing. Principle of least privilege on all policies. |
| OAuth provider deprecates or changes API | Medium | Low | Abstract auth provider calls behind a Supabase Auth adapter. Email/password auth serves as permanent fallback. |
| Vercel cold starts increase prediction latency | Medium | Medium | Supabase Edge Functions run on the Deno global network — no cold starts. Vercel is used for static hosting only. |
| Dataset upload size exceeds Supabase Storage limits | Low | Low | Enforce 50MB limit client-side and server-side. Provide chunked upload guidance for very large datasets. |
| GDPR compliance for EU users | High | Medium | Add data export (right of access) and account deletion (right to erasure) features. PII stored only in Supabase Auth — deletable via admin API. |

---

## 14. Glossary

| Term | Definition |
|---|---|
| **BaaS** | Backend-as-a-Service. A cloud computing model providing backend capabilities (auth, database, storage) as a managed service. Supabase is the BaaS used in this project. |
| **Edge Function** | A serverless function that runs on a distributed edge network (in Supabase's case, on Deno Deploy). Executes close to the user with no cold-start latency. |
| **JWT** | JSON Web Token. A compact, signed token used to securely transmit authentication and authorization claims between the client and server. |
| **LCP** | Largest Contentful Paint. A Core Web Vital that measures how long it takes for the largest visible content element on a page to load. |
| **PKCE** | Proof Key for Code Exchange. An OAuth 2.0 security extension that prevents authorization code interception attacks in public clients. |
| **PV** | Photovoltaic. Technology that converts sunlight directly into electricity using semiconductor materials. |
| **R² Score** | Coefficient of Determination. A statistical measure (0 to 1) indicating how well the ML model's predictions match the actual data. A score of 1.0 means perfect predictions. |
| **RMSE** | Root Mean Squared Error. A metric that measures the average magnitude of prediction errors, giving higher weight to large errors. |
| **RLS** | Row Level Security. A Postgres feature (enforced by Supabase) that restricts which rows a user can read, insert, update, or delete based on policy rules. |
| **SPA** | Single Page Application. A web app that dynamically updates content without full page reloads by using JavaScript to render views client-side. |
| **Vite** | A modern frontend build tool that uses native ES modules for an ultra-fast development server with Hot Module Replacement (HMR). |
| **W/m²** | Watts per square meter. The unit of solar irradiance, measuring the power of sunlight hitting a given surface area. |

---

*SolarPredict Pro — Product Requirements Document v1.0 | Confidential & Proprietary | April 2026*
