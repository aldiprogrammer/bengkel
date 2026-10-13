<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PegawaiRequest extends FormRequest
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
            'kode_pegawai' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pegawai', 'kode_pegawai')->ignore($this->route('pegawai')),
            ],
            'nama' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', Rule::in(['Mekanik', 'Kasir', 'Administrasi', 'Kepala Bengkel'])],
            'no_hp' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'alamat' => ['required', 'string'],
            'tanggal_masuk' => ['required', 'date'],
            'status' => ['required', Rule::in(['Aktif', 'Nonaktif'])],
        ];
    }
}
