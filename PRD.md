# Product Requirements Document (PRD): VERTO
**Version:** 2.0  
**Status:** Finalized for Development  
**Tagline:** Lost & Found Campus Platform  
**Objective:** Provide a centralized, secure, and highly responsive platform for students, faculty, and staff to report, browse, and manage lost and found items across campus. Built with a 100% free, serverless, high-performance stack optimized for zero-cost scalability.

---

## 1. Target Audience
| Persona | Primary Goals | Key Constraints |
|---------|---------------|-----------------|
| **Students** | Quickly report lost items, browse found items, recover belongings | Mobile-first usage, variable campus Wi-Fi, limited patience for complex flows |
| **Faculty & Staff** | Report items found in classrooms/offices, verify ownership | Desktop-heavy usage, higher accuracy expectations, institutional email validation |
| **Campus Security/Admin** *(Future)* | Moderate posts, verify high-value returns, generate audit reports | Role-based access, bulk management, compliance logging |

---

## 2. Core Features
### 2.1 Authentication & Session Management
- Secure registration with campus email validation
- Email/password login with JWT-based session handling
- Automatic token refresh & secure logout
- Protected route gating with redirect preservation

### 2.2 Item Management (CRUD)
- Post "Lost" or "Found" items with title, description, location, date, and image
- Visual dashboard feed sorted by recency
- Detailed item view with owner contact & action buttons
- Soft-delete/archive functionality (owner-only)
- Client-side image compression & cloud storage upload

### 2.3 Visuals & UX
- Fully responsive (mobile, tablet, desktop)
- Framer Motion page transitions & micro-interactions
- Global toast notifications for success, error, and loading states
- Skeleton loaders, empty states, and pull-to-refresh on mobile
- Accessible: keyboard navigation, focus rings, reduced motion support

---

## 3. Technical Architecture & Free Stack
| Layer | Technology | Free Tier Limits | Rationale |
|-------|------------|------------------|-----------|
| **Frontend** | React 19 + Vite + TypeScript + Tailwind CSS + React Router 7 | Unlimited | Type safety, rapid UI development, zero bundle bloat |
| **State/HTTP** | TanStack Query + `@supabase/supabase-js` | N/A | Automatic caching, deduping, retry, optimistic updates |
| **Auth** | Supabase Auth | 50k MAU free | Secure JWT, auto-refresh, email verification, bcrypt hashing |
| **Database** | Supabase PostgreSQL | 500MB DB, 2GB bandwidth/mo | ACID compliance, lightning-fast relational queries, Row Level Security |
| **Storage** | Cloudflare R2 | 10GB storage, $0 egress fees | S3-compatible, global CDN, ideal for image-heavy apps |
| **Hosting/API** | Vercel (Serverless + Edge) | 100GB bandwidth, 100GB build hours | Auto-SSL, global CDN, instant deploys, zero-config sleeping |

---

## 4. Page-by-Page Functional Specifications
| Route | Core Components | Functionality & Edge Cases |
|-------|----------------|----------------------------|
| `/` (Landing) | Hero, How It Works, CTA, Footer | Auto-redirect to `/dashboard` if authenticated. Smooth scroll, instant load, clear visual hierarchy. |
| `/auth/register` | Form (Name, Campus Email, Password, Confirm), Toast | Real-time Zod validation, email regex, password strength meter, duplicate check. Auto-login → redirect. |
| `/auth/login` | Form (Email, Password), Forgot Password link | Secure session creation, error handling, loading state. Preserves `?redirect=` param. |
| `/dashboard` | Filter bar, Masonry/Grid feed, Pagination, Skeletons | Sort by `created_at DESC`. Debounced location search. Type toggle (`lost`/`found`). Lazy images. Pull-to-refresh. Click → `/item/:id`. |
| `/post` | Form, Drag & Drop Upload, Preview, Submit | Client-side compression (WebP <500KB). Presigned upload to R2. DB metadata save. Validation on blur/submit. Redirect on success. |
| `/item/:id` | Hero image, Info card, Contact, Actions | Image lightbox. Owner info. Delete/Archive (owner-only, confirm modal). Share (Web Share API + clipboard fallback). Breadcrumb nav. |
| `/my-items` | Tabs (Active/Archived), Item list, Settings | Archive toggle. 3-sec undo delete. Password update. Responsive grid/table. Loading/empty states. |
| `*` (404) | Illustration, Search, Back button | Catches unmatched routes. Preserves session. Auto-focus search. Keyboard accessible. |

