# VERTO 2.0
# VERTO CAMPUS SANCTUARY
### Reclaiming what's yours, one campus at a time.
A premium, centralized lost & found platform for campus communities powered by React 19, TypeScript, Supabase, and Framer Motion.

[Live Demo](https://verto-platform-jsa7.vercel.app/)   [Report Bug](https://github.com/vijaydevx/verto-platform/issues)   [Request Feature](https://github.com/vijaydevx/verto-platform/issues)

---

### Preview
[verto-platform-jsa7.vercel.app](https://verto-platform-jsa7.vercel.app/)

### Tech Stack
| Category | Stack |
| :--- | :--- |
| **Frontend** | React 19 + TypeScript 5.8 |
| **Styling** | Tailwind CSS (Premium Modern Aesthetic) |
| **Animation** | Framer Motion / Motion |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Build** | Vite 6 |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

### Sections
| # | Section | Highlights |
| :--- | :--- | :--- |
| 1 | **Landing** | Cinematic hero with background video, music player, and atmospheric haze. |
| 2 | **Dashboard** | Live campus feed with advanced filtering, real-time search, and community stats. |
| 3 | **Post Item** | 3-step publishing flow with image compression and campus auto-linking. |
| 4 | **Item Detail** | Deep-dive view with image galleries, claim system, and engagement tracking. |
| 5 | **My Items** | Personalized management dashboard for tracking your reported items. |
| 6 | **Profile** | Verified campus identity management and notification settings. |

### Effects System
*   **Atmospheric Haze** ........... Multi-plane depth system for the landing page
*   **Smooth Transitions** ........ Page-level transitions using Framer Motion
*   **Background Music** .......... Floating glassmorphism player with spatial audio feel
*   **Image Compression** ........ Client-side WebP optimization for lightning uploads
*   **Campus Scoping** ............ Automatic RLS-based filtering for your specific university
*   **Glassmorphism** .............. Modern translucent UI components with backdrop blur
*   **Responsive Engine** ......... Seamless experience from mobile to ultra-wide displays
*   **Smart Matching** ............. Proactive notification system for potential item matches

### Quick Start
```bash
# Clone
git clone https://github.com/vijaydevx/verto-platform.git
cd verto-platform

# Install
npm install

# Dev
npm run dev        # → http://localhost:5173

# Build
npm run build      # → dist/

# Preview
npm run preview
```

### Project Structure
```text
verto-platform/
├── src/
│   ├── components/       # Reusable UI & Layout components
│   ├── hooks/            # Custom hooks (Auth, Items, Upload, Debounce)
│   ├── lib/              # API clients and utility functions
│   ├── pages/            # Main application views (Dashboard, Post, Detail)
│   ├── providers/        # Context providers (Auth, Theme)
│   └── types/            # TypeScript definitions
├── api/                  # Serverless functions (Vercel)
├── supabase/             # Database migrations & RLS policies
├── public/               # Static assets (music.mp3, campus-hero.png)
├── index.html
├── vite.config.ts
└── tsconfig.json
```

### Deploy
**Vercel (recommended)** — Import from GitHub, auto-detects Vite, zero config. Ensure all environment variables from `.env.local` are added to the Vercel project settings.

### License
MIT

**Built with ❤️ for the campus community by [@vijaydevx](https://github.com/vijaydevx)**
