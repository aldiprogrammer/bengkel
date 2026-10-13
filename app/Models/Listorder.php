<?php

namespace App\Models;

use Database\Factories\ListorderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'kode_order',
    'kode_produk',
    'kode_jasa',
    'harga',
    'qty',
    'diskon',
    'id_kasir',
    'tanggal',
])]
class Listorder extends Model
{
    /** @use HasFactory<ListorderFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'listorder';

    /**
     * Get the order the item belongs to.
     *
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'kode_order', 'kode_order');
    }

    /**
     * Get the product the item refers to.
     *
     * @return BelongsTo<Produk, $this>
     */
    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'kode_produk', 'kode_produk');
    }

    /**
     * Get the service the item refers to.
     *
     * @return BelongsTo<Jasa, $this>
     */
    public function jasa(): BelongsTo
    {
        return $this->belongsTo(Jasa::class, 'kode_jasa', 'kode_jasa');
    }

    /**
     * Get the cashier who created the item.
     *
     * @return BelongsTo<User, $this>
     */
    public function kasir(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_kasir');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'harga' => 'integer',
            'qty' => 'integer',
            'diskon' => 'integer',
            'tanggal' => 'date:Y-m-d',
        ];
    }
}
