<?php

use App\Http\Controllers\Api\V1\JasaController;
use App\Http\Controllers\Api\V1\KategoriController;
use App\Http\Controllers\Api\V1\ListorderController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PegawaiController;
use App\Http\Controllers\Api\V1\PelangganController;
use App\Http\Controllers\Api\V1\PenggunaController;
use App\Http\Controllers\Api\V1\ProdukController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    Route::apiResource('pelanggan', PelangganController::class);
    Route::apiResource('pegawai', PegawaiController::class);
    Route::apiResource('pengguna', PenggunaController::class);
    Route::apiResource('kategori', KategoriController::class);
    Route::apiResource('produk', ProdukController::class);
    Route::apiResource('jasa', JasaController::class);
    Route::apiResource('order', OrderController::class);
    Route::apiResource('listorder', ListorderController::class);
});
