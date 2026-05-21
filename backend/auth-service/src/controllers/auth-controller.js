import { loginUser, registerUser, validateToken } from "../services/auth-service.js";

export const register = async (req, res) => {
    if (!req.body || req.body === undefined) {
        return res.status(400).json({ error: "Validation Exception", name: "required" });
    }
    const { nama, email, password } = req.body;
    if (!nama || !email || !password) {
        return res.status(400).json({ error: "Validation Exception", name: "All fields are required" });
    }

    try {
        const { token } = await registerUser(nama, email, password);
        res.status(201).json({ data: { token } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    if (!req.body || req.body === undefined) {
        return res.status(400).json({ error: "Validation Exception", name: "required" });
    }
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Validation Exception", name: "Email and password are required" });

    try {
        const token = await loginUser(email, password);
        res.json({ data: { token } });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

export const validate = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Malformed token" });
    
    try {
        const decoded = await validateToken(token);
        res.set('X-User-Id', decoded.id);
        return res.status(200).send();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
