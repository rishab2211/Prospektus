import { type Request, type Response, type NextFunction } from "express";
import { verifyAccessToken, type TokenPayload } from "../lib/jwt";

/**
 * Extend Express Request to include the authenticated user's data.
 * After this middleware runs, req.user is available in all route handlers.
 */
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

/**
 * Auth middleware — protects routes by verifying JWT access tokens.
 *
 * Flow:
 *   1. Extract "Bearer <token>" from the Authorization header
 *   2. Verify the JWT signature and expiry
 *   3. Attach { userId, email } to req.user
 *   4. Call next() → request proceeds to the route handler
 *
 * If the token is missing, invalid, or expired → 401 Unauthorized.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Access token is required" });
        return;
    }

    const token = authHeader.split(" ")[1] as string;

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired access token" });
        return;
    }
};
