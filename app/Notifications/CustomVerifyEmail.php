<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Auth\Notifications\VerifyEmail;

class CustomVerifyEmail extends VerifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
    return ['mail'];
    }

   /**
     * Отримання поштового представлення нотифікації.
     *
     * @param  object  $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        \Log::info('Verification URL: ' . $verificationUrl);


         return (new MailMessage)
                ->subject('Підтвердження електронної пошти')
                ->greeting('Вітаємо!')
                ->line('Будь ласка, натисніть кнопку нижче, щоб підтвердити свою електронну адресу.')
                ->action('Підтвердити електронну пошту', $verificationUrl)
                ->line('Якщо ви не створювали обліковий запис, ніяких дій не потрібно.')
                ->salutation('З повагою, Команда Nanny Bear');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  object  $notifiable
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            //
        ];
    }
}
