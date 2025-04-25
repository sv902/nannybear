<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParentAddress extends Model
{
    protected $fillable = [
        'type', 'city', 'district', 'address', 'floor', 'apartment',
    ];

    public function parentProfile()
    {
        return $this->belongsTo(ParentProfile::class);
    }
}
