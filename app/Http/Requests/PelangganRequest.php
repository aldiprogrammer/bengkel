<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PelangganRequest extends FormRequest
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
            'kode_pelanggan' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pelanggan', 'kode_pelanggan')->ignore($this->route('pelanggan')),
            ],
            'nama' => ['required', 'string', 'max:255'],
            'no_hp' => ['required', 'string', 'max:30'],
            'alamat' => ['required', 'string'],
            'kendaraan' => ['required', 'string', 'max:255'],
            'nomor_plat' => ['required', 'string', 'max:20'],
        ];
    }
}
