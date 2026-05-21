<?php

namespace App\Interfaces;

interface ProductServiceInterface
{
    public function listProducts(int $limit, ?string $ids = null, ?string $authHeader = null);
    public function getProduct(int $id, ?string $authHeader = null);
    public function createProduct(array $data);
    public function updateProduct(int $id, array $data);
    public function deleteProduct(int $id);
}
