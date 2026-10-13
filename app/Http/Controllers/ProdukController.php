<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProdukRequest;
use App\Models\Kategori;
use App\Models\Produk;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

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
