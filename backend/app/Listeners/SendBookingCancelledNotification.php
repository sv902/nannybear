<?php

namespace App\Listeners;

use App\Events\BookingCancelled;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendBookingCancelledNotification implements ShouldQueue
{
    public function handle(BookingCancelled $event)
    {
        $nannyUser = $event->booking->nanny->user;
        $nannyUser->notify(new BookingCancelledNotification($event->booking));
    }
}
