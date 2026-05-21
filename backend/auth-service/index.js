import express, { json } from "express";
import { configDotenv } from "dotenv";
import { checkConnection } from "./src/repository/sequelize.js";
import { initSeeder } from "./src/repository/user-repository.js";
import { authRouter } from "./src/routes/auth-routes.js";
import { userRouter } from "./src/routes/user-routes.js";

configDotenv();

const app = express();
app.use(json());

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(3001, async () => {
    await checkConnection();
    await initSeeder();
    console.log("Auth Service listening on port 3001");
});
