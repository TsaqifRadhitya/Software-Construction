import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";
import bcrypt from "bcryptjs";

export const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(["admin", "user"])
    }
}, {
})

User.sync({
    alter: true
})

export const initSeeder = async () => {
    try {
        const count = await User.count();
        if (count === 0) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            await User.create({
                nama: "Administrator",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin"
            });
            console.log("Admin seeder ran successfully.");
        }
    } catch (err) {
        console.error("Seeder failed:", err);
    }
};
