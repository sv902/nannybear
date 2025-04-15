<?php

// app/Models/FavoriteNanny.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteNanny extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'nanny_id'];

    // Зв'язок з профілем няні
    public function nanny()
    {
        return $this->belongsTo(NannyProfile::class, 'nanny_id');
    }
}
