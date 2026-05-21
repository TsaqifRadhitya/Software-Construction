import { Transaction } from "../repository/transaction-repository.js";
import { sequelize } from "../lib/sequalize.js";
import fs from "fs";
import path from "path";

export const seedTransactions = async () => {
    try {
        // Delete existing database file for clean slate
        const dbPath = path.resolve(process.cwd(), "database.sqlite");
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log("✓ Deleted existing database file");
        }

        await sequelize.authenticate();
        console.log("Database connection established.");

        // Sync database (will create new tables)
        await Transaction.sync({ force: true });
        console.log("Transaction table created.");

        // Create sample transactions
        // Note: user_id references users from auth-service (1=admin, 2-4=users)
        // product_id references products from product-service
        // amount should match or be close to product prices
        const transactions = await Transaction.bulkCreate([
            {
                amount: 18000000, // Laptop Gaming ROG
                product_id: 1,
                user_id: 2 // John Doe
            },
            {
                amount: 12000000, // Samsung Galaxy S23
                product_id: 2,
                user_id: 2 // John Doe
            },
            {
                amount: 850000, // Mechanical Keyboard RGB
                product_id: 3,
                user_id: 3 // Jane Smith
            },
            {
                amount: 450000, // Wireless Mouse Gaming
                product_id: 4,
                user_id: 3 // Jane Smith
            },
            {
                amount: 3500000, // Monitor 27 inch 144Hz
                product_id: 5,
                user_id: 4 // Bob Wilson
            },
            {
                amount: 650000, // Headset Gaming 7.1
                product_id: 6,
                user_id: 4 // Bob Wilson
            },
            {
                amount: 750000, // Webcam Full HD 1080p
                product_id: 7,
                user_id: 2 // John Doe
            },
            {
                amount: 1500000, // SSD External 1TB
                product_id: 8,
                user_id: 3 // Jane Smith
            },
            {
                amount: 350000, // Power Bank 20000mAh
                product_id: 9,
                user_id: 4 // Bob Wilson
            },
            {
                amount: 250000, // USB Hub 7 Port
                product_id: 10,
                user_id: 2 // John Doe
            },
            {
                amount: 18000000, // Laptop Gaming ROG (repeat purchase)
                product_id: 1,
                user_id: 4 // Bob Wilson
            },
            {
                amount: 850000, // Mechanical Keyboard RGB (repeat purchase)
                product_id: 3,
                user_id: 2 // John Doe
            }
        ]);

        console.log(`✓ Successfully seeded ${transactions.length} transactions`);
        console.log("\nSeeded transactions:");
        transactions.forEach((t, index) => {
            console.log(`  ${index + 1}. Transaction ID: ${t.id}, Amount: Rp ${t.amount.toLocaleString('id-ID')}, Product: ${t.product_id}, User: ${t.user_id}`);
        });

    } catch (error) {
        console.error("Error seeding transactions:", error);
        throw error;
    }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedTransactions()
        .then(() => {
            console.log("\n✓ Seeding completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("\n✗ Seeding failed:", error);
            process.exit(1);
        });
}
