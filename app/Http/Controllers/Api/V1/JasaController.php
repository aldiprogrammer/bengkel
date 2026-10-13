<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\JasaRequest;
use App\Http\Resources\JasaResource;
use App\Models\Jasa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JasaController extends Controller
{
    /**
     * Display a listing of the services.
     */
    public function index(): AnonymousResourceCollection
    {
        $jasa = Jasa::query()
            ->orderBy('nama_jasa')
            ->orderBy('id')
            ->get();

        return JasaResource::collection($jasa);
    }

    /**
     * Store a newly created service.
     */
    public function store(JasaRequest $request): JsonResponse
    {
        $jasa = Jasa::query()->create($request->validated());

        return (new JasaResource($jasa))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified service.
     */
    public function show(Jasa $jasa): JasaResource
    {
        return new JasaResource($jasa);
    }

    /**
     * Update the specified service.
     */
    public function update(JasaRequest $request, Jasa $jasa): JasaResource
    {
        $jasa->update($request->validated());

        return new JasaResource($jasa);
    }

    /**
     * Remove the specified service.
     */
    public function destroy(Jasa $jasa): JsonResponse
    {
        $jasa->delete();

        return response()->json(null, 204);
    }
}