---

## 5. Database Schema & Security
### 5.1 PostgreSQL Schema
```sql
-- Extended user profile
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  campus_email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Items
items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  reported_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  image_url TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- Performance Indexes
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_created ON items(created_at DESC);

5.2 Security & Row Level Security (RLS)
Read: CREATE POLICY "Enable read for authenticated" ON items FOR SELECT USING (auth.role() = 'authenticated');
Insert: CREATE POLICY "Enable insert for owner" ON items FOR INSERT WITH CHECK (auth.uid() = user_id);
Update/Delete: CREATE POLICY "Enable update/delete for owner" ON items FOR ALL USING (auth.uid() = user_id);
Soft Delete: UPDATE items SET is_active = false WHERE id = $1 AND user_id = auth.uid();
Client-Side Validation: Zod schemas on all forms. Serverless middleware validates before DB writes.
Rate Limiting: Vercel Edge Middleware limits /api/* to 10 req/min (auth), 30 req/min (posts).*/

6. User Stories
As a student, I want to register and login securely so I can report my lost keys.
As a user, I want to upload a compressed photo of a found wallet so the owner can identify it easily.
As a user, I want to filter/search by location or type to quickly find my lost laptop.
As an owner, I want to archive or delete my post once the item is recovered.
As a mobile user, I want a responsive, fast-loading interface that works on campus Wi-Fi.
7. Free Tier Optimization & Hosting Strategy
Images: Always compress to WebP/AVIF (<500KB). Max width 1080px. Serve via Cloudflare R2 CDN.
Database: Use paginated queries (20/page). Avoid SELECT *. Index frequently filtered columns.
Caching: TanStack Query (staleTime: 5m, gcTime: 10m) + Vercel Edge Cache reduces DB reads by ~80%.
Storage: R2 10GB covers ~20,000 campus item images. Zero egress fees.
Monitoring: Supabase & Vercel built-in dashboards. Email alerts at 80% free tier usage.
Deployment Flow: GitHub → Vercel Auto-Deploy → Connect Env Vars → Supabase Migration → R2 CORS Config.
8. Development Roadmap & Acceptance Criteria
Phase 1: Foundation
Vite + React + TS + Tailwind configured
Supabase project created (Auth, DB, RLS enabled)
Cloudflare R2 bucket created with CORS & presign route
Env vars validated locally
Phase 2: Auth & Core UI
Register/Login with validation, toasts, session persistence
Protected routes with redirect chaining
Responsive layout system + Framer Motion transitions
Phase 3: CRUD & Storage
Post item with client-side compression → R2 upload → DB insert
Dashboard feed with filters, pagination, lazy images
Item detail with lightbox, owner info, delete/archive
My Items tab with undo delete, settings
Phase 4: Polish & Deploy
Empty/error/loading states on all async views
Accessibility audit (keyboard, focus, ARIA)
Lighthouse >90, 3G load <1.5s
Vercel production deploy, cross-browser test
✅ Acceptance Criteria
All pages load <1.5s on 3G simulation
Auth handles expired tokens, network drops, duplicate emails
Only item owners can delete/archive (RLS enforced)
Images compress client-side, upload via R2, display responsively
Dashboard filters, paginates, and shows loading/empty states
Zero paid dependencies. All free tiers sustainable for 10k+ users
9. Future Scope (Post-MVP)
Category filtering (Electronics, Documents, Apparel, etc.)
Real-time in-app messaging (Supabase Realtime + WebSockets)
Email/SMS alerts for matching lost/found pairs
Interactive campus map with GeoJSON pinpoints
Admin moderation dashboard with approval queue & audit logs
PWA support for offline caching & push notifications