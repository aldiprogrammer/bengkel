<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProdukRequest;
use App\Http\Resources\ProdukResource;
use App\Models\Produk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProdukController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(): AnonymousResourceCollection
    {
        $produk = Produk::query()
            ->with('kategori')
            ->orderBy('nama_produk')
            ->orderBy('id')
            ->get();

        return ProdukResource::collection($produk);
    }

    /**
     * Store a newly created product.
     */
    public function store(ProdukRequest $request): JsonResponse
    {
        $produk = Produk::query()->create($request->validated());

        return (new ProdukResource($produk->load('kategori')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified product.
     */
    public function show(Produk $produk): ProdukResource
    {
        return new ProdukResource($produk->load('kategori'));
    }

    /**
     * Update the specified product.
     */
    public function update(ProdukRequest $request, Produk $produk): ProdukResource
    {
        $produk->update($request->validated());

        return new ProdukResource($produk->load('kategori'));
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Produk $produk): JsonResponse
    {
        $produk->delete();

        return response()->json(null, 204);
    }
}
