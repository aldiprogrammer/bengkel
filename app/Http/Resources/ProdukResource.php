<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProdukResource extends JsonResource
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
            'kode_produk' => $this->kode_produk,
            'nama_produk' => $this->nama_produk,
            'kategori_id' => $this->kategori_id,
            'satuan' => $this->satuan,
            'stok' => $this->stok,
            'harga_beli' => $this->harga_beli,
            'harga_jual' => $this->harga_jual,
            'diskon' => $this->diskon,
            'tanggal_masuk' => $this->tanggal_masuk,
            'kategori' => KategoriResource::make($this->whenLoaded('kategori')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
