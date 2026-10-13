<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use Illuminate\Database\Seeder;

class PelangganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pelanggan = [
            [
                'kode_pelanggan' => 'PLG-0001',
                'nama' => 'Budi Santoso',
                'no_hp' => '0812-3456-7890',
                'alamat' => 'Jl. Melati No. 12, Jakarta Selatan',
                'kendaraan' => 'Toyota Avanza',
                'nomor_plat' => 'B 1023 XYZ',
            ],
            [
                'kode_pelanggan' => 'PLG-0002',
                'nama' => 'Siti Aminah',
                'no_hp' => '0813-2233-4455',
                'alamat' => 'Jl. Kenanga No. 8, Depok',
                'kendaraan' => 'Honda Beat',
                'nomor_plat' => 'B 4521 QW',
            ],
            [
                'kode_pelanggan' => 'PLG-0003',
                'nama' => 'Andi Wijaya',
                'no_hp' => '0821-9988-7766',
                'alamat' => 'Jl. Raya Bogor KM 27, Jakarta Timur',
                'kendaraan' => 'Mitsubishi L300',
                'nomor_plat' => 'B 9987 TT',
            ],
            [
                'kode_pelanggan' => 'PLG-0004',
                'nama' => 'Dewi Lestari',
                'no_hp' => '0857-1122-3344',
                'alamat' => 'Jl. Anggrek No. 45, Bekasi',
                'kendaraan' => 'Daihatsu Xenia',
                'nomor_plat' => 'B 7788 KL',
            ],
            [
                'kode_pelanggan' => 'PLG-0005',
                'nama' => 'Rizky Pratama',
                'no_hp' => '0878-5566-7788',
                'alamat' => 'Jl. Mawar No. 21, Tangerang',
                'kendaraan' => 'Yamaha NMAX',
                'nomor_plat' => 'B 3344 NM',
            ],
            [
                'kode_pelanggan' => 'PLG-0006',
                'nama' => 'Maya Sari',
                'no_hp' => '0811-7788-9900',
                'alamat' => 'Jl. Cempaka No. 3, Jakarta Pusat',
                'kendaraan' => 'Suzuki Ertiga',
                'nomor_plat' => 'B 5566 ER',
            ],
            [
                'kode_pelanggan' => 'PLG-0007',
                'nama' => 'Fajar Nugroho',
                'no_hp' => '0895-6677-8899',
                'alamat' => 'Jl. Dahlia No. 17, Bogor',
                'kendaraan' => 'Honda Vario',
                'nomor_plat' => 'B 2211 VD',
            ],
            [
                'kode_pelanggan' => 'PLG-0008',
                'nama' => 'Putri Handayani',
                'no_hp' => '0821-3344-5566',
                'alamat' => 'Jl. Flamboyan No. 9, Bandung',
                'kendaraan' => 'Toyota Kijang Innova',
                'nomor_plat' => 'B 8899 IN',
            ],
        ];

        foreach ($pelanggan as $data) {
            Pelanggan::query()->updateOrCreate(
                ['kode_pelanggan' => $data['kode_pelanggan']],
                $data,
            );
        }
    }
}
