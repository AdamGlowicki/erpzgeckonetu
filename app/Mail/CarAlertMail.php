<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CarAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public $carAlert;

    /**
     * Create a new message instance.
     *
     * @param $carAlert
     */
    public function __construct($carAlert)
    {
        $this->carAlert = $carAlert;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('erp@geckonet.pl')->view('emails.carService.carAlert')->subject('Serwis samochodów');
    }
}
