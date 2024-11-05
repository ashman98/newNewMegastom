<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTreatmentRequest extends FormRequest
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
            'treatment_plan_start_date' => 'required|date',
            'patient_id' => 'required|exists:patients,id',
        ];
    }

    /**
     * Custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'patient_id.exists' => 'The selected patient does not exist in our records.',
            'title.required' => 'The title field is required.',
            'title.max' => 'The title may not be greater than 40 characters.', // Custom message for max rule on title
//            'diagnosis.required' => 'Please provide a diagnosis.',
            'treatment_plan_start_date.required' => 'The start date for the treatment plan is required.',
            'treatment_plan_start_date.date' => 'The start date must be a valid date.',
            // Add other custom messages as needed
        ];
    }
}
