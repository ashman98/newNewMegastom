<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Разрешаем всем пользователям выполнять этот запрос
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'phone' => 'required|string|unique:patients,phone|max:20',
//            'dateOfBirth' => 'required|date', // Дата рождения
            'city' => 'required|string|max:100',
            'address' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Имя обязательно для заполнения.',
            'surname.required' => 'Фамилия обязательна для заполнения.',
            'phone.required' => 'Телефон обязателен для заполнения.',
            'phone.unique' => 'Этот телефон уже зарегистрирован.',
//            'dob.required' => 'Дата рождения обязательна для заполнения.',
            'city.required' => 'Город обязателен для заполнения.',
            'address.required' => 'Адрес обязателен для заполнения.',
        ];
    }
}
