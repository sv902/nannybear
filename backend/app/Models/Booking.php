<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'nanny_id',
        'address_id',
        'date',
        'start_time',
        'end_time',
        'payment_type',
        'hourly_rate',
        'total_price',
        'status',
        'nanny_approval',
    ];

    // 🔁 Зв’язок з батьківським профілем
    public function parent()
    {
        return $this->belongsTo(ParentProfile::class, 'parent_id');
    }

    // 🔁 Зв’язок з профілем няні
    public function nanny()
    {
        return $this->belongsTo(NannyProfile::class, 'nanny_id');
    }

    // 🔁 Зв’язок з адресою
    public function address()
    {
        return $this->belongsTo(ParentAddress::class, 'address_id');
    }
}

