<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'surname', 'phone', 'city', 'address', 'active','birthday','gender'];


    public function treatments(): HasMany
    {
        return $this->hasMany(Treatment::class);
    }

    public function diseases(): BelongsToMany
    {
        return $this->belongsToMany(
            Disease::class,
            'patient_diseases',
            'patient_id',
            'diseases_id'
        );
    }
}
