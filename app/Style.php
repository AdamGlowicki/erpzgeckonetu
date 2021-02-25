<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Style extends Model
{
    protected $fillable = ['width', 'height', 'backgroundColor', 'radius', 'borderSize', 'borderType', 'borderColor', 'fontSize', 'fontWeight', 'color', 'rotate', 'node_data_id'];
    protected $table = 'styles';

    public function deleteStyle() {

        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
