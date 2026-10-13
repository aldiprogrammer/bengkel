<?php

namespace Database\Factories;

use App\Models\Jasa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Jasa>
 */
class JasaFactory extends Factory
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
            'kode_jasa' => 'JSA-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
            'nama_jasa' => fake()->randomElement([
                'Servis Rutin',
                'Ganti Oli',
                'Tune Up Mesin',
                'Perbaikan Rem',
                'Ganti Kampas Rem',
                'Servis Kelistrikan',
                'Balancing dan Spooring',
                'Cuci Steam',
                'Ganti Ban',
                'Perbaikan AC Mobil',
            ]),
            'harga' => fake()->numberBetween(5, 150) * 10000,
        ];
    }
}
