<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'reported_user_id',
        'submitted_by_id',
        'reason',
        'details',
        'status'
    ];
    
    public function reportedUser()
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }

    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by_id');
    }

}
