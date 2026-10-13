<?php

namespace App\Http\Controllers;

use App\Http\Requests\JasaRequest;
use App\Models\Jasa;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class JasaController extends Controller
{
    /**
     * Display a listing of the services.
     */
    public function index(): Response
    {
        $jasa = Jasa::query()
            ->orderBy('nama_jasa')
            ->orderBy('id')
            ->get();

        return Inertia::render('Jasa/Index', [
            'jasa' => $jasa,
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(JasaRequest $request): RedirectResponse
    {
        Jasa::query()->create($request->validated());

        return redirect()
            ->route('jasa.index')
            ->with('success', 'Jasa berhasil ditambahkan.');
    }

    /**
     * Update the specified service.
     */
    public function update(JasaRequest $request, Jasa $jasa): RedirectResponse
    {
        $jasa->update($request->validated());

        return redirect()
            ->route('jasa.index')
            ->with('success', 'Data jasa berhasil diperbarui.');
    }

    /**
     * Remove the specified service.
     */
    public function destroy(Jasa $jasa): RedirectResponse
    {
        $jasa->delete();

        return redirect()
            ->route('jasa.index')
            ->with('success', 'Jasa berhasil dihapus.');
    }
}
