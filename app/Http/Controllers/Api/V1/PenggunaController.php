<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\PenggunaRequest;
use App\Http\Resources\PenggunaResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PenggunaController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(): AnonymousResourceCollection
    {
        $pengguna = User::query()
            ->orderBy('name')
            ->orderBy('id')
            ->get();

        return PenggunaResource::collection($pengguna);
    }

    /**
     * Store a newly created user.
     */
    public function store(PenggunaRequest $request): JsonResponse
    {
        $pengguna = User::query()->create($request->validated());

        return (new PenggunaResource($pengguna))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified user.
     */
    public function show(User $pengguna): PenggunaResource
    {
        return new PenggunaResource($pengguna);
    }

    /**
     * Update the specified user.
     */
    public function update(PenggunaRequest $request, User $pengguna): PenggunaResource
    {
        $data = $request->validated();

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $pengguna->update($data);

        return new PenggunaResource($pengguna);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $pengguna): JsonResponse
    {
        $pengguna->delete();

        return response()->json(null, 204);
    }
}
