<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InvestmentsQueueItem extends Model
{
    protected $fillable = ['investment_id', 'item_id', 'quantity', 'quantity_used', 'comment'];

    public function investment() {
        return $this->belongsTo('App\Investment');
    }

    public function item() {
        return $this->belongsTo('App\Item');
    }
}
