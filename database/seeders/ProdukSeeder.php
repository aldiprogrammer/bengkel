<?php

namespace Database\Seeders;

use App\Models\Kategori;
use App\Models\Produk;
use Illuminate\Database\Seeder;

class ProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $produk = [
            ['kode_produk' => 'BRG-0001', 'nama_produk' => 'Oli Mesin 10W-40', 'kategori' => 'KAT-0001', 'satuan' => 'Btl', 'stok' => 48, 'harga_beli' => 55000, 'harga_jual' => 65000, 'diskon' => 0, 'tanggal_masuk' => '2026-09-01'],
            ['kode_produk' => 'BRG-0002', 'nama_produk' => 'Filter Oli Universal', 'kategori' => 'KAT-0002', 'satuan' => 'Pcs', 'stok' => 30, 'harga_beli' => 35000, 'harga_jual' => 45000, 'diskon' => 5, 'tanggal_masuk' => '2026-09-05'],
            ['kode_produk' => 'BRG-0003', 'nama_produk' => 'Kampas Rem Depan', 'kategori' => 'KAT-0003', 'satuan' => 'Pcs', 'stok' => 32, 'harga_beli' => 95000, 'harga_jual' => 120000, 'diskon' => 0, 'tanggal_masuk' => '2026-09-10'],
            ['kode_produk' => 'BRG-0004', 'nama_produk' => 'Busi Iridium', 'kategori' => 'KAT-0004', 'satuan' => 'Pcs', 'stok' => 0, 'harga_beli' => 70000, 'harga_jual' => 85000, 'diskon' => 0, 'tanggal_masuk' => '2026-09-12'],
            ['kode_produk' => 'BRG-0005', 'nama_produk' => 'Aki Kering 12V', 'kategori' => 'KAT-0004', 'satuan' => 'Pcs', 'stok' => 14, 'harga_beli' => 650000, 'harga_jual' => 780000, 'diskon' => 10, 'tanggal_masuk' => '2026-09-15'],
            ['kode_produk' => 'BRG-0006', 'nama_produk' => 'Lampu LED Headlamp', 'kategori' => 'KAT-0005', 'satuan' => 'Pcs', 'stok' => 5, 'harga_beli' => 75000, 'harga_jual' => 95000, 'diskon' => 15, 'tanggal_masuk' => '2026-09-20'],
            ['kode_produk' => 'BRG-0007', 'nama_produk' => 'Lem Sealant', 'kategori' => 'KAT-0006', 'satuan' => 'Btl', 'stok' => 20, 'harga_beli' => 25000, 'harga_jual' => 35000, 'diskon' => 0, 'tanggal_masuk' => '2026-09-25'],
            ['kode_produk' => 'BRG-0008', 'nama_produk' => 'Kain Majun', 'kategori' => 'KAT-0006', 'satuan' => 'Lembar', 'stok' => 50, 'harga_beli' => 5000, 'harga_jual' => 8000, 'diskon' => 0, 'tanggal_masuk' => '2026-09-28'],
        ];

        foreach ($produk as $data) {
            $kategori = Kategori::query()->firstOrCreate(
                ['kode_kategori' => $data['kategori']],
                ['nama_kategori' => $data['kategori']],
            );

            Produk::query()->updateOrCreate(
                ['kode_produk' => $data['kode_produk']],
                [
                    'nama_produk' => $data['nama_produk'],
                    'kategori_id' => $kategori->id,
                    'satuan' => $data['satuan'],
                    'stok' => $data['stok'],
                    'harga_beli' => $data['harga_beli'],
                    'harga_jual' => $data['harga_jual'],
                    'diskon' => $data['diskon'],
                    'tanggal_masuk' => $data['tanggal_masuk'],
                ],
            );
        }
    }
}
