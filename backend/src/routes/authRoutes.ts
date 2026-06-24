import { Router } from "express";
import { signup, signin, refresh, logout } from "../controllers/authControllers";

export const authRoutes = Router();

// Public auth endpoints (no middleware needed)
authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", logout);