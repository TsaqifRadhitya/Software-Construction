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
        Product::create([
            "name" => "buku",
            "description" => "buku tulis",
            "stock" => 10,
            "price" => 3000,
            "user_id" => 1
        ]);
    }
}
