<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentReview extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'nanny_profile_id',
        'parent_profile_id',
        'rating',
        'comment',
    ];
  
    public function parent()
    {
        return $this->belongsTo(\App\Models\ParentProfile::class, 'parent_profile_id');
    }

    public function nanny()
    {
        return $this->belongsTo(\App\Models\NannyProfile::class, 'nanny_profile_id');
    }
}

