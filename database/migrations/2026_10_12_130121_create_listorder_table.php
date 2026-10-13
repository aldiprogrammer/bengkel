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
        Schema::create('listorder', function (Blueprint $table) {
            $table->id();
            $table->string('kode_order');
            $table->string('kode_produk')->nullable();
            $table->string('kode_jasa')->nullable();
            $table->unsignedBigInteger('harga')->default(0);
            $table->unsignedInteger('qty')->default(1);
            $table->unsignedTinyInteger('diskon')->default(0);
            $table->unsignedBigInteger('id_kasir');
            $table->date('tanggal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listorder');
    }
};
