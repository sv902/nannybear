<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NannyPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'gender',
        'specialization',
        'work_schedule',
        'education',
        'languages',
        'additional_skills',
        'experience_years',
        'hourly_rate',
    ];

    // Відношення до профілю батька
    public function parentProfile()
    {
        return $this->belongsTo(ParentProfile::class, 'parent_id');
    }
}
