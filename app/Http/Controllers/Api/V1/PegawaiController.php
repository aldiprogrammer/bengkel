<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\PegawaiRequest;
use App\Http\Resources\PegawaiResource;
use App\Models\Pegawai;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PegawaiController extends Controller
{
    /**
     * Display a listing of the employees.
     */
    public function index(): AnonymousResourceCollection
    {
        $pegawai = Pegawai::query()
            ->orderBy('nama')
            ->orderBy('id')
            ->get();

        return PegawaiResource::collection($pegawai);
    }

    /**
     * Store a newly created employee.
     */
    public function store(PegawaiRequest $request): JsonResponse
    {
        $pegawai = Pegawai::query()->create($request->validated());

        return (new PegawaiResource($pegawai))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified employee.
     */
    public function show(Pegawai $pegawai): PegawaiResource
    {
        return new PegawaiResource($pegawai);
    }

    /**
     * Update the specified employee.
     */
    public function update(PegawaiRequest $request, Pegawai $pegawai): PegawaiResource
    {
        $pegawai->update($request->validated());

        return new PegawaiResource($pegawai);
    }

    /**
     * Remove the specified employee.
     */
    public function destroy(Pegawai $pegawai): JsonResponse
    {
        $pegawai->delete();

        return response()->json(null, 204);
    }
}
