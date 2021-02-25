<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GraphPermission extends Model
{
    protected $fillable = ['user_id', 'permission'];
    protected $table = 'graph_permissions';
}
