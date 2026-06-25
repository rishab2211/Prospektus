import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getWorkspaceFolders, getAllUserVideos, getAllWorkspaces } from "../controllers/workspaceController";

export const workspaceRoutes = Router();

// All workspace routes require authentication
workspaceRoutes.use(authMiddleware);

workspaceRoutes.get("/", getAllWorkspaces);
workspaceRoutes.get("/:workspaceId/folders", getWorkspaceFolders);
workspaceRoutes.get("/:workspaceId/videos", getAllUserVideos);
