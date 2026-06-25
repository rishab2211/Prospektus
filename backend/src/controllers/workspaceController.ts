import { type Request, type Response } from "express";
import { client } from "../lib/prisma";

export const getWorkspaceFolders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const workspaceId = req.params.workspaceId;

    const isFolders = await client.folder.findMany({
      where: {
        workspaceId: workspaceId as string,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (isFolders && isFolders.length > 0) {
      return res.status(200).json({ data: isFolders });
    }

    return res.status(404).json({ data: [] });
  } catch (error) {
    console.log(error);
  }
};

export const getAllUserVideos = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;

    const storedVideos = await client.video.findMany({
      where: {
        workspaceId: workspaceId,
        OR: [
          {
            folderId: workspaceId,
          },
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            id: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (storedVideos && storedVideos.length > 0) {
      return res.status(200).json({ data: storedVideos });
    }

    return res.status(404).json({ data: [] });
  } catch (error) {
    console.log(error);
  }
};

export const getAllWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const workspaces = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members:{
            select:{
                workspace:{
                    select:{
                        id:true,
                        name:true,
                        type:true,
                        
                    }
                }

            }
        }
      },
    });

    if (workspaces) {
      return res.status(200).json({ data: workspaces });
    }

    return res.status(404).json({ data: [] });
  } catch (error) {
    console.log(error);
  }
};
