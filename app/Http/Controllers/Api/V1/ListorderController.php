<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListorderRequest;
use App\Http\Resources\ListorderResource;
use App\Models\Listorder;
use App\Models\Produk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class ListorderController extends Controller
{
    /**
     * Display a listing of the order items.
     */
    public function index(): AnonymousResourceCollection
    {
        $listorder = Listorder::query()
            ->with(['produk', 'jasa', 'kasir'])
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->get();

        return ListorderResource::collection($listorder);
    }

    /**
     * Store a newly created order item.
     */
    public function store(ListorderRequest $request): JsonResponse
    {
        $listorder = DB::transaction(function () use ($request): Listorder {
            $data = $request->validated();

            $listorder = Listorder::query()->create($data);

            if (! empty($data['kode_produk'])) {
                Produk::query()
                    ->where('kode_produk', $data['kode_produk'])
                    ->decrement('stok', $data['qty']);
            }

            return $listorder;
        });

        return (new ListorderResource($listorder->load(['produk', 'jasa', 'kasir'])))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified order item.
     */
    public function show(Listorder $listorder): ListorderResource
    {
        return new ListorderResource($listorder->load(['produk', 'jasa', 'kasir']));
    }

    /**
     * Update the specified order item.
     */
    public function update(ListorderRequest $request, Listorder $listorder): ListorderResource
    {
        $listorder->update($request->validated());

        return new ListorderResource($listorder->load(['produk', 'jasa', 'kasir']));
    }

    /**
     * Remove the specified order item.
     */
    public function destroy(Listorder $listorder): JsonResponse
    {
        $listorder->delete();

        return response()->json(null, 204);
    }
}
