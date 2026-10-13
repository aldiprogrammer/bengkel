<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\PelangganRequest;
use App\Http\Resources\PelangganResource;
use App\Models\Pelanggan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PelangganController extends Controller
{
    /**
     * Display a listing of the customers.
     */
    public function index(): AnonymousResourceCollection
    {
        $pelanggan = Pelanggan::query()
            ->orderBy('nama')
            ->orderBy('id')
            ->get();

        return PelangganResource::collection($pelanggan);
    }

    /**
     * Store a newly created customer.
     */
    public function store(PelangganRequest $request): JsonResponse
    {
        $pelanggan = Pelanggan::query()->create($request->validated());

        return (new PelangganResource($pelanggan))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified customer.
     */
    public function show(Pelanggan $pelanggan): PelangganResource
    {
        return new PelangganResource($pelanggan);
    }

    /**
     * Update the specified customer.
     */
    public function update(PelangganRequest $request, Pelanggan $pelanggan): PelangganResource
    {
        $pelanggan->update($request->validated());

        return new PelangganResource($pelanggan);
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Pelanggan $pelanggan): JsonResponse
    {
        $pelanggan->delete();

        return response()->json(null, 204);
    }
}
