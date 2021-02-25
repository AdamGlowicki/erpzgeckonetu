<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rma extends Model
{
    protected $fillable = [
        'document_id',
        'user_id',
        'contractor_id',
        'warehouses_in_id',
        'rmas_reason_id',
        'warehouse_id',
        'document_name',
        'note',
        'type',
        'rma_status',
        'end_status',
        'contractor_rma_id',
        'new_invoice',
        'sent_at',
        'received_at',
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function contractor() {
        return $this->belongsTo('App\Contractor');
    }

    public function warehousesIn() {
        return $this->belongsTo('App\WarehousesIn');
    }

    public function rmasItem() {
        return $this->hasMany('App\RmasItem')->where('new', false);
    }

    public function rmasItemNew() {
        return $this->hasMany('App\RmasItem')->where('new', true);
    }

    public function rmasReason() {
        return $this->belongsTo('App\RmasReason');
    }

    public function rmasStock() {
        return $this->hasMany('App\RmasStock');
    }
}
