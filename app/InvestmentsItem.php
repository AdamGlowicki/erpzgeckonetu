<?php

namespace App;

use Fico7489\Laravel\EloquentJoin\Traits\EloquentJoin;
use Illuminate\Database\Eloquent\Model;

class InvestmentsItem extends Model
{
    use EloquentJoin;

    protected $fillable = ['investment_id', 'item_id', 'quantity', 'quantity_assets'];

    public function investment() {
        return $this->belongsTo('App\Investment');
    }

    public function item() {
        return $this->belongsTo('App\Item');
    }

    public function element() {
        return $this->morphMany('App\Element', 'element');
    }
}
