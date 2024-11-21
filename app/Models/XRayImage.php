<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class XRayImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'path',
        'tooth_id',
        'del_status'
    ];


    public function tooth(): BelongsTo
    {
        return $this->belongsTo(Tooth::class);
    }

    /**
     * Generate the full path to the image file.
     *
     * @param string|null $tooth_id
     * @return string
     */
    public static function getPathOfImage(string $tooth_id = null): string
    {
        return 'uploads/teeth_images/' . $tooth_id;
    }
}
