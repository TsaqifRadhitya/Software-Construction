import express, { json } from "express";
import { configDotenv } from "dotenv";
import { checkConnection } from "./src/lib/sequalize.js";
import { transactionRouter } from "./src/routes/transaction-routes.js";
import { response } from "./src/utils/response.js";

configDotenv({
    path: ".env"
});

const app = express();
app.use(json());

app.get("/", (req, res) => {
    return res.json(response(undefined, undefined, "Transaction Service"));
});

app.use("/transactions", transactionRouter);

app.listen(3000, async () => {
    await checkConnection();
    console.log("Transaction Service listening on port 3000");
});
