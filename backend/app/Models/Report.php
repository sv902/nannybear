<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'reported_user_id',
        'reporter_user_id',
        'reason',
        'details',      
    ];

    protected $casts = [
        'reason' => 'array',
    ];
    
    public function reportedUser()
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }

    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'reporter_user_id');
    }

}
