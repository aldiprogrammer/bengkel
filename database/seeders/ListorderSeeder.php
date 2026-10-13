<?php

namespace Database\Seeders;

use App\Models\Jasa;
use App\Models\Listorder;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Database\Seeder;

class ListorderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kasir = User::query()->orderBy('id')->first();
        $produk = Produk::query()->orderBy('kode_produk')->first();
        $jasa = Jasa::query()->orderBy('kode_jasa')->first();

        if (! $kasir) {
            return;
        }

        $items = [];

        if ($produk) {
            $items[] = [
                'kode_order' => 'ORD-0001',
                'kode_produk' => $produk->kode_produk,
                'kode_jasa' => null,
                'harga' => $produk->harga_jual,
                'qty' => 2,
                'diskon' => 0,
                'tanggal' => '2026-09-21',
            ];
        }

        if ($jasa) {
            $items[] = [
                'kode_order' => 'ORD-0002',
                'kode_produk' => null,
                'kode_jasa' => $jasa->kode_jasa,
                'harga' => $jasa->harga,
                'qty' => 1,
                'diskon' => 0,
                'tanggal' => '2026-09-22',
            ];
        }

        foreach ($items as $data) {
            Listorder::query()->firstOrCreate(
                [
                    'kode_order' => $data['kode_order'],
                    'kode_produk' => $data['kode_produk'],
                    'kode_jasa' => $data['kode_jasa'],
                ],
                [
                    'harga' => $data['harga'],
                    'qty' => $data['qty'],
                    'diskon' => $data['diskon'],
                    'id_kasir' => $kasir->id,
                    'tanggal' => $data['tanggal'],
                ],
            );
        }
    }
}
