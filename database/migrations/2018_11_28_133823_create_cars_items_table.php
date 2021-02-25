<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cars_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('car_id');
            $table->unsignedInteger('item_id');
            $table->unsignedInteger('quantity');
            $table->timestamps();

            $table->foreign('car_id')->references('id')->on('cars');
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
        Schema::create('cars_items', function (Blueprint $table) {
            $table->dropForeign(['car_id']);
            $table->dropForeign(['item_id']);
        });

        Schema::dropIfExists('cars_items');
    }
}
