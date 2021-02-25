<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarehousesOutCarsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses_out_cars_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('warehouses_out_car_id');
            $table->unsignedInteger('item_id');
            $table->integer('quantity');
            $table->timestamps();

            $table->foreign('warehouses_out_car_id')->references('id')->on('warehouses_out_cars');
            $table->foreign('item_id')->references('id')->on('items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('warehouses_out_cars_items', function (Blueprint $table) {
            $table->dropForeign(['warehouses_out_car_id']);
            $table->dropForeign(['item_id']);
        });
    }
}
