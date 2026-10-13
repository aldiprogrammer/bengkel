<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $sequence = 0;

        $sequence++;

        $totalHarga = fake()->numberBetween(50, 1500) * 1000;
        $diskon = fake()->randomElement([0, 0, 5, 10]);
        $grandTotal = (int) round($totalHarga * (1 - $diskon / 100));
        $uang = $grandTotal + fake()->numberBetween(0, 10) * 5000;

        return [
            'kode_order' => 'ORD-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
            'pelanggan' => fake()->name(),
            'montir' => fake()->name(),
            'uang' => $uang,
            'kembalian' => $uang - $grandTotal,
            'metode_pembayaran' => fake()->randomElement(['Tunai', 'Transfer', 'QRIS', 'Debit']),
            'total_harga' => $totalHarga,
            'diskon' => $diskon,
            'grand_total' => $grandTotal,
            'tanggal' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'status_struk' => fake()->randomElement(['Belum Cetak', 'Sudah Cetak']),
        ];
    }
}
