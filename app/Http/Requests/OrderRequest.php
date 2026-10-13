<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderRequest extends FormRequest
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
            'kode_order' => [
                'required',
                'string',
                'max:255',
                Rule::unique('order', 'kode_order')->ignore($this->route('order')),
            ],
            'pelanggan' => ['required', 'string', 'max:255'],
            'montir' => ['nullable', 'string', 'max:255'],
            'uang' => ['required', 'integer', 'min:0'],
            'kembalian' => ['required', 'integer', 'min:0'],
            'metode_pembayaran' => ['required', 'string', 'max:255'],
            'total_harga' => ['required', 'integer', 'min:0'],
            'diskon' => ['required', 'integer', 'min:0', 'max:100'],
            'grand_total' => ['required', 'integer', 'min:0'],
            'tanggal' => ['required', 'date'],
            'status_struk' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
