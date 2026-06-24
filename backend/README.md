# Prospektus — Backend

This is the Express backend and API server for Prospektus, providing REST API endpoints and real-time Socket.IO capabilities for the platform.

## Tech Stack
- **Framework:** Express + TypeScript
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma
- **Authentication:** Custom JWT (JSON Web Tokens) + `bcrypt-ts`
- **Package Manager:** Bun

## Architecture

### Database Schema (Prisma)
- **User:** Stores user details, hashed password, and relates to Workspaces, Subscriptions, etc.
- **RefreshToken:** securely tracks long-lived refresh tokens for token rotation.
- **WorkSpace & Folder:** Organization hierarchy for videos.
- **Video:** Stores metadata for uploaded/streamed videos.
- **Media:** User settings for their studio/recording preferences (screen, mic, camera, preset).

### Authentication System
Replaces Clerk with a robust custom implementation:
1. **Signup/Signin:** Generates both an Access Token (15m expiry) and a Refresh Token (7d expiry).
2. **Token Storage:** Access tokens are returned in the JSON response; Refresh tokens are set as `httpOnly` secure cookies.
3. **Middleware (`src/middleware/authMiddleware.ts`):** Protects routes by validating the `Authorization: Bearer <token>` header.
4. **Token Rotation (`/api/auth/refresh`):** Replaces the old refresh token with a new one to prevent replay attacks and maintain a continuous session.

### API Routes
- `/api/auth/*`: Public endpoints for `signup`, `signin`, `refresh`, and `logout`.
- `/api/users/*`: Protected endpoints (require valid JWT) for fetching/updating user profiles and media settings (`/me`, `/me/settings`).

## Running Locally

1. Install dependencies:
   ```bash
   bun install
   ```
2. Configure `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   ACCESS_TOKEN_SECRET=your_access_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   FRONTEND_URL=http://localhost:3001
   ```
3. Sync Database schema:
   ```bash
   bunx prisma generate
   bunx prisma db push
   ```
4. Start the development server:
   ```bash
   bun dev
   ```
   *Runs on `http://localhost:3000`.*

## Future Implementation
- **Socket.IO:** Will be integrated for real-time video chunk uploading from the Electron desktop app.
- **AI Processing:** Whisper and OpenAI integrations for automatic transcription and summarization of videos.
