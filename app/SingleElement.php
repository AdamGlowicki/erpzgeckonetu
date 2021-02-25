<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SingleElement extends Model
{
    protected $table = 'single_elements';
    protected $fillable = ['width', 'height', 'backgroundColor', 'radius', 'borderSize', 'borderType', 'borderColor', 'fontSize', 'fontWeight', 'color', 'rotate', 'dataId'];

    public function deleteElement() {

        try {
            return parent::delete();
        } catch (\Exception $e) {
        }
    }
}
