<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDentistRequest extends FormRequest
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
            'phone' => 'required|string|unique:users,phone|max:20',
//            'birthday' => 'required|date', // Дата рождения
            'city' => 'required|string|max:100',
            'address' => 'required|string|max:255',
            'gender' => 'string',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Անունը պարտադիր է լրացման համար։',
            'surname.required' => 'Ազգանունը պարտադիր է լրացման համար։',
            'phone.required' => 'Հեռախոսահամարը պարտադիր է լրացման համար։',
            'phone.unique' => 'Այս հեռախոսահամարը արդեն գրանցված է։',
//        'birthday.required' => 'Ծննդյան ամսաթիվը պարտադիր է լրացման համար։',
            'city.required' => 'Քաղաքը պարտադիր է լրացման համար։',
            'address.required' => 'Հասցեն պարտադիր է լրացման համար։',
            'email.required' => 'Էլ․ փոստը պարտադիր է լրացման համար։',
            'email.email' => 'Մուտքագրեք ճիշտ էլ․ փոստի հասցե։',
            'email.unique' => 'Այս էլ․ փոստը արդեն գրանցված է։',
            'password.required' => 'Գաղտնաբառը պարտադիր է լրացման համար։',
            'password.min' => 'Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ։',
        ];
    }

}
