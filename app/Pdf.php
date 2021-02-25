<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DomPDF;

class Pdf extends Model
{
    public function create($view, $data) {
        activity()
            ->withProperties(['username' => auth()->user()->username])
            ->log('Wygenerowano dokument PDF');

        return DomPDF::setOptions([
                'defaultFont' => 'Courier',
                'fontCache' => storage_path('fonts/'),
                'isHtml5ParserEnabled' => true,
                'chroot' => base_path(),
            ])
            ->loadView($view, $data)
            ->stream(str_random(128) . '.pdf');
    }
}
