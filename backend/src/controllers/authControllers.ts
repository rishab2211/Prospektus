import { type Request, type Response } from "express";
import { client } from "../lib/prisma";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from "../lib/jwt";

// Cookie options for refresh tokens
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true, // Not accessible from JavaScript (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: "/",
};

// SIGNUP
// POST /api/auth/signup
// Creates user + personal workspace + FREE subscription + issues JWT tokens
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await client.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    // Hash password
    const salt = genSaltSync(10);
    const hashedPass = hashSync(password, salt);

    // Create user + personal workspace + FREE subscription in a single transaction
    const newUser = await client.user.create({
      data: {
        name,
        email,
        hashedPass,
        // Create a default personal workspace
        workspace: {
          create: {
            name: "Personal Workspace",
            type: "PERSONAL",
          },
        },
        // Create a default FREE subscription
        subscription: {
          create: {
            plan: "FREE",
          },
        },
      },
      include: {
        workspace: true,
        subscription: true,
      },
    });

    // Generate JWT tokens
    const accessToken = generateAccessToken(newUser.id, newUser.email);
    const refreshToken = generateRefreshToken(newUser.id, newUser.email);

    // Store refresh token in DB for validation & rotation
    await client.refreshToken.create({
      data: {
        token: refreshToken,
        userId: newUser.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(201).json({
      accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        workspace: newUser.workspace,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// SIGNIN
// POST /api/auth/signin
// Validates credentials + issues JWT tokens
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await client.user.findUnique({
      where: { email },
      include: {
        workspace: true,
        subscription: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password (user must have hashedPass — not a Google OAuth user)
    if (!user.hashedPass) {
      return res
        .status(400)
        .json({ error: "This account uses Google sign-in" });
    }

    const isPasswordValid = compareSync(password, user.hashedPass);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    // Store refresh token in DB
    await client.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        workspace: user.workspace,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// REFRESH TOKEN
// POST /api/auth/refresh
// Rotates refresh token: old token → deleted, new tokens → issued
// This keeps the user logged in without re-entering credentials
export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    // Verify the JWT signature + expiry
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      // Clear the invalid cookie
      res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    // Check if this token exists in DB (prevents reuse of revoked tokens)
    const storedToken = await client.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      // Token was revoked or expired — clear cookie and force re-login
      res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
      // If token exists but expired, delete it from DB
      if (storedToken) {
        await client.refreshToken.delete({ where: { id: storedToken.id } });
      }
      return res
        .status(401)
        .json({ error: "Refresh token expired or revoked" });
    }

    // ── Token Rotation ──
    // Delete old refresh token (single-use: prevents replay attacks)
    // Use deleteMany to avoid P2025 error if a concurrent request already deleted it
    const deleted = await client.refreshToken.deleteMany({ where: { id: storedToken.id } });

    if (deleted.count === 0) {
      // Another request already consumed this token — possible replay attack or race condition
      res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
      return res.status(401).json({ error: "Refresh token already used" });
    }

    // Issue new token pair
    const newAccessToken = generateAccessToken(decoded.userId, decoded.email);
    const newRefreshToken = generateRefreshToken(decoded.userId, decoded.email);

    // Store new refresh token in DB
    await client.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.userId,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// LOGOUT
// POST /api/auth/logout
// Deletes the refresh token from DB + clears the cookie
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      // Delete the refresh token from DB (revoke it)
      await client.refreshToken.deleteMany({
        where: { token },
      });
    }

    // Clear the cookie regardless
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
