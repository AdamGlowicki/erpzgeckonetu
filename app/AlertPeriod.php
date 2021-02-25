<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AlertPeriod extends Model
{
    protected $table = 'alerts_periods';
    protected $fillable = ['kms', 'days'];
}
