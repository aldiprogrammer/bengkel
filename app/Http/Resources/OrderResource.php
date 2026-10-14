<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kode_order' => $this->kode_order,
            'pelanggan' => $this->pelanggan,
            'montir' => $this->montir,
            'id_kasir' => $this->id_kasir,
            'uang' => $this->uang,
            'kembalian' => $this->kembalian,
            'metode_pembayaran' => $this->metode_pembayaran,
            'total_harga' => $this->total_harga,
            'diskon' => $this->diskon,
            'grand_total' => $this->grand_total,
            'tanggal' => $this->tanggal,
            'status_struk' => $this->status_struk,
            'listorder' => ListorderResource::collection($this->whenLoaded('listorder')),
            'kasir' => PenggunaResource::make($this->whenLoaded('kasir')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
