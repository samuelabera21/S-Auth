import { Request, Response } from "express";
import { env } from "../config/env.js";

export const getCurrentUser = async (
  req: Request,
  res: Response
) => {
  res.json({
    success: true,
    data: req.user,
  });
};

