<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRmasStocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rmas_stocks', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('rma_id');
            $table->unsignedInteger('item_id');
            $table->integer('quantity');
            $table->timestamps();

            $table->foreign('rma_id')->references('id')->on('rmas');
            $table->foreign('item_id')->references('id')->on('items');
        });

        Schema::table('rmas_items', function (Blueprint $table) {
            // $table->dropSoftDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rmas_stocks', function (Blueprint $table) {
            $table->dropForeign(['rma_id']);
            $table->dropForeign(['item_id']);
        });

        Schema::dropIfExists('rmas_stocks');
    }
}
