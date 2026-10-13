<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JasaRequest extends FormRequest
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
            'kode_jasa' => [
                'required',
                'string',
                'max:255',
                Rule::unique('jasa', 'kode_jasa')->ignore($this->route('jasa')),
            ],
            'nama_jasa' => ['required', 'string', 'max:255'],
            'harga' => ['required', 'integer', 'min:0'],
        ];
    }
}
