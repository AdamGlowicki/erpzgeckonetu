<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    protected $with = ['children'];
    protected $fillable = ['document_id', 'parent_id', 'user_id', 'car_id', 'name', 'investment_name', 'descr', 'date_start', 'date_end', 'warehouse_id', 'request_id', 'num_year', 'num_year_id', 'num_city', 'num_city_id', 'num_type'];

    public function children() {
        return $this->hasMany('App\Investment', 'parent_id', 'id')->with(['user']);
    }

    public function parent() {
        return $this->belongsTo('App\Investment', 'parent_id', 'id')->with(['user']);
    }

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function investmentsItem() {
        return $this->hasMany('App\InvestmentsItem');
    }

    public function investmentsQueueItem() {
        return $this->hasMany('App\InvestmentsQueueItem');
    }

    public function file() {
        return $this->morphMany('App\File', 'file');
    }

    public function request() {
        return $this->belongsTo('App\Request');
    }

    public function getYearId($year) {
        $result = $this->where('num_year', $year)->first();

        if($result) {
            return $this->where('num_year', $year)->max('num_year_id') + 1;
        }

        return 1;
    }

    public function getCityId($city, $year) {
        $result = $this->where('num_city', $city)->where('num_year', $year)->first();

        if($result) {
            return $this->where('num_city', $city)->where('num_year', $year)->max('num_city_id') + 1;
        }

        return 1;
    }

    public function scopeParentsOnly($query) {
        return $query->where('parent_id', null);
    }
}
