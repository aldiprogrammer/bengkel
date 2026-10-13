<?php

namespace Database\Seeders;

use App\Models\Pegawai;
use Illuminate\Database\Seeder;

class PegawaiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pegawai = [
            [
                'kode_pegawai' => 'PEG-0001',
                'nama' => 'Agus Setiawan',
                'jabatan' => 'Kepala Bengkel',
                'no_hp' => '0812-1111-2222',
                'email' => 'agus.setiawan@posbengkel.test',
                'alamat' => 'Jl. Melati No. 5, Jakarta Selatan',
                'tanggal_masuk' => '2019-02-11',
                'status' => 'Aktif',
            ],
            [
                'kode_pegawai' => 'PEG-0002',
                'nama' => 'Bambang Prasetyo',
                'jabatan' => 'Mekanik',
                'no_hp' => '0813-3333-4444',
                'email' => 'bambang.prasetyo@posbengkel.test',
                'alamat' => 'Jl. Kenanga No. 18, Depok',
                'tanggal_masuk' => '2020-06-15',
                'status' => 'Aktif',
            ],
            [
                'kode_pegawai' => 'PEG-0003',
                'nama' => 'Citra Dewi',
                'jabatan' => 'Kasir',
                'no_hp' => '0821-5555-6666',
                'email' => 'citra.dewi@posbengkel.test',
                'alamat' => 'Jl. Raya Bogor KM 25, Jakarta Timur',
                'tanggal_masuk' => '2021-03-01',
                'status' => 'Aktif',
            ],
            [
                'kode_pegawai' => 'PEG-0004',
                'nama' => 'Dedi Kurniawan',
                'jabatan' => 'Mekanik',
                'no_hp' => '0857-7777-8888',
                'email' => 'dedi.kurniawan@posbengkel.test',
                'alamat' => 'Jl. Anggrek No. 9, Bekasi',
                'tanggal_masuk' => '2022-08-20',
                'status' => 'Aktif',
            ],
            [
                'kode_pegawai' => 'PEG-0005',
                'nama' => 'Eka Nuraini',
                'jabatan' => 'Administrasi',
                'no_hp' => '0878-9999-0000',
                'email' => 'eka.nuraini@posbengkel.test',
                'alamat' => 'Jl. Mawar No. 27, Tangerang',
                'tanggal_masuk' => '2023-01-09',
                'status' => 'Nonaktif',
            ],
        ];

        foreach ($pegawai as $data) {
            Pegawai::query()->updateOrCreate(
                ['kode_pegawai' => $data['kode_pegawai']],
                $data,
            );
        }
    }
}
