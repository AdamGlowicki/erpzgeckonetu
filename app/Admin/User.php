<?php

namespace App\Admin;

use Fico7489\Laravel\EloquentJoin\Traits\EloquentJoin;

class User extends \App\User
{
    use EloquentJoin;

    protected $guard_name = 'api';

    public function getMorphClass() {
        return 'App\User';
    }
}
