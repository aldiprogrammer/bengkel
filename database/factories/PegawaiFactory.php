<?php

namespace Database\Factories;

use App\Models\Pegawai;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pegawai>
 */
class PegawaiFactory extends Factory
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
            'kode_pegawai' => 'PEG-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT),
            'nama' => fake()->name(),
            'jabatan' => fake()->randomElement([
                'Mekanik',
                'Kasir',
                'Administrasi',
                'Kepala Bengkel',
            ]),
            'no_hp' => '08'.fake()->numerify('##########'),
            'email' => fake()->unique()->safeEmail(),
            'alamat' => fake()->address(),
            'tanggal_masuk' => fake()->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['Aktif', 'Nonaktif']),
        ];
    }
}
