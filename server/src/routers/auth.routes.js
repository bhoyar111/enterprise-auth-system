import { Router } from "express";
import {
	register,
	login,
	currentUser,
	logout,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, currentUser);
router.post("/logout", logout);

export default router;