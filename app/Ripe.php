<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ripe extends Model
{
    protected $table = 'ripe';
    protected $fillable = ['org_name', 'email', 'notify', 'address', 'phone', 'person', 'descr', 'ref_nfy'];
}
