import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getMe, updateMe, getSettings, updateSettings, verifyAccessToWorkspace, getNotifications } from "../controllers/userControllers";

export const userRoutes = Router();

// All user routes require authentication
userRoutes.use(authMiddleware);

userRoutes.get("/me", getMe);
userRoutes.patch("/me", updateMe);
userRoutes.get("/me/settings", getSettings);
userRoutes.patch("/me/settings", updateSettings);
userRoutes.get("/workspace/:workspaceId/access", verifyAccessToWorkspace);
userRoutes.get("/notification",getNotifications)
