<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarehousesInCarsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses_in_cars_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('warehouses_in_car_id');
            $table->unsignedInteger('item_id');
            $table->integer('quantity');
            $table->timestamps();
            
            $table->foreign('warehouses_in_car_id')->references('id')->on('warehouses_in_cars');
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
        Schema::dropIfExists('warehouses_in_cars_items');
    }
}
