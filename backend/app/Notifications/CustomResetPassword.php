<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPassword extends Notification
{
    public $token;

    /**
     * Створюємо новий інстанс повідомлення.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Визначаємо, через який канал надсилати повідомлення (email).
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Будуємо email для користувача.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Скидання пароля')
            ->greeting('Привіт, ' . $notifiable->name . '!')
            ->line('Ви отримали цей лист, тому що запросили скидання пароля.')
            ->action('Скинути пароль', url('/reset-password/' . $this->token))
            ->line('Якщо ви не робили цей запит, просто проігноруйте цей лист.')
            ->salutation('З найкращими побажаннями, команда Nanny Bear!');
    }
}
