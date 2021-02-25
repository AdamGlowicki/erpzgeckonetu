<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Invest extends Model
{
    protected $fillable = ['parent_id', 'level', 'client', 'stage_name', 'main', 'country', 'adder', 'add_date', 'deadline', 'tech', 'description', 'condition', 'condition_term', 'arrangements', 'group', 'inv_code', 'address', 'warehouse', 'car_id', 'warehouse_id', 'num_type', 'investment_id'];
    protected $table = 'invests';

    public function investFiles() {
        return $this->hasMany(InvestFile::class);
    }

    public function tasks() {
        return $this->hasMany(Task::class);
    }

    public function drawers() {
        return $this->belongsTo(Drawer::class);
    }

    public function removeInvest($invest_id) {
        Task::where('invest_id', $invest_id)->each(function($item) {
            $item->removeTask($item->id);
        });

        $this->investFiles()->delete();

        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
