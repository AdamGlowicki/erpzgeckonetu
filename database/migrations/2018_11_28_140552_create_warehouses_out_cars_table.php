<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarehousesOutCarsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses_out_cars', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('car_id');
            $table->unsignedInteger('warehouse_id');
            $table->unsignedInteger('user_approved_id');
            $table->unsignedInteger('user_get_id');
            $table->string('document_name');
            $table->string('notes');
            $table->timestamps();

            $table->foreign('car_id')->references('id')->on('cars');
            $table->foreign('warehouse_id')->references('id')->on('warehouses');
            $table->foreign('user_approved_id')->references('id')->on('users');
            $table->foreign('user_get_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('warehouses_out_cars', function (Blueprint $table) {
            $table->dropForeign(['car_id']);
            $table->dropForeign(['warehouse_id']);
            $table->dropForeign(['user_approved_id']);
            $table->dropForeign(['user_get_id']);
        });
    }
}
