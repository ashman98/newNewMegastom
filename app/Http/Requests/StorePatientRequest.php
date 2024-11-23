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
            'birthday' => 'required|date', // Дата рождения
            'city' => 'required|string|max:100',
            'address' => 'required|string|max:255',
            'gender' => 'string',
            'patient_diseases' => 'array', // Поле должно быть массивом
//            'patient_diseases.*.label' => 'required|string|max:255', // Каждый элемент должен иметь label
//            'patient_diseases.*.value' => 'required|string|max:255',

        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Имя обязательно для заполнения.',
            'surname.required' => 'Фамилия обязательна для заполнения.',
            'phone.required' => 'Телефон обязателен для заполнения.',
            'phone.unique' => 'Этот телефон уже зарегистрирован.',
            'birthday.required' => 'Дата рождения обязательна для заполнения.',
            'city.required' => 'Город обязателен для заполнения.',
            'address.required' => 'Адрес обязателен для заполнения.',
            'patient_diseases.array' => 'Поле заболеваний должно быть массивом.',
            'patient_diseases.*.label.required' => 'Каждое заболевание должно иметь название (label).',
            'patient_diseases.*.value.required' => 'Каждое заболевание должно иметь значение (value).',

        ];
    }
}
