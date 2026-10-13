<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'kode_order',
    'pelanggan',
    'montir',
    'uang',
    'kembalian',
    'metode_pembayaran',
    'total_harga',
    'diskon',
    'grand_total',
    'tanggal',
    'status_struk',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'order';

    /**
     * Get the list of items that belong to the order.
     *
     * @return HasMany<Listorder, $this>
     */
    public function listorder(): HasMany
    {
        return $this->hasMany(Listorder::class, 'kode_order', 'kode_order');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'uang' => 'integer',
            'kembalian' => 'integer',
            'total_harga' => 'integer',
            'diskon' => 'integer',
            'grand_total' => 'integer',
            'tanggal' => 'date:Y-m-d',
        ];
    }
}
