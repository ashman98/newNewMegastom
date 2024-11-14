<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateToothRequest extends FormRequest
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
//            'tooth_number' => [
//                'required',
//                'integer',
//                function ($attribute, $value, $fail) {
//                    $validToothNumbers = [
//                        55, 54, 53, 52, 51,
//                        61, 62, 63, 64, 65,
//                        85, 84, 83, 82, 81,
//                        71, 72, 73, 74, 75,
//                        18, 17, 16, 15, 14, 13, 12, 11,
//                        21, 22, 23, 24, 25, 26, 27, 28,
//                        48, 47, 46, 45, 44, 43, 42, 41,
//                        31, 32, 33, 34, 35, 36, 37, 38
//                    ];
//
//                    // Validate based on the patient's age group
//                    if (!in_array($value, $validToothNumbers)) {
//                        $fail("The selected tooth number is invalid.");
//                    }
//                }
//            ],
//            'title' => 'required|string|max:255',
//            'images' => 'array|max:3', // Allow up to 3 images
//            'images.*' =>  'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Each image should be valid and under 2MB
//            'treatment_id' => 'required|integer|exists:treatments,id', // Validate treatment_id exists in the treatments table
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tooth_number.required' => 'The tooth number is required.',
            'tooth_number.integer' => 'The tooth number must be an integer.',
            'tooth_number.in' => 'The selected tooth number is invalid.',

            'title.required' => 'Please provide a title for the tooth record.',
            'title.string' => 'The title should be a string.',
            'title.max' => 'The title cannot exceed 255 characters.',

            'images.array' => 'The images field must be an array.',
            'images.max' => 'You may upload a maximum of 3 images.',
            'images.*.image' => 'Each file in the images array must be an image.',
            'images.*.mimes' => 'Images must be in one of the following formats: jpeg, png, jpg, gif, svg, webp.',
            'images.*.max' => 'Each image must be under 2MB in size.',

            'treatment_id.required' => 'The treatment ID is required.',
            'treatment_id.integer' => 'The treatment ID must be an integer.',
            'treatment_id.exists' => 'The selected treatment ID does not exist.',
        ];
    }
}
