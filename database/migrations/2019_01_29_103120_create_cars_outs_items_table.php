<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarsOutsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cars_outs_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('cars_out_id');
            $table->unsignedInteger('item_id');
            $table->integer('quantity');

            $table->foreign('cars_out_id')->references('id')->on('cars_outs');
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
        Schema::table('cars_outs_items', function (Blueprint $table) {
            $table->dropForeign(['cars_out_id']);
            $table->dropForeign(['item_id']);
        });

        Schema::dropIfExists('cars_outs_items');
    }
}
