<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class PwaController extends Controller
{
    /**
     * Return the web app manifest used to make the application installable.
     */
    public function manifest(): JsonResponse
    {
        $appName = config('app.name', 'POS Bengkel');

        return response()->json([
            'id' => '/',
            'name' => $appName,
            'short_name' => $appName,
            'description' => 'Sistem manajemen bengkel untuk pelanggan, work order, stok sparepart, kasir, dan laporan.',
            'lang' => 'id',
            'dir' => 'ltr',
            'start_url' => '/',
            'scope' => '/',
            'display' => 'standalone',
            'display_override' => ['standalone', 'minimal-ui'],
            'orientation' => 'any',
            'theme_color' => '#16a34a',
            'background_color' => '#f1f5f9',
            'categories' => ['business', 'productivity', 'finance'],
            'icons' => [
                [
                    'src' => '/icons/icon-192.png',
                    'sizes' => '192x192',
                    'type' => 'image/png',
                    'purpose' => 'any',
                ],
                [
                    'src' => '/icons/icon-512.png',
                    'sizes' => '512x512',
                    'type' => 'image/png',
                    'purpose' => 'any',
                ],
                [
                    'src' => '/icons/icon-maskable-512.png',
                    'sizes' => '512x512',
                    'type' => 'image/png',
                    'purpose' => 'maskable',
                ],
            ],
            'shortcuts' => [
                [
                    'name' => 'Dashboard',
                    'short_name' => 'Dashboard',
                    'url' => '/dashboard',
                    'icons' => [['src' => '/icons/icon-192.png', 'sizes' => '192x192', 'type' => 'image/png']],
                ],
                [
                    'name' => 'Produk & Stok',
                    'short_name' => 'Produk',
                    'url' => '/produk',
                    'icons' => [['src' => '/icons/icon-192.png', 'sizes' => '192x192', 'type' => 'image/png']],
                ],
                [
                    'name' => 'Laporan',
                    'short_name' => 'Laporan',
                    'url' => '/laporan',
                    'icons' => [['src' => '/icons/icon-192.png', 'sizes' => '192x192', 'type' => 'image/png']],
                ],
            ],
        ], 200, ['Content-Type' => 'application/manifest+json']);
    }
}
