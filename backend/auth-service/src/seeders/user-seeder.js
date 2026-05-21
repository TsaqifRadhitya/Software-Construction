import bcrypt from "bcryptjs";
import { User } from "../repository/user-repository.js";
import { sequelize } from "../repository/sequelize.js";
import fs from "fs";
import path from "path";

export const seedUsers = async () => {
    try {
        // Delete existing database file for clean slate
        const dbPath = path.resolve(process.cwd(), "auth.sqlite");
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log("✓ Deleted existing database file");
        }

        await sequelize.authenticate();
        console.log("Database connection established.");

        // Sync database (will create new tables)
        await User.sync({ force: true });
        console.log("User table created.");

        // Hash passwords
        const hashedPassword = await bcrypt.hash("password123", 10);
        const hashedUserPassword = await bcrypt.hash("user123", 10);

        // Create users
        const users = await User.bulkCreate([
            {
                nama: "Administrator",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin"
            },
            {
                nama: "John Doe",
                email: "john@example.com",
                password: hashedUserPassword,
                role: "user"
            },
            {
                nama: "Jane Smith",
                email: "jane@example.com",
                password: hashedUserPassword,
                role: "user"
            },
            {
                nama: "Bob Wilson",
                email: "bob@example.com",
                password: hashedUserPassword,
                role: "user"
            }
        ]);

        console.log(`✓ Successfully seeded ${users.length} users`);
        console.log("\nSeeded users:");
        console.log("- admin@example.com (password: password123) - Role: admin");
        console.log("- john@example.com (password: user123) - Role: user");
        console.log("- jane@example.com (password: user123) - Role: user");
        console.log("- bob@example.com (password: user123) - Role: user");

    } catch (error) {
        console.error("Error seeding users:", error);
        throw error;
    }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedUsers()
        .then(() => {
            console.log("\n✓ Seeding completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("\n✗ Seeding failed:", error);
            process.exit(1);
        });
}
