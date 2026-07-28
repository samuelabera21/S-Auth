import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getCurrentUser } from "./user.controller.js";

const router = Router();

router.get("/me", authenticate, getCurrentUser);

export default router;