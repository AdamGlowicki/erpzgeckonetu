<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InvestFile extends Model
{
    protected $fillable = ['name', 'data', 'invest_id'];
    protected $table = 'invest_files';

    public function invest() {
        return $this->belongsTo(Invest::class);
    }
}
