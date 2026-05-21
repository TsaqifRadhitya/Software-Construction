import { configDotenv } from "dotenv"
import { response } from "../utils/response.js"

configDotenv({
    path: ".env"
})

export const authMiddleware = (req, res, next) => {
    const userId = req.headers["x-user-id"]
    if (!userId) {
        return res.status(401).json(response(undefined, undefined, "Unauthenticated", 401))
    }
    try {
        req.user = { id: parseInt(userId) }
    } catch (e) {
        return res.status(401).json(response(undefined, undefined, "Unauthenticated", 401))
    }
    next()
}
