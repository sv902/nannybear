<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkingHour extends Model
{
    use HasFactory;

    protected $fillable = [
        'nanny_id',
        'start_date',
        'start_time',
        'end_time',
        'is_available',
    ];

    public function nanny()
    {
        return $this->belongsTo(NannyProfile::class, 'nanny_id');
    }

    public function getEndTimeAttribute($value)
    {
        if ($value) return $value;

        $start = strtotime($this->start_time);
        return date('H:i:s', $start + 3600);
    }
}
