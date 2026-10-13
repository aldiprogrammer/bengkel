<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = [
            ['kode_order' => 'ORD-0001', 'pelanggan' => 'Budi Santoso', 'montir' => 'Agus Setiawan', 'total_harga' => 265000, 'diskon' => 0, 'metode_pembayaran' => 'Tunai', 'status_struk' => 'Sudah Cetak', 'tanggal' => '2026-09-21'],
            ['kode_order' => 'ORD-0002', 'pelanggan' => 'Siti Aminah', 'montir' => 'Dedi Kurniawan', 'total_harga' => 780000, 'diskon' => 10, 'metode_pembayaran' => 'Transfer', 'status_struk' => 'Belum Cetak', 'tanggal' => '2026-09-22'],
            ['kode_order' => 'ORD-0003', 'pelanggan' => 'Rudi Hartono', 'montir' => 'Agus Setiawan', 'total_harga' => 350000, 'diskon' => 0, 'metode_pembayaran' => 'QRIS', 'status_struk' => 'Sudah Cetak', 'tanggal' => '2026-09-23'],
        ];

        foreach ($orders as $data) {
            $grandTotal = (int) round($data['total_harga'] * (1 - $data['diskon'] / 100));
            $uang = $grandTotal + 50000;

            Order::query()->updateOrCreate(
                ['kode_order' => $data['kode_order']],
                [
                    'pelanggan' => $data['pelanggan'],
                    'montir' => $data['montir'],
                    'uang' => $uang,
                    'kembalian' => $uang - $grandTotal,
                    'metode_pembayaran' => $data['metode_pembayaran'],
                    'total_harga' => $data['total_harga'],
                    'diskon' => $data['diskon'],
                    'grand_total' => $grandTotal,
                    'tanggal' => $data['tanggal'],
                    'status_struk' => $data['status_struk'],
                ],
            );
        }
    }
}
