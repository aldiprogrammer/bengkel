<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PelangganSeeder::class);
        $this->call(PegawaiSeeder::class);
        $this->call(JasaSeeder::class);
        $this->call(KategoriSeeder::class);
        $this->call(ProdukSeeder::class);

        User::query()->updateOrCreate(
            ['email' => 'admin@posbengkel.test'],
            ['name' => 'Admin Bengkel', 'role' => 'Admin', 'password' => 'password'],
        );

        User::query()->updateOrCreate(
            ['email' => 'kasir@posbengkel.test'],
            ['name' => 'Kasir Bengkel', 'role' => 'Kasir', 'password' => 'password'],
        );
    }
}
