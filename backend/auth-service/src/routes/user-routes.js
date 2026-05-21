import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { roleMiddleware } from "../middleware/role-middleware.js";
import { getMe, listUsers, getUser, create, update, remove } from "../controllers/user-controller.js";

export const userRouter = Router();

userRouter.get("/me", authMiddleware, getMe);
userRouter.get("/", authMiddleware, listUsers);
userRouter.get("/:id", authMiddleware, getUser);
userRouter.post("/create", authMiddleware, roleMiddleware("admin"), create);
userRouter.put("/:id/update", authMiddleware, roleMiddleware("admin"), update);
userRouter.delete("/:id/delete", authMiddleware, roleMiddleware("admin"), remove);
