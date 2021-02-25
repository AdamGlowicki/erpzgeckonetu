<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarehousesInItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses_in_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('warehouses_in_id');
            $table->unsignedInteger('item_id');
            $table->unsignedInteger('tax_id');
            $table->decimal('price_notax', 10, 2);
            $table->decimal('price_withtax', 10, 2);
            $table->integer('quantity');
            $table->timestamps();

            $table->foreign('warehouses_in_id')->references('id')->on('warehouses_in');
            $table->foreign('item_id')->references('id')->on('items');
            $table->foreign('tax_id')->references('id')->on('taxes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('warehouses_in_elements', function (Blueprint $table) {
            $table->dropForeign(['warehouses_in_id']);
            $table->dropForeign(['item_id']);
            $table->dropForeign(['tax_id']);
        });

        Schema::dropIfExists('warehouses_in_items');
    }
}
