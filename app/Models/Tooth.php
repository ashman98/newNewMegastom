<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tooth extends Model
{
    use HasFactory;

    public function treatment(): BelongsTo
    {
        return $this->belongsTo(Treatment::class);
    }

    public function xRayImages(): HasMany
    {
        return $this->hasMany(XRayImage::class);
    }
}
