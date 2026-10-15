<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JasaController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\PwaController;
use Illuminate\Support\Facades\Route;

Route::get('manifest.webmanifest', [PwaController::class, 'manifest'])->name('pwa.manifest');

Route::redirect('/', '/dashboard');

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'create'])->name('login');
    Route::post('login', [AuthController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthController::class, 'destroy'])->name('logout');

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('pengguna', [PenggunaController::class, 'index'])->name('pengguna.index');
    Route::post('pengguna', [PenggunaController::class, 'store'])->name('pengguna.store');
    Route::put('pengguna/{pengguna}', [PenggunaController::class, 'update'])->name('pengguna.update');
    Route::delete('pengguna/{pengguna}', [PenggunaController::class, 'destroy'])->name('pengguna.destroy');

    Route::get('pegawai', [PegawaiController::class, 'index'])->name('pegawai.index');
    Route::post('pegawai', [PegawaiController::class, 'store'])->name('pegawai.store');
    Route::put('pegawai/{pegawai}', [PegawaiController::class, 'update'])->name('pegawai.update');
    Route::delete('pegawai/{pegawai}', [PegawaiController::class, 'destroy'])->name('pegawai.destroy');

    Route::get('pelanggan', [PelangganController::class, 'index'])->name('pelanggan.index');
    Route::post('pelanggan', [PelangganController::class, 'store'])->name('pelanggan.store');
    Route::put('pelanggan/{pelanggan}', [PelangganController::class, 'update'])->name('pelanggan.update');
    Route::delete('pelanggan/{pelanggan}', [PelangganController::class, 'destroy'])->name('pelanggan.destroy');
    Route::inertia('kendaraan', 'Kendaraan/Index')->name('kendaraan.index');
    Route::inertia('servis', 'Servis/Index')->name('servis.index');

    Route::get('jasa', [JasaController::class, 'index'])->name('jasa.index');
    Route::post('jasa', [JasaController::class, 'store'])->name('jasa.store');
    Route::put('jasa/{jasa}', [JasaController::class, 'update'])->name('jasa.update');
    Route::delete('jasa/{jasa}', [JasaController::class, 'destroy'])->name('jasa.destroy');

    Route::get('kategori', [KategoriController::class, 'index'])->name('kategori.index');
    Route::post('kategori', [KategoriController::class, 'store'])->name('kategori.store');
    Route::put('kategori/{kategori}', [KategoriController::class, 'update'])->name('kategori.update');
    Route::delete('kategori/{kategori}', [KategoriController::class, 'destroy'])->name('kategori.destroy');

    Route::get('produk', [ProdukController::class, 'index'])->name('produk.index');
    Route::get('produk/export', [ProdukController::class, 'exportPdf'])->name('produk.export');
    Route::get('produk/barcode', [ProdukController::class, 'exportBarcodePdf'])->name('produk.barcode');
    Route::post('produk', [ProdukController::class, 'store'])->name('produk.store');
    Route::put('produk/{produk}', [ProdukController::class, 'update'])->name('produk.update');
    Route::delete('produk/{produk}', [ProdukController::class, 'destroy'])->name('produk.destroy');
    Route::inertia('transaksi', 'Transaksi/Index')->name('transaksi.index');
    Route::get('laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('laporan/export', [LaporanController::class, 'exportPdf'])->name('laporan.export');
    Route::get('laporan/{order}/detail', [LaporanController::class, 'detail'])->name('laporan.detail');
    Route::inertia('pengaturan', 'Pengaturan/Index')->name('pengaturan.index');
});
