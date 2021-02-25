<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Fico7489\Laravel\EloquentJoin\Traits\EloquentJoin;

class Lead extends Model
{
    use EloquentJoin;

    protected $fillable = ['user_id', 'name', 'city', 'city_teryt', 'street', 'street_teryt', 'building_num', 'apartment_num', 'phone', 'offer', 'contract_end_at'];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function terytSimc() {
        return $this->belongsTo('App\TerytSimc', 'city_teryt', 'SYM');
    }

    public function terytUlic() {
        return $this->belongsTo('App\TerytUlic', 'street_teryt', 'SYM_UL');
    }
}
