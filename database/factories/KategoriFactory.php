<?php

namespace Database\Factories;

use App\Models\Kategori;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kategori>
 */
class KategoriFactory extends Factory
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

        $names = [
            'Pelumas',
            'Filter',
            'Kaki-kaki',
            'Kelistrikan',
            'Aksesoris',
            'Body & Cat',
            'Ban & Roda',
            'Mesin',
        ];

        return [
            'kode_kategori' => 'KAT-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
            'nama_kategori' => $names[($sequence - 1) % count($names)],
        ];
    }
}
