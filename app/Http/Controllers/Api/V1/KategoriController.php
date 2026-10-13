<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\KategoriRequest;
use App\Http\Resources\KategoriResource;
use App\Models\Kategori;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class KategoriController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index(): AnonymousResourceCollection
    {
        $kategori = Kategori::query()
            ->orderBy('nama_kategori')
            ->orderBy('id')
            ->get();

        return KategoriResource::collection($kategori);
    }

    /**
     * Store a newly created category.
     */
    public function store(KategoriRequest $request): JsonResponse
    {
        $kategori = Kategori::query()->create($request->validated());

        return (new KategoriResource($kategori))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified category.
     */
    public function show(Kategori $kategori): KategoriResource
    {
        return new KategoriResource($kategori);
    }

    /**
     * Update the specified category.
     */
    public function update(KategoriRequest $request, Kategori $kategori): KategoriResource
    {
        $kategori->update($request->validated());

        return new KategoriResource($kategori);
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Kategori $kategori): JsonResponse
    {
        $kategori->delete();

        return response()->json(null, 204);
    }
}
