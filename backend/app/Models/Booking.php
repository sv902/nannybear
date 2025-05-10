<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',       // ID профілю батька
        'nanny_id',        // ID профілю няні
        'address_id',      // обрана адреса
        'start_date',      // початкова дата
        'end_date',        // кінцева дата (може збігатися з start_date)
        'start_time',      // час початку (для одного дня або початкового слоту)
        'end_time',        // час завершення (остання година)
        'payment_type',    // 'card' або 'cash'
        'hourly_rate',     // ставка за годину
        'total_price',     // загальна сума
        'status',          // pending | confirmed | cancelled
        'nanny_approval',  // true | false | null
    ];

    protected $casts = [
        'nanny_approval' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
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

    public function bookingDays()
    {
        return $this->hasMany(BookingDay::class);
    }

}

