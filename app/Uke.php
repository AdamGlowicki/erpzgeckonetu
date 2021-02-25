<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Uke extends Model
{
    protected $table = 'uke';
    protected $fillable = ['obj_id', 'name', 'type', 'nip', 'krs', 'address', 'data'];
}
