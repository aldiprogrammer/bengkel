<?php

namespace App\Http\Controllers;

use App\Http\Requests\LaporanRequest;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class LaporanController extends Controller
{
    /**
     * Show the order report for the selected period.
     */
    public function index(LaporanRequest $request): InertiaResponse
    {
        $period = $this->resolvePeriod($request->validated());
        $orders = $this->orders($period['start'], $period['end']);

        return Inertia::render('Laporan/Index', [
            'orders' => $orders,
            'summary' => $this->summary($orders),
            'filters' => [
                'mode' => $period['mode'],
                'bulan' => $period['start']->format('Y-m'),
                'dari' => $period['start']->toDateString(),
                'sampai' => $period['end']->toDateString(),
            ],
        ]);
    }

    /**
     * Download the order report for the selected period as a PDF.
     */
    public function exportPdf(LaporanRequest $request): HttpResponse
    {
        Carbon::setLocale('id');

        $period = $this->resolvePeriod($request->validated());
        $orders = $this->orders($period['start'], $period['end']);

        $pdf = Pdf::loadView('laporan.pdf', [
            'orders' => $orders,
            'summary' => $this->summary($orders),
            'start' => $period['start'],
            'end' => $period['end'],
        ])->setPaper('a4', 'landscape');

        $filename = 'laporan-'.$period['start']->toDateString().'-'.$period['end']->toDateString().'.pdf';

        return $pdf->download($filename);
    }

    /**
     * Resolve the reporting period from the validated filters.
     *
     * @param  array<string, string>  $filters
     * @return array{mode: string, start: Carbon, end: Carbon}
     */
    private function resolvePeriod(array $filters): array
    {
        $mode = $filters['mode'] ?? 'bulan';

        if ($mode === 'rentang') {
            $start = isset($filters['dari'])
                ? Carbon::parse($filters['dari'])->startOfDay()
                : now()->startOfMonth();
            $end = isset($filters['sampai'])
                ? Carbon::parse($filters['sampai'])->endOfDay()
                : now()->endOfDay();

            return ['mode' => $mode, 'start' => $start, 'end' => $end];
        }

        $bulan = isset($filters['bulan'])
            ? Carbon::createFromFormat('!Y-m', $filters['bulan'])
            : now();

        return [
            'mode' => 'bulan',
            'start' => $bulan->copy()->startOfMonth(),
            'end' => $bulan->copy()->endOfMonth(),
        ];
    }

    /**
     * Get the orders placed within the given period.
     *
     * @return Collection<int, Order>
     */
    private function orders(Carbon $start, Carbon $end): Collection
    {
        return Order::query()
            ->whereBetween('tanggal', [$start->toDateString(), $end->toDateString()])
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->get(['id', 'kode_order', 'tanggal', 'pelanggan', 'metode_pembayaran', 'grand_total']);
    }

    /**
     * Build the report summary cards from the orders.
     *
     * @param  Collection<int, Order>  $orders
     * @return array<int, array{label: string, value: int, format: string, icon: string}>
     */
    private function summary(Collection $orders): array
    {
        $totalOrders = $orders->count();
        $revenue = (int) $orders->sum('grand_total');

        return [
            ['label' => 'Pendapatan Periode', 'value' => $revenue, 'format' => 'currency', 'icon' => 'wallet'],
            ['label' => 'Total Order', 'value' => $totalOrders, 'format' => 'number', 'icon' => 'wrench'],
            ['label' => 'Rata-rata per Order', 'value' => $totalOrders > 0 ? intdiv($revenue, $totalOrders) : 0, 'format' => 'currency', 'icon' => 'chart'],
        ];
    }
}
