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
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/auth", authRoutes);

app.use(
  session({
    secret: "google-auth-session",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

export default app;