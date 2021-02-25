<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InvestmentMailProperty extends Model
{
    private $mail;

    /**
     * @return mixed
     */
    public function getMail()
    {
        return $this->mail;
    }

    /**
     * @param mixed $mail
     */
    public function setMail($mail): void
    {
        $this->mail = $mail;
    }
}
