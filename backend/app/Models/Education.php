<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $table = 'educations'; 

    protected $fillable = [
        'nanny_profile_id',
        'institution',
        'specialty',
        'years',
        'diploma_image', 
    ];

    public function nannyProfile()
    {
        return $this->belongsTo(NannyProfile::class);
    }
}
