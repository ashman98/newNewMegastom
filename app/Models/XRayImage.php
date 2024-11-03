<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class XRayImage extends Model
{
    use HasFactory;

    public function tooth(): BelongsTo
    {
        return $this->belongsTo(Tooth::class);
    }
}
