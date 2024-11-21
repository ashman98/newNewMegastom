<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $with = ['roles'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'name',
        'surname',
        'email',
        'password',
        'surname',
        'phone',
        'region',
        'city',
        'address',
        'email_verified_at',
        'remember_token',
        'remember_token_expires_at',
        'gender'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'email_verified_code',
        'email_verification_expires_at',
        'name',
        'email',
        'password',
        'surname',
        'phone',
        'region',
        'city',
        'address',
        'zip',
        'email_verified_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'permissions'          => 'array',
    ];

//    /**
//     * The attributes for which you can use filters in url.
//     *
//     * @var array
//     */
//    protected $allowedFilters = [
//        'id'         => Where::class,
//        'name'       => Like::class,
//        'email'      => Like::class,
//        'updated_at' => WhereDateStartEnd::class,
//        'created_at' => WhereDateStartEnd::class,
//    ];

    /**
     * The attributes for which can use sort in url.
     *
     * @var array
     */
    protected $allowedSorts = [
        'id',
        'name',
        'email',
        'updated_at',
        'created_at',
    ];


    public function treatments(): HasMany
    {
        return $this->hasMany(Treatment::class);
    }
}
