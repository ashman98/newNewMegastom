<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTreatmentRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:40',
            'diagnosis' => 'nullable|string',
            'treatment_plan' => 'nullable|string',
            'amount' => 'nullable|numeric',
            'treatment_plan_start_date' => 'required|date',
            'treatment_plan_end_date' => 'nullable|date|after:treatment_plan_start_date',
        ];
    }

    /**
     * Get the validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Поле заголовка обязательно для заполнения.',
            'title.string' => 'Заголовок должен быть строкой.',
            'title.max' => 'Заголовок не может превышать 100 символов.',
//            'diagnosis.required' => 'Поле диагноза обязательно для заполнения.',
            'diagnosis.string' => 'Диагноз должен быть строкой.',
            'treatment_plan.string' => 'План лечения должен быть строкой.',
            'amount.numeric' => 'Сумма должна быть числом.',
            'treatment_plan_start_date.required' => 'Дата начала плана лечения обязательна.',
            'treatment_plan_start_date.date_format' => 'Дата начала плана лечения должна быть в формате YYYY-MM-DD HH:MM:SS.',
            'treatment_plan_end_date.date_format' => 'Дата окончания плана лечения должна быть в формате YYYY-MM-DD HH:MM:SS.',
            'treatment_plan_end_date.after' => 'Дата окончания плана лечения должна быть позже даты начала плана лечения.',
        ];
    }

}
