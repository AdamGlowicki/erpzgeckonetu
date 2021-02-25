<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarsInsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cars_ins_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('cars_in_id');
            $table->unsignedInteger('item_id');
            $table->integer('quantity');
            
            $table->foreign('cars_in_id')->references('id')->on('cars_ins');
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
        Schema::table('cars_ins_items', function (Blueprint $table) {
            //
        });
    }
}
