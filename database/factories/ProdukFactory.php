<?php

namespace Database\Factories;

use App\Models\Kategori;
use App\Models\Produk;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Produk>
 */
class ProdukFactory extends Factory
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

        $hargaBeli = fake()->numberBetween(10, 200) * 1000;

        return [
            'kode_produk' => 'BRG-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
            'nama_produk' => fake()->words(3, true),
            'kategori_id' => Kategori::factory(),
            'satuan' => fake()->randomElement(['Pcs', 'Lembar', 'Btl']),
            'stok' => fake()->numberBetween(0, 120),
            'harga_beli' => $hargaBeli,
            'harga_jual' => $hargaBeli + fake()->numberBetween(2, 50) * 1000,
            'diskon' => fake()->randomElement([0, 0, 5, 10, 15]),
            'tanggal_masuk' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
        ];
    }
}
