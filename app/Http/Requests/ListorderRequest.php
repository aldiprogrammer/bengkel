<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListorderRequest extends FormRequest
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
            'kode_order' => ['required', 'string', 'max:255', Rule::exists('order', 'kode_order')],
            'kode_produk' => ['nullable', 'required_without:kode_jasa', 'string', 'max:255', Rule::exists('produk', 'kode_produk')],
            'kode_jasa' => ['nullable', 'required_without:kode_produk', 'string', 'max:255', Rule::exists('jasa', 'kode_jasa')],
            'harga' => ['required', 'integer', 'min:0'],
            'qty' => ['required', 'integer', 'min:1'],
            'diskon' => ['required', 'integer', 'min:0', 'max:100'],
            'id_kasir' => ['required', 'integer', Rule::exists('users', 'id')],
            'tanggal' => ['required', 'date'],
        ];
    }
}
