import { Router } from "express";
import { signup,signin } from "../controllers/authControllers";

export const authRoutes = Router();

authRoutes.post("/signup",signup);
authRoutes.post("/signin",signin);