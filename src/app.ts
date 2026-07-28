import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./user/user.routes.js";

import session from "express-session";
import passport from "./config/passport.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  session({
    secret: "google-auth-session",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Server error:", err);

    const message =
      typeof err?.message === "string" ? err.message : "Internal server error";

    const statusCode =
      typeof err?.statusCode === "number"
        ? err.statusCode
        : err?.message
          ? 400
          : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
);

export default app;