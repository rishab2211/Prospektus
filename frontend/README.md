# Prospektus — Frontend

This is the Next.js frontend for Prospektus, a personalized video outreach platform (similar to Loom).

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + custom glassmorphic premium UI
- **Icons:** `lucide-react`
- **State/Auth:** React Context (`AuthProvider`)
- **Package Manager:** Bun

## Architecture

### Authentication
We use a custom JWT-based authentication system, fully replacing Clerk.
- **Tokens:** Access token (in memory) + Refresh token (HTTP-only cookie).
- **`AuthProvider` (`src/lib/auth.tsx`):** Manages global authentication state, provides `login`, `signup`, `logout` functions, and automatically handles token refresh in the background.
- **API Wrapper (`src/lib/api.ts`):** All authenticated API calls should use the `apiFetch` wrapper, which automatically attaches the `Authorization: Bearer <token>` header and handles 401 retries with silent token refreshes.
- **Route Protection:** Handled via Next.js middleware (`src/middleware.ts`), which checks for the presence of the `refreshToken` cookie to protect routes and redirect appropriately.

### Key Directories
- `src/app/`: Next.js App Router pages.
  - `(auth)/`: Protected auth pages (sign-in, sign-up) with a custom glassmorphic layout.
  - `dashboard/`: Main application dashboard for authenticated users.
- `src/components/`: Reusable React components (UI elements).
- `src/lib/`: Utilities, authentication logic, and API wrappers.

## Running Locally

1. Install dependencies:
   ```bash
   bun install
   ```
2. Configure `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
3. Start the development server:
   ```bash
   bun dev -p 3001
   ```
   *Note: We run the frontend on port 3001 to avoid conflicts with the backend running on port 3000.*

## Development Guidelines
- Always use `apiFetch` from `src/lib/api.ts` for calls to the backend to ensure tokens are handled correctly.
- UI elements should align with the premium, dark-mode, glassmorphic design system established in the auth pages.
