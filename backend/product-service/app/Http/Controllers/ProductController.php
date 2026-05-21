<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Interfaces\ProductServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductServiceInterface $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     * GET /api/v1/products
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 10);
        $ids = $request->query('ids');
        $authHeader = $request->header('Authorization');
        $products = $this->productService->listProducts($limit, $ids, $authHeader);
        return $this->apiSuccessResponse($products);
    }

    /**
     * Store a newly created resource in storage.
     * POST /api/v1/products
     */
    public function store(Request $request)
    {
        try {
            $payload = $request->validate([
                'name' => 'required',
                'stock' => 'integer',
                'price' => 'required|numeric',
                'description' => 'nullable'
            ]);
            
            $userId = $request->header('X-User-Id');
            if ($userId) {
                $payload['user_id'] = $userId;
            }

            $product = $this->productService->createProduct($payload);
            return $this->apiSuccessResponse($product, 201, 'Products created successfully');
        } catch (ValidationException $e) {
            return $this->apiErrorResponse($e->errors(), 400, 'Validation Exception');
        } catch (\Exception $e) {
            return $this->apiErrorResponse($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id)
    {
        $authHeader = $request->header('Authorization');
        $product = $this->productService->getProduct($id, $authHeader);
        if ($product == null) {
            return $this->apiErrorResponse(null, 404, "Not Found");
        }

        return $this->apiSuccessResponse($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        try {
            $payload = $request->validate([
                'name' => ['sometimes', 'string'],
                'stock' => ['sometimes', 'numeric', 'min:0'],
                'price' => ['sometimes', 'numeric', 'min:0'],
                'description' => ['sometimes', 'string']
            ]);

            $product = $this->productService->updateProduct($id, $payload);
            if ($product == null) {
                return $this->apiErrorResponse(null, 404, "Not Found");
            }

            return $this->apiSuccessResponse($product);
        } catch (ValidationException $e) {
            return $this->apiErrorResponse($e->errors(), 400, 'Validation Exception');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $deleted = $this->productService->deleteProduct($id);
        if (!$deleted) {
            return $this->apiErrorResponse(null, 404, "Not Found");
        }

        return $this->apiSuccessResponse(null, 203, "No Content");
    }
}
