<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarehousesInCarsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses_in_cars', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('car_id');
            $table->unsignedInteger('warehouse_id');
            $table->unsignedInteger('user_get_id');
            $table->unsignedInteger('user_approved_id');
            $table->string('document_name')->unique();
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->foreign('car_id')->references('id')->on('cars');
            $table->foreign('warehouse_id')->references('id')->on('warehouses');
            $table->foreign('user_get_id')->references('id')->on('users');
            $table->foreign('user_approved_id')->references('id')->on('users');
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
        Schema::dropIfExists('warehouses_in_cars');
    }
}
