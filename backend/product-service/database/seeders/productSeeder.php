<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class productSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete existing database file for clean slate
        $dbPath = database_path('database.sqlite');
        if (file_exists($dbPath)) {
            unlink($dbPath);
            echo "✓ Deleted existing database file\n";
        }

        // Create new empty database file
        touch($dbPath);
        echo "✓ Created new database file\n";

        // Run migrations to create tables
        \Artisan::call('migrate:fresh', ['--force' => true]);
        echo "✓ Database tables created\n";

        // Create products owned by admin (user_id: 1) and users (user_id: 2, 3, 4)
        // These products are referenced in transaction-service seeder
        
        $products = [
            [
                "name" => "Laptop Gaming ROG",
                "description" => "Laptop gaming ASUS ROG dengan processor Intel Core i7, RAM 16GB, SSD 512GB, RTX 3060",
                "stock" => 15,
                "price" => 18000000,
                "user_id" => 1 // Admin
            ],
            [
                "name" => "Smartphone Samsung Galaxy S23",
                "description" => "Samsung Galaxy S23 5G, 8GB RAM, 256GB Storage, Kamera 50MP",
                "stock" => 25,
                "price" => 12000000,
                "user_id" => 1 // Admin
            ],
            [
                "name" => "Mechanical Keyboard RGB",
                "description" => "Keyboard mechanical dengan switch blue, RGB backlight, anti-ghosting",
                "stock" => 40,
                "price" => 850000,
                "user_id" => 2 // John Doe
            ],
            [
                "name" => "Wireless Mouse Gaming",
                "description" => "Mouse gaming wireless dengan DPI adjustable hingga 16000, RGB lighting",
                "stock" => 50,
                "price" => 450000,
                "user_id" => 2 // John Doe
            ],
            [
                "name" => "Monitor 27 inch 144Hz",
                "description" => "Monitor gaming 27 inch, refresh rate 144Hz, IPS panel, Full HD",
                "stock" => 20,
                "price" => 3500000,
                "user_id" => 3 // Jane Smith
            ],
            [
                "name" => "Headset Gaming 7.1",
                "description" => "Headset gaming dengan surround sound 7.1, noise cancelling microphone",
                "stock" => 35,
                "price" => 650000,
                "user_id" => 3 // Jane Smith
            ],
            [
                "name" => "Webcam Full HD 1080p",
                "description" => "Webcam untuk streaming dan video call, Full HD 1080p, auto focus",
                "stock" => 30,
                "price" => 750000,
                "user_id" => 4 // Bob Wilson
            ],
            [
                "name" => "SSD External 1TB",
                "description" => "SSD External portable 1TB, USB 3.2 Gen 2, kecepatan baca 1000MB/s",
                "stock" => 45,
                "price" => 1500000,
                "user_id" => 4 // Bob Wilson
            ],
            [
                "name" => "Power Bank 20000mAh",
                "description" => "Power bank fast charging 20000mAh, support PD dan QC 3.0",
                "stock" => 60,
                "price" => 350000,
                "user_id" => 1 // Admin
            ],
            [
                "name" => "USB Hub 7 Port",
                "description" => "USB Hub 7 port dengan USB 3.0, termasuk charging port",
                "stock" => 55,
                "price" => 250000,
                "user_id" => 2 // John Doe
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        echo "✓ Successfully seeded " . count($products) . " products\n";
        echo "\nSeeded products:\n";
        foreach ($products as $index => $product) {
            echo "  " . ($index + 1) . ". {$product['name']} - Rp " . number_format($product['price'], 0, ',', '.') . " (Stock: {$product['stock']}, Owner: User ID {$product['user_id']})\n";
        }
    }
}
