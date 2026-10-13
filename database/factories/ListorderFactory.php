<?php

namespace Database\Factories;

use App\Models\Jasa;
use App\Models\Listorder;
use App\Models\Order;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Listorder>
 */
class ListorderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isProduk = fake()->boolean();

        return [
            'kode_order' => fn () => Order::factory()->create()->kode_order,
            'kode_produk' => $isProduk ? fn () => Produk::factory()->create()->kode_produk : null,
            'kode_jasa' => $isProduk ? null : fn () => Jasa::factory()->create()->kode_jasa,
            'harga' => fake()->numberBetween(10, 800) * 1000,
            'qty' => fake()->numberBetween(1, 5),
            'diskon' => fake()->randomElement([0, 0, 5, 10]),
            'id_kasir' => User::factory(),
            'tanggal' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
        ];
    }
}
