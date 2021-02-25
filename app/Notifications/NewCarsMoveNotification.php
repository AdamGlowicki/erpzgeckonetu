<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewCarsMoveNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $object;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($object)
    {
        $this->object = $object;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable) {
        return [
            'id' => $this->object->id,
            'from' => $this->object->user_in->name,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'data' => [
                'id' => $this->object->id,
                'from' => $this->object->user_in->name,
            ],
        ];
    }
}
