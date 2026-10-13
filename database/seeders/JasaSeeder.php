<?php

namespace Database\Seeders;

use App\Models\Jasa;
use Illuminate\Database\Seeder;

class JasaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jasa = [
            ['kode_jasa' => 'JSA-0001', 'nama_jasa' => 'Servis Rutin', 'harga' => 150000],
            ['kode_jasa' => 'JSA-0002', 'nama_jasa' => 'Ganti Oli', 'harga' => 75000],
            ['kode_jasa' => 'JSA-0003', 'nama_jasa' => 'Tune Up Mesin', 'harga' => 250000],
            ['kode_jasa' => 'JSA-0004', 'nama_jasa' => 'Perbaikan Rem', 'harga' => 120000],
            ['kode_jasa' => 'JSA-0005', 'nama_jasa' => 'Ganti Kampas Rem', 'harga' => 90000],
            ['kode_jasa' => 'JSA-0006', 'nama_jasa' => 'Servis Kelistrikan', 'harga' => 175000],
            ['kode_jasa' => 'JSA-0007', 'nama_jasa' => 'Balancing dan Spooring', 'harga' => 200000],
            ['kode_jasa' => 'JSA-0008', 'nama_jasa' => 'Cuci Steam', 'harga' => 35000],
        ];

        foreach ($jasa as $data) {
            Jasa::query()->updateOrCreate(
                ['kode_jasa' => $data['kode_jasa']],
                $data,
            );
        }
    }
}
