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
            'name.required' => 'Անունը պարտադիր է լրացման համար։',
            'surname.required' => 'Ազգանունը պարտադիր է լրացման համար։',
            'phone.required' => 'Հեռախոսահամարը պարտադիր է լրացման համար։',
            'phone.unique' => 'Այս հեռախոսահամարը արդեն գրանցված է։',
            'birthday.required' => 'Ծննդյան ամսաթիվը պարտադիր է լրացման համար։',
            'city.required' => 'Քաղաքը պարտադիր է լրացման համար։',
            'address.required' => 'Հասցեն պարտադիր է լրացման համար։',
            'patient_diseases.array' => 'Հիվանդությունների դաշտը պետք է լինի զանգված։',
            'patient_diseases.*.label.required' => 'Յուրաքանչյուր հիվանդություն պետք է ունենա անուն (label)։',
            'patient_diseases.*.value.required' => 'Յուրաքանչյուր հիվանդություն պետք է ունենա արժեք (value)։',
        ];
    }
}
