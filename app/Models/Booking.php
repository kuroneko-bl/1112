<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'room_type',
        'start_date',
        'payment_method',
        'status',
        'review',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
