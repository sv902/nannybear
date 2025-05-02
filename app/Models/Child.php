<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'birth_date',
        'parent_profile_id',
    ];

    /**
     * Зв'язок: Дитина належить до профілю батька.
     */
    public function parentProfile()
    {
        return $this->belongsTo(ParentProfile::class);
    }
}
