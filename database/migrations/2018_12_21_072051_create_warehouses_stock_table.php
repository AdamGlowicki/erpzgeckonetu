<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarehousesStockTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses_stocks', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('item_id');
            $table->unsignedInteger('warehouse_id');
            $table->integer('quantity')->default(0);
            $table->timestamps();

            $table->foreign('item_id')->references('id')->on('items');
            $table->foreign('warehouse_id')->references('id')->on('warehouses');

            $table->unique(['item_id', 'warehouse_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('warehouses_stock', function (Blueprint $table) {
            $table->dropForeign(['item_id']);
            $table->dropForeign(['warehouse_id']);

            $table->dropIndex(['item_id', 'warehouse_id']);
        });
    }
}
