<?php

namespace Database\Factories;

use App\Models\Pelanggan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pelanggan>
 */
class PelangganFactory extends Factory
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

        return [
            'kode_pelanggan' => 'PLG-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
            'nama' => fake()->name(),
            'no_hp' => '08'.fake()->numerify('##########'),
            'alamat' => fake()->address(),
            'kendaraan' => fake()->randomElement([
                'Toyota Avanza',
                'Honda Beat',
                'Mitsubishi L300',
                'Daihatsu Xenia',
                'Yamaha NMAX',
                'Suzuki Ertiga',
                'Honda Vario',
                'Toyota Kijang Innova',
            ]),
            'nomor_plat' => strtoupper(fake()->bothify('B #### ???')),
        ];
    }
}
