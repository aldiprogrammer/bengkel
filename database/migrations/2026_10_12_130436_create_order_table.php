<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order', function (Blueprint $table) {
            $table->id();
            $table->string('kode_order')->unique();
            $table->string('pelanggan');
            $table->unsignedBigInteger('uang')->default(0);
            $table->unsignedBigInteger('kembalian')->default(0);
            $table->string('metode_pembayaran');
            $table->unsignedBigInteger('total_harga')->default(0);
            $table->unsignedTinyInteger('diskon')->default(0);
            $table->unsignedBigInteger('grand_total')->default(0);
            $table->date('tanggal');
            $table->string('status_struk')->default('Belum Cetak');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order');
    }
};
