<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProdukRequest;
use App\Models\Kategori;
use App\Models\Produk;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Throwable;

class ProdukController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(): Response
    {
        $produk = Produk::query()
            ->with('kategori:id,kode_kategori,nama_kategori')
            ->orderBy('nama_produk')
            ->orderBy('id')
            ->get();

        $kategori = Kategori::query()
            ->orderBy('nama_kategori')
            ->get(['id', 'kode_kategori', 'nama_kategori']);

        return Inertia::render('Produk/Index', [
            'produk' => $produk,
            'kategori' => $kategori,
        ]);
    }

    /**
     * Download the product listing as a PDF, honouring the active filters.
     */
    public function exportPdf(Request $request): HttpResponse
    {
        Carbon::setLocale('id');

        $produk = $this->filteredProduk($request);

        $pdf = Pdf::loadView('produk.pdf', [
            'produk' => $produk,
        ])->setPaper('a4', 'landscape');

        return $pdf->download('daftar-produk-'.now()->format('Y-m-d').'.pdf');
    }

    /**
     * Download printable barcode labels for the filtered products.
     */
    public function exportBarcodePdf(Request $request): HttpResponse
    {
        $labels = $this->barcodeLabels($this->filteredProduk($request));

        $pdf = Pdf::loadView('produk.barcode', [
            'labels' => $labels,
        ])->setPaper('a4', 'portrait');

        return $pdf->download('barcode-produk-'.now()->format('Y-m-d').'.pdf');
    }

    /**
     * Build the product query for the active filters.
     */
    private function filteredProduk(Request $request): Collection
    {
        $search = $request->string('search')->trim()->value();
        $kategori = $request->integer('kategori') ?: null;
        $satuan = $request->string('satuan')->value();
        $ids = collect(explode(',', $request->string('ids')->value()))
            ->filter(fn (string $id): bool => ctype_digit($id))
            ->map(fn (string $id): int => (int) $id)
            ->values();

        return Produk::query()
            ->with('kategori:id,kode_kategori,nama_kategori')
            ->when($ids->isNotEmpty(), fn ($query) => $query->whereIn('id', $ids))
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search): void {
                $query->where('kode_produk', 'like', "%{$search}%")
                    ->orWhere('nama_produk', 'like', "%{$search}%")
                    ->orWhere('satuan', 'like', "%{$search}%")
                    ->orWhereHas('kategori', fn ($query) => $query->where('nama_kategori', 'like', "%{$search}%"));
            }))
            ->when($kategori !== null, fn ($query) => $query->where('kategori_id', $kategori))
            ->when($satuan !== '', fn ($query) => $query->where('satuan', $satuan))
            ->orderBy('nama_produk')
            ->orderBy('id')
            ->get();
    }

    /**
     * Encode each product code as a Code 128 barcode label.
     *
     * @return Collection<int, array{kode_produk: string, nama_produk: string, barcode: string|null, width: float, height: float}>
     */
    private function barcodeLabels(Collection $produk): Collection
    {
        $generator = new BarcodeGeneratorPNG;

        return $produk->map(function (Produk $item) use ($generator): array {
            $label = [
                'kode_produk' => $item->kode_produk,
                'nama_produk' => $item->nama_produk,
                'barcode' => null,
                'width' => 0.0,
                'height' => 0.0,
            ];

            try {
                $binary = $generator->getBarcode($item->kode_produk, $generator::TYPE_CODE_128, 2, 50);
            } catch (Throwable) {
                return $label;
            }

            $size = getimagesizefromstring($binary);

            $heightMm = 13.0;
            $widthMm = is_array($size) ? $size[0] / $size[1] * $heightMm : 50.0;

            if ($widthMm > 56.0) {
                $heightMm *= 56.0 / $widthMm;
                $widthMm = 56.0;
            }

            $label['barcode'] = base64_encode($binary);
            $label['width'] = round($widthMm, 2);
            $label['height'] = round($heightMm, 2);

            return $label;
        });
    }

    /**
     * Store a newly created product.
     */
    public function store(ProdukRequest $request): RedirectResponse
    {
        Produk::query()->create($request->validated());

        return redirect()
            ->route('produk.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Update the specified product.
     */
    public function update(ProdukRequest $request, Produk $produk): RedirectResponse
    {
        $produk->update($request->validated());

        return redirect()
            ->route('produk.index')
            ->with('success', 'Data produk berhasil diperbarui.');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Produk $produk): RedirectResponse
    {
        $produk->delete();

        return redirect()
            ->route('produk.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}
