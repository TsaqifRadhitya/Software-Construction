import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../repository/user-repository.js";

export const registerUser = async (nama, email, password, role = "user") => {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
        throw new Error("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        nama,
        email,
        password: hashedPassword,
        role
    });

    const secret = process.env.SECRET || 'supersecret';
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });
    
    return { user, token };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const secret = process.env.SECRET || 'supersecret';
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });
    
    return token;
};

export const validateToken = async (token) => {
    const secret = process.env.SECRET || 'supersecret';
    const decoded = jwt.verify(token, secret);
    return decoded;
};
