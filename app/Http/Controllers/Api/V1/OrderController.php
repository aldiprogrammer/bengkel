<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index(): AnonymousResourceCollection
    {
        $order = Order::query()
            ->with('listorder', 'kasir')
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->get();

        return OrderResource::collection($order);
    }

    /**
     * Store a newly created order.
     */
    public function store(OrderRequest $request): JsonResponse
    {
        $order = Order::query()->create($request->validated());

        return (new OrderResource($order->load('listorder', 'kasir')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): OrderResource
    {
        return new OrderResource($order->load('listorder.produk', 'listorder.jasa', 'listorder.kasir', 'kasir'));
    }

    /**
     * Update the specified order.
     */
    public function update(OrderRequest $request, Order $order): OrderResource
    {
        $order->update($request->validated());

        return new OrderResource($order->load('listorder', 'kasir'));
    }

    /**
     * Remove the specified order.
     */
    public function destroy(Order $order): JsonResponse
    {
        $order->delete();

        return response()->json(null, 204);
    }
}
