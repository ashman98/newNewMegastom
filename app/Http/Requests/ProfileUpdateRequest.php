<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'surname' => 'required|string|max:255',
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique(User::class)->ignore($this->user()->id),
                ],
            'city' => 'required|string|max:100',
            'address' => 'required|string|max:255',
            'gender' => 'string',
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
        ];
    }
}
