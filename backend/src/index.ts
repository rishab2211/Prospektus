import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoutes";

const app = express();
const port = process.env.PORT || 3000;

// Middleware

// CORS — allow frontend to send cookies (credentials: true)
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3001",
        credentials: true,
    })
);

// Parse JSON request bodies
app.use(express.json());

// Parse cookies (needed for refresh token in HTTP-only cookie)
app.use(cookieParser());

// Routes

// Health check
app.get("/", (req: Request, res: Response) => {
    res.send("Express + Typescript running");
});

// Auth routes (public) — signup, signin, refresh, logout
app.use("/api/auth", authRoutes);

// User routes (protected) — requires valid JWT access token
app.use("/api/users", userRoutes);

// Start Server

app.listen(port, () => {
    console.log("====================================");
    console.log(`Server running on port ${port}!`);
    console.log("====================================");
});