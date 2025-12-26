import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// POST /auth/register - Traveller signup
router.post("/register", register);

// POST /auth/login - User login
router.post("/login", login);

// GET /auth/me - Get current user
router.get("/me", authenticateToken, getMe);

export default router;

