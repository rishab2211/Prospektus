import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret-change-me";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret-change-me";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export interface TokenPayload {
    userId: string;
    email: string;
}

/**
 * Generate a short-lived access token (15 minutes).
 * Used in Authorization header for every authenticated API call.
 */
export const generateAccessToken = (userId: string, email: string): string => {
    return jwt.sign({ userId, email }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};

/**
 * Generate a long-lived refresh token (7 days).
 * Stored in DB and sent as HTTP-only cookie.
 * Used to get new access tokens without re-login.
 */
export const generateRefreshToken = (userId: string, email: string): string => {
    return jwt.sign({ userId, email }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
};

/**
 * Verify and decode an access token.
 * Returns the decoded payload or throws an error if invalid/expired.
 */
export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
};

/**
 * Verify and decode a refresh token.
 * Returns the decoded payload or throws an error if invalid/expired.
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
};

/**
 * Returns the expiry date for a refresh token (7 days from now).
 * Used when inserting into the RefreshToken table.
 */
export const getRefreshTokenExpiry = (): Date => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return expiry;
};
