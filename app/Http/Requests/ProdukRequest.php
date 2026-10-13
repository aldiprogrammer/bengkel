<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProdukRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kode_produk' => [
                'required',
                'string',
                'max:255',
                Rule::unique('produk', 'kode_produk')->ignore($this->route('produk')),
            ],
            'nama_produk' => ['required', 'string', 'max:255'],
            'kategori_id' => ['required', 'integer', Rule::exists('kategori', 'id')],
            'satuan' => ['required', Rule::in(['Pcs', 'Lembar', 'Btl'])],
            'stok' => ['required', 'integer', 'min:0'],
            'harga_beli' => ['required', 'integer', 'min:0'],
            'harga_jual' => ['required', 'integer', 'min:0'],
            'diskon' => ['required', 'integer', 'min:0', 'max:100'],
            'tanggal_masuk' => ['required', 'date'],
        ];
    }
}
