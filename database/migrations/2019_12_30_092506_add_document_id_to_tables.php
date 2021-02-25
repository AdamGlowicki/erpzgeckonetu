<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDocumentIdToTables extends Migration
{
    private $tables = [
        'warehouses_in' => \App\WarehousesIn::class,
        'warehouses_moves' => \App\WarehousesMove::class,
        'warehouses_out_cars' => \App\WarehousesOutCar::class,
        'warehouses_in_cars' => \App\WarehousesInCar::class,
        'rmas' => \App\Rma::class,
        'requests' => \App\Request::class,
        'investments' => \App\Investment::class,
        'cars_outs' => \App\CarsOut::class,
        'cars_ins' => \App\CarsIn::class,
        'cars_moves' => \App\CarsMove::class,
        'bhp_outs' => \App\BhpOut::class,
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        foreach($this->tables as $table => $class) {
            Schema::table($table, function (Blueprint $table) {
                $table->unsignedInteger('document_id')->after('id')->default(0);
            });

            $i = 1;

            foreach($class::all() as $object) {
                $object->document_id = $i;
                $object->save();

                $i++;
            }

            $latest = $class::latest()->first();

            if($latest) {
                $latest->document_id = $latest->id;
                $latest->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        foreach($this->tables as $table => $class) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropColumn('document_id');
            });
        }
    }
}
