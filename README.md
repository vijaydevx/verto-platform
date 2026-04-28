# VERTO 2.0 🚀

**Verto** is a centralized, secure, and highly responsive platform designed for campus communities. It allows students, faculty, and staff to report, browse, and recover lost and found items with ease.

Built with a 100% free, serverless, high-performance stack, Verto is optimized for zero-cost scalability and a premium user experience.

![Verto Banner](https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1200)

## ✨ Key Features

- **Secure Authentication**: Campus email validation and JWT-based session management via Supabase.
- **Smart Item Management**: Report lost/found items with title, description, location, and images.
- **Advanced UI/UX**: Fully responsive design with Framer Motion transitions and professional styling.
- **Performance Optimized**: Client-side image compression (WebP) and lightning-fast database queries.
- **Secure by Design**: Row Level Security (RLS) ensures only owners can manage their posts.

## 🛠️ Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, React Router 7 |
| **State Management** | TanStack Query |
| **Backend/Auth** | Supabase (PostgreSQL, Auth, RLS) |
| **Storage** | Cloudflare R2 (S3-compatible, $0 egress) |
| **Deployment** | Vercel (Serverless + Edge) |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- A Supabase project
- A Cloudflare R2 bucket (optional for local dev if mocked)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vijaydevx/verto-platform.git
   cd verto-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   # Add other required variables as per PRD
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/`: Core application logic, components, and pages.
- `api/`: Serverless functions (Vercel).
- `supabase/`: Database migrations and configuration.
- `public/`: Static assets.

## 🛡️ License

This project is private and intended for campus use.

---

Built with ❤️ for the campus community by [vijaydevx](https://github.com/vijaydevx).
