import { response } from "../utils/response.js"

export const roleMiddleware = (role) => {
    return (req, res, next) => {
        const user = req.user
        if (user.role !== role) {
            return res.status(403).json(response(undefined, undefined, "Unauthorized", 403))
        }
        next()
    }
}
