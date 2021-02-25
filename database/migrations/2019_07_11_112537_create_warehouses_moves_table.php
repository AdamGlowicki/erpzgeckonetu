<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarehousesMovesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses_moves', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('warehouse_in_id');
            $table->unsignedInteger('warehouse_out_id');
            $table->string('document_name');
            $table->string('notes')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('warehouse_in_id')->references('id')->on('warehouses');
            $table->foreign('warehouse_out_id')->references('id')->on('warehouses');
        });
        
        Schema::create('warehouses_moves_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('warehouses_move_id');
            $table->unsignedInteger('item_id');
            $table->integer('quantity');
            $table->timestamps();
            
            $table->foreign('warehouses_move_id')->references('id')->on('warehouses_moves');
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
        Schema::dropIfExists('warehouses_moves_items');
        Schema::dropIfExists('warehouses_moves');
    }
}
