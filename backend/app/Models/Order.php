<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'nanny_id',
        'status',
        'date',
        'start_time',
        'end_time',
        'total_price',
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Зв’язок: замовлення належить батькові.
     */
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    /**
     * Зв’язок: замовлення належить няні.
     */
    public function nanny()
    {
        return $this->belongsTo(User::class, 'nanny_id');
    }
}
