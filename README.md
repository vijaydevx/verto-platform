<div align="center">

<img src="https://img.shields.io/badge/VERTO-CAMPUS%20SANCTUARY-2E7D5B?style=for-the-badge&logo=supabase&logoColor=white" alt="Verto Badge" />

# VERTO 2.0

### Reclaiming what's yours, one campus at a time.
A premium, centralized lost & found platform for campus communities powered by React 19, TypeScript, Supabase, and Framer Motion.

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-VISIT_SITE-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](https://verto-platform-jsa7.vercel.app/)
[![Report Bug](https://img.shields.io/badge/REPORT-BUG-EF4444?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vijaydevx/verto-platform/issues)
[![Request Feature](https://img.shields.io/badge/REQUEST-FEATURE-3B82F6?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vijaydevx/verto-platform/issues)

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?style=for-the-badge&logo=framer&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<hr />

</div>

## Preview

<div align="center">
  <a href="https://verto-platform-jsa7.vercel.app/">verto-platform-jsa7.vercel.app</a>
</div>

<br/>

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
