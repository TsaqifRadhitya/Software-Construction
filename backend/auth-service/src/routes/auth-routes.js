import { Router } from "express";
import { login, register, validate } from "../controllers/auth-controller.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/validate", validate);
