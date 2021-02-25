<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRmasItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rmas_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('rma_id');
            $table->unsignedInteger('item_id');
            $table->unsignedInteger('quantity');
            $table->timestamps();

            $table->foreign('rma_id')->references('id')->on('rmas');
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
        Schema::dropIfExists('rmas_items');
    }
}
