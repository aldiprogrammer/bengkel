<?php

namespace App\Http\Controllers;

use App\Http\Requests\PelangganRequest;
use App\Models\Pelanggan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PelangganController extends Controller
{
    /**
     * Display a listing of the customers.
     */
    public function index(): Response
    {
        $pelanggan = Pelanggan::query()
            ->orderBy('nama')
            ->orderBy('id')
            ->get();

        return Inertia::render('Pelanggan/Index', [
            'pelanggan' => $pelanggan,
        ]);
    }

    /**
     * Store a newly created customer.
     */
    public function store(PelangganRequest $request): RedirectResponse
    {
        Pelanggan::query()->create($request->validated());

        return redirect()
            ->route('pelanggan.index')
            ->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    /**
     * Update the specified customer.
     */
    public function update(PelangganRequest $request, Pelanggan $pelanggan): RedirectResponse
    {
        $pelanggan->update($request->validated());

        return redirect()
            ->route('pelanggan.index')
            ->with('success', 'Data pelanggan berhasil diperbarui.');
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Pelanggan $pelanggan): RedirectResponse
    {
        $pelanggan->delete();

        return redirect()
            ->route('pelanggan.index')
            ->with('success', 'Pelanggan berhasil dihapus.');
    }
}
