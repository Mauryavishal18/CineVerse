import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { env } from "../config/env";
import { blacklistToken } from "../middleware/auth.middleware";
import { AuthRequest } from "../types";

const generateToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    issuer: "cineverse-api",
    audience: "cineverse-client",
  } as jwt.SignOptions);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(409).json({ success: false, message: "Email already registered." });
      return;
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = generateToken(user._id.toString(), user.email);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("[register error]", error);
    res.status(500).json({ success: false, message: "Registration failed. Try again." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+password +loginAttempts +lockUntil"
    );

    // user nahi mila — same error message, attacker ko pata na chale
    if (!user) {
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 200)); // timing attack mitigation
      res.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    // account locked check
    if (user.isLocked()) {
      res.status(423).json({
        success: false,
        message: "Account temporarily locked due to too many failed attempts. Try again in 15 minutes.",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incrementLoginAttempts();
      res.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    // successful login — counter reset karo
    await user.resetLoginAttempts();

    const token = generateToken(user._id.toString(), user.email);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("[login error]", error);
    res.status(500).json({ success: false, message: "Login failed. Try again." });
  }
};

export const logout = (req: AuthRequest, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    blacklistToken(token);
  }
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password -__v -loginAttempts -lockUntil");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("[getMe error]", error);
    res.status(500).json({ success: false, message: "Could not fetch user." });
  }
};
