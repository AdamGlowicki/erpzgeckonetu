<?php

namespace App;

use App\Scopes\HiddenScope;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $with = ['children'];

    protected $fillable = ['items_manufacturer_id', 'parent_id', 'items_category_id', 'unit_id', 'model_name', 'descr', 'low_quant', 'has_data', 'photo', 'hidden'];

    /* protected static function boot() {
        parent::boot();

        static::addGlobalScope(new HiddenScope);
    } */

    public function children() {
        return $this->hasMany('App\Item', 'parent_id', 'id')->with(['unit', 'itemsManufacturer', 'itemsCategory']);
    }

    public function parent() {
        return $this->belongsTo('App\Item', 'parent_id', 'id')->with(['unit', 'itemsManufacturer', 'itemsCategory']);
    }

    public function itemsManufacturer() {
        return $this->belongsTo('App\ItemsManufacturer');
    }

    public function itemsCategory() {
        return $this->belongsTo('App\ItemsCategory', 'items_category_id');
    }

    public function unit() {
        return $this->belongsTo('App\Unit');
    }

    public function warehousesPlace() {
        return $this->hasMany('App\WarehousesPlace');
    }

    public function warehousesStock() {
        return $this->hasMany('App\WarehousesStock');
    }

    public function warehousesInItem() {
        return $this->hasMany('App\WarehousesInItem');
    }

    public function warehousesOutCarsItem() {
        return $this->hasMany('App\WarehousesOutCarsItem');
    }

    public function carsOutsItem() {
        return $this->hasMany('App\CarsOutsItem')->selectRaw('`item_id`, SUM(`quantity`) AS `quantity`')->groupBy('item_id');
    }

    public function carsItem() {
        return $this->hasMany('App\CarsItem')->selectRaw('`item_id`, SUM(`quantity`) AS `quantity`')->groupBy('item_id');
    }

    public function avgPrice() {
        return $this->warehousesInItem()->selectRaw('`item_id`, AVG(`price_notax`) AS `avg`')->groupBy('item_id');
    }

    public function quantity() {
        return $this->warehousesStock()->leftJoin('warehouses', 'warehouses.id', '=', 'warehouses_stocks.warehouse_id')->where('warehouses.type', 0)->selectRaw('`item_id`, SUM(`quantity`) AS `quantity`')->groupBy('item_id');
    }

    public function quantityCars() {
        return $this->carsItem()->leftJoin('cars', 'cars.id', '=', 'cars_items.car_id')->selectRaw('`item_id`, SUM(`quantity`) AS `quantity`')->groupBy('item_id');
    }

    /**
     * Show hidden items scope
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithoutHidden($query) {
        return $query->where('hidden', false);
    }

    /**
     * Show elements without parent_id
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeParentsOnly($query) {
        return $query->where('parent_id', null);
    }
}
