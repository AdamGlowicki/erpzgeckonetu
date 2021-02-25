<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Benwilkins\FCM\FcmMessage;

class NewEventNotification extends Notification implements ShouldQueue
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
        return ['fcm'];
    }

    /**
     * Get the FCM representation of the notification.
     *
     * @param mixed $notifiable
     * @return FcmMessage
     * @throws \Exception
     */
    public function toFcm($notifiable)
    {
        $message = new FcmMessage();
        $message->content([
            'title'        => 'Nowe zadanie',
            'body'         => $this->object->title .' - '.
                (new \DateTime($this->object->start, new \DateTimeZone(config('app.timezone'))))->format('H:i d-m-Y'),
            'sound'        => 'default',
            'icon'         => 'ic_stat_name',
            'click_action' => 'event',
        ])->data([
            'id' => $this->object->id,
        ])->priority(FcmMessage::PRIORITY_HIGH);

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [];
    }
}
