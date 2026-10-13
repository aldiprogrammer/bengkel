<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListorderResource extends JsonResource
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
            'kode_produk' => $this->kode_produk,
            'kode_jasa' => $this->kode_jasa,
            'harga' => $this->harga,
            'qty' => $this->qty,
            'diskon' => $this->diskon,
            'id_kasir' => $this->id_kasir,
            'tanggal' => $this->tanggal,
            'produk' => ProdukResource::make($this->whenLoaded('produk')),
            'jasa' => JasaResource::make($this->whenLoaded('jasa')),
            'kasir' => PenggunaResource::make($this->whenLoaded('kasir')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
