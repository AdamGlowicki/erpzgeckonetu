<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarsMovesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cars_moves', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_in_id');
            $table->unsignedInteger('user_out_id');
            $table->unsignedInteger('car_in_id');
            $table->unsignedInteger('car_out_id');
            $table->string('document_name');
            $table->string('notes')->nullable();
            $table->boolean('approved')->default(false);
            $table->timestamps();
            
            $table->foreign('user_in_id')->references('id')->on('users');
            $table->foreign('user_out_id')->references('id')->on('users');
            $table->foreign('car_in_id')->references('id')->on('cars');
            $table->foreign('car_out_id')->references('id')->on('cars');
        });
        
        Schema::create('cars_moves_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('cars_move_id');
            $table->unsignedInteger('item_id');
            $table->integer('quantity');
            $table->timestamps();
            
            $table->foreign('cars_move_id')->references('id')->on('cars_moves');
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
        Schema::dropIfExists('cars_moves_items');
        Schema::dropIfExists('cars_moves');
    }
}
