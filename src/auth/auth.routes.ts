import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  getSessions,
  revokeSession,
  google,
  googleCallback,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import passport from "../config/passport.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.post("/logout-all", authenticate, logoutAll);

router.get("/sessions", authenticate, getSessions);

router.delete(
  "/sessions/:sessionId",
  authenticate,
  revokeSession
);

router.get("/google", google);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);

router.get("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;