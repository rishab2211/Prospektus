import { type Request, type Response } from "express";
import { client } from "../lib/prisma";

// GET ME
// GET /api/users/me
// Returns the current user's full profile with workspaces, subscription, and media settings
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        trial: true,
        createdAt: true,
        studio: true,
        workspace: {
          include: {
            folders: true,
            members: true,
          },
        },
        subscription: true,
        notification: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE ME
// PATCH /api/users/me
// Update the current user's profile (name, image)
export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { name, image } = req.body;

    const updatedUser = await client.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Update me error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET SETTINGS
// GET /api/users/me/settings
// Get the user's media/studio settings (screen, mic, camera, preset)
// Used by the Electron app to load device preferences
export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const media = await client.media.findUnique({
      where: { userId },
    });

    return res.status(200).json({ settings: media });
  } catch (error) {
    console.error("Get settings error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE SETTINGS
// PATCH /api/users/me/settings
// Update the user's media/studio settings
// Creates the Media record if it doesn't exist (upsert)
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { screen, mic, camera, preset } = req.body;

    const media = await client.media.upsert({
      where: { userId },
      update: {
        ...(screen !== undefined && { screen }),
        ...(mic !== undefined && { mic }),
        ...(camera !== undefined && { camera }),
        ...(preset !== undefined && { preset }),
      },
      create: {
        userId,
        screen,
        mic,
        camera,
        preset: preset || "SD",
      },
    });

    return res.status(200).json({ settings: media });
  } catch (error) {
    console.error("Update settings error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}; // VERIFY WORKSPACE ACCESS
// GET /api/users/workspace/:workspaceId/access
// Checks if the authenticated user owns or is a member of the workspace
export const verifyAccessToWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const workspaceId = req.params.workspaceId as string;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }

    // Check if user is either the workspace owner OR an active member
    const hasAccess = await client.workSpace.findFirst({
      where: {
        id: workspaceId,
        OR: [
          { userId },
          {
            members: {
              some: {
                userId,
                member: true,
              },
            },
          },
        ],
      },
    });

    if (!hasAccess) {
      return res
        .status(403)
        .json({ error: "You do not have access to this workspace" });
    }

    return res.status(200).json({ status: 200, message: "Authorized" });
  } catch (error) {
    console.error("Verify workspace access error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const notification = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });

    if (notification) {
      return res.status(200).json({ data: notification });
    }

    return res.status(404).json({ data: [] });
  } catch (err) {
    console.log(err);
  }
};
