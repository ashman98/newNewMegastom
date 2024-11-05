<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Treatment extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'title',
        'diagnosis',
        'treatment_plan',
        'amount',
        'dentist_id',
        'patient_id',
        'del_status',
        'treatment_plan_start_date',
        'treatment_plan_end_date',
    ];

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class, 'dentist_id', 'id', 'users');
    }

    public function patient():BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }


    public function teeth(): HasMany
    {
        return $this->hasMany(Tooth::class);
    }
}
