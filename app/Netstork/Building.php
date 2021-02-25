<?php

namespace App\Netstork;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Building extends Model
{
    protected $connection = 'sqlsrv';
    protected $table = 'Building';

    protected static function boot() {
        parent::boot();

        static::addGlobalScope('location', function (Builder $builder) {
            $builder->addSelect('*', \DB::raw('location.STAsText() AS location, location_text.STAsText() AS location_text, area.STAsText() AS area'));
        });
    }

    public function address() {
        return $this->belongsTo('App\Netstork\Address', 'address_id');
    }

    public function buildingStatus() {
        return $this->belongsTo('App\Netstork\BuildingStatus', 'status_id');
    }

    public function buildingTechnology() {
        return $this->belongsTo('App\Netstork\BuildingTechnology', 'technology_id');
    }

    public function buildingType() {
        return $this->belongsTo('App\Netstork\BuildingType', 'type_id');
    }
}
