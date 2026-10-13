<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PelangganResource extends JsonResource
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
            'kode_pelanggan' => $this->kode_pelanggan,
            'nama' => $this->nama,
            'no_hp' => $this->no_hp,
            'alamat' => $this->alamat,
            'kendaraan' => $this->kendaraan,
            'nomor_plat' => $this->nomor_plat,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
