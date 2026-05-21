import jwt from "jsonwebtoken";
import { response } from "../utils/response.js";
import { User } from "../repository/user-repository.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const secret = process.env.SECRET || 'supersecret';
    if (!authHeader) {
        return res.status(401).json(response(undefined, undefined, "Unauthenticated", 401));
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json(response(undefined, undefined, "Unauthenticated", 401));
        }
        req.user = user;
    } catch (e) {
        return res.status(401).json(response(undefined, undefined, "Unauthenticated", 401));
    }
    next();
};
