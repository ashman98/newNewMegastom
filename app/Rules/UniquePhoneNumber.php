<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\Patient;

class UniquePhoneNumber implements ValidationRule
{
    protected $patientId;

    /**
     * Конструктор для передачи ID текущего пациента
     */
    public function __construct($patientId)
    {
        $this->patientId = $patientId;
    }

    /**
     * Проверка правила валидации
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  Closure  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $exists = Patient::where('phone', $value)
            ->where('id', '!=', $this->patientId->id)
            ->exists();

        if ($exists) {
            $fail('Այս հեռախոսահամարը արդեն գրանցված է։');
        }
    }
}
