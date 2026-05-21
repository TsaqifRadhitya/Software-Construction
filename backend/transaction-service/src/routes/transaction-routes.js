import { Router } from "express";
import { authMiddleware } from "../middleware/auth-midleware.js";
import { listTransactions, create, getTransaction } from "../controllers/transaction-controller.js";

export const transactionRouter = Router();

transactionRouter.get("/", authMiddleware, listTransactions);
transactionRouter.post("/", authMiddleware, create);
transactionRouter.get("/:id", authMiddleware, getTransaction);
