<?php

namespace App\Services;

use App\Interfaces\ProductServiceInterface;
use App\Interfaces\ProductRepositoryInterface;
use Illuminate\Support\Facades\Http;

class ProductService implements ProductServiceInterface
{
    protected $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function listProducts(int $limit, ?string $ids = null, ?string $authHeader = null)
    {
        $products = $this->productRepository->getAllPaginated($limit, $ids);

        // Horizontal fetch
        $userIds = $products->pluck('user_id')->filter()->unique()->implode(',');
        $usersMap = [];
        if ($userIds) {
            try {
                $response = Http::withHeaders(array_filter([
                    'Authorization' => $authHeader
                ]))->timeout(3)->get("http://auth_service:3001/users?ids={$userIds}");
                if ($response->successful()) {
                    $users = $response->json('data.rows') ?? [];
                    foreach ($users as $user) {
                        $usersMap[$user['id']] = $user;
                    }
                }
            } catch (\Exception $e) {
                // Return null owner if service is down
            }
        }

        $products->getCollection()->transform(function ($product) use ($usersMap) {
            $product->setAttribute('owner', $usersMap[$product->user_id] ?? null);
            return $product;
        });

        return $products;
    }

    public function getProduct(int $id, ?string $authHeader = null)
    {
        $product = $this->productRepository->getById($id);
        
        if ($product && $product->user_id) {
            $owner = null;
            try {
                $response = Http::withHeaders(array_filter([
                    'Authorization' => $authHeader
                ]))->timeout(3)->get("http://auth_service:3001/users/{$product->user_id}");
                if ($response->successful()) {
                    $owner = $response->json('data') ?? null;
                }
            } catch (\Exception $e) {
                // service down, owner is null
            }
            $product->setAttribute('owner', $owner);
        }

        return $product;
    }

    public function createProduct(array $data)
    {
        return $this->productRepository->create($data);
    }

    public function updateProduct(int $id, array $data)
    {
        return $this->productRepository->update($id, $data);
    }

    public function deleteProduct(int $id)
    {
        return $this->productRepository->delete($id);
    }
}
