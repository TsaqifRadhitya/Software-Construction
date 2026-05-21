<?php

namespace App\Interfaces;

interface ProductRepositoryInterface
{
    public function getAllPaginated(int $limit, ?string $ids = null);
    public function getById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
