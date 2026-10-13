<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard with summary statistics.
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                [
                    'label' => 'Pendapatan Bulan Ini',
                    'value' => 48250000,
                    'format' => 'currency',
                    'change' => 12.5,
                    'trend' => 'up',
                    'icon' => 'wallet',
                ],
                [
                    'label' => 'Work Order Aktif',
                    'value' => 38,
                    'format' => 'number',
                    'change' => 6.2,
                    'trend' => 'up',
                    'icon' => 'wrench',
                ],
                [
                    'label' => 'Pelanggan Baru',
                    'value' => 124,
                    'format' => 'number',
                    'change' => 3.1,
                    'trend' => 'down',
                    'icon' => 'users',
                ],
                [
                    'label' => 'Stok Hampir Habis',
                    'value' => 9,
                    'format' => 'number',
                    'change' => 2.4,
                    'trend' => 'down',
                    'icon' => 'box',
                ],
            ],
            'salesChart' => [
                ['month' => 'Jan', 'value' => 22],
                ['month' => 'Feb', 'value' => 31],
                ['month' => 'Mar', 'value' => 27],
                ['month' => 'Apr', 'value' => 39],
                ['month' => 'Mei', 'value' => 42],
                ['month' => 'Jun', 'value' => 38],
                ['month' => 'Jul', 'value' => 48],
                ['month' => 'Agu', 'value' => 51],
                ['month' => 'Sep', 'value' => 46],
                ['month' => 'Okt', 'value' => 57],
                ['month' => 'Nov', 'value' => 62],
                ['month' => 'Des', 'value' => 68],
            ],
            'serviceBreakdown' => [
                ['label' => 'Servis Rutin', 'value' => 42, 'color' => '#16a34a'],
                ['label' => 'Ganti Oli', 'value' => 26, 'color' => '#22c55e'],
                ['label' => 'Perbaikan Mesin', 'value' => 19, 'color' => '#4ade80'],
                ['label' => 'Lainnya', 'value' => 13, 'color' => '#86efac'],
            ],
            'recentOrders' => [
                [
                    'id' => 'WO-2041',
                    'customer' => 'Budi Santoso',
                    'vehicle' => 'Toyota Avanza - B 1023 XYZ',
                    'status' => 'Selesai',
                    'amount' => 850000,
                    'date' => '12 Okt 2026',
                ],
                [
                    'id' => 'WO-2040',
                    'customer' => 'Siti Aminah',
                    'vehicle' => 'Honda Beat - B 4521 QW',
                    'status' => 'Dikerjakan',
                    'amount' => 320000,
                    'date' => '12 Okt 2026',
                ],
                [
                    'id' => 'WO-2039',
                    'customer' => 'Andi Wijaya',
                    'vehicle' => 'Mitsubishi L300 - B 9987 TT',
                    'status' => 'Menunggu',
                    'amount' => 1450000,
                    'date' => '11 Okt 2026',
                ],
                [
                    'id' => 'WO-2038',
                    'customer' => 'Dewi Lestari',
                    'vehicle' => 'Daihatsu Xenia - B 7788 KL',
                    'status' => 'Selesai',
                    'amount' => 675000,
                    'date' => '11 Okt 2026',
                ],
                [
                    'id' => 'WO-2037',
                    'customer' => 'Rizky Pratama',
                    'vehicle' => 'Yamaha NMAX - B 3344 NM',
                    'status' => 'Dikerjakan',
                    'amount' => 210000,
                    'date' => '10 Okt 2026',
                ],
            ],
        ]);
    }
}
