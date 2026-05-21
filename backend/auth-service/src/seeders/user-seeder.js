import bcrypt from "bcryptjs";
import { User } from "../repository/user-repository.js";
import { sequelize } from "../repository/sequelize.js";

export const seedUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established.");

        // Sync database
        await User.sync({ alter: true });
        console.log("User table synced.");

        // Check if users already exist
        const count = await User.count();
        if (count > 0) {
            console.log(`Database already has ${count} user(s). Skipping seeding.`);
            return;
        }

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
