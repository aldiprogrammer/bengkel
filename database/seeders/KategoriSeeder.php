<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategori = [
            ['kode_kategori' => 'KAT-0001', 'nama_kategori' => 'Pelumas'],
            ['kode_kategori' => 'KAT-0002', 'nama_kategori' => 'Filter'],
            ['kode_kategori' => 'KAT-0003', 'nama_kategori' => 'Kaki-kaki'],
            ['kode_kategori' => 'KAT-0004', 'nama_kategori' => 'Kelistrikan'],
            ['kode_kategori' => 'KAT-0005', 'nama_kategori' => 'Aksesoris'],
            ['kode_kategori' => 'KAT-0006', 'nama_kategori' => 'Body & Cat'],
        ];

        foreach ($kategori as $data) {
            Kategori::query()->updateOrCreate(
                ['kode_kategori' => $data['kode_kategori']],
                $data,
            );
        }
    }
}
