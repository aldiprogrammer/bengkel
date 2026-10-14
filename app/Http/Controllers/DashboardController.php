<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Pelanggan;
use App\Models\Produk;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard with summary statistics.
     */
    public function index(): Response
    {
        $startOfMonth = now()->startOfMonth()->toDateString();
        $endOfMonth = now()->endOfMonth()->toDateString();
        $startOfLastMonth = now()->subMonthNoOverflow()->startOfMonth()->toDateString();
        $endOfLastMonth = now()->subMonthNoOverflow()->endOfMonth()->toDateString();

        $ordersThisMonth = Order::query()
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->count();
        $ordersLastMonth = Order::query()
            ->whereBetween('tanggal', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        $revenueThisMonth = (int) Order::query()
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->sum('grand_total');
        $revenueLastMonth = (int) Order::query()
            ->whereBetween('tanggal', [$startOfLastMonth, $endOfLastMonth])
            ->sum('grand_total');

        $totalPelanggan = Pelanggan::query()->count();
        $pelangganLastMonth = Pelanggan::query()
            ->whereDate('created_at', '<=', $endOfLastMonth)
            ->count();

        $totalProduk = Produk::query()->count();
        $produkLastMonth = Produk::query()
            ->whereDate('created_at', '<=', $endOfLastMonth)
            ->count();

        $bestSellers = DB::table('listorder')
            ->join('produk', 'produk.kode_produk', '=', 'listorder.kode_produk')
            ->whereNotNull('listorder.kode_produk')
            ->selectRaw('produk.kode_produk, produk.nama_produk, sum(listorder.qty) as total_qty')
            ->groupBy('produk.kode_produk', 'produk.nama_produk')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get()
            ->map(fn (object $row): array => [
                'kode_produk' => $row->kode_produk,
                'nama_produk' => $row->nama_produk,
                'total_qty' => (int) $row->total_qty,
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                [
                    'label' => 'Jumlah Order',
                    'value' => $ordersThisMonth,
                    'format' => 'number',
                    ...$this->growth($ordersLastMonth, $ordersThisMonth),
                    'icon' => 'wrench',
                ],
                [
                    'label' => 'Pendapatan Bulan Ini',
                    'value' => $revenueThisMonth,
                    'format' => 'currency',
                    ...$this->growth($revenueLastMonth, $revenueThisMonth),
                    'icon' => 'wallet',
                ],
                [
                    'label' => 'Jumlah Pelanggan',
                    'value' => $totalPelanggan,
                    'format' => 'number',
                    ...$this->growth($pelangganLastMonth, $totalPelanggan),
                    'icon' => 'users',
                ],
                [
                    'label' => 'Jumlah Produk',
                    'value' => $totalProduk,
                    'format' => 'number',
                    ...$this->growth($produkLastMonth, $totalProduk),
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
            'bestSellers' => $bestSellers,
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

    /**
     * Calculate the percentage change and direction between two periods.
     *
     * @return array{change: float, trend: string}
     */
    private function growth(int $previous, int $current): array
    {
        if ($previous === 0) {
            return ['change' => $current > 0 ? 100.0 : 0.0, 'trend' => 'up'];
        }

        $change = round(($current - $previous) / $previous * 100, 1);

        return ['change' => $change, 'trend' => $change >= 0 ? 'up' : 'down'];
    }
}
