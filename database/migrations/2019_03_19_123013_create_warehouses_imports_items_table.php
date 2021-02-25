<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarehousesImportsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses_imports_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('warehouses_import_id');
            $table->unsignedInteger('item_id');
            $table->integer('quantity');
            $table->timestamps();
            
            $table->foreign('warehouses_import_id')->references('id')->on('warehouses_imports');
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
        Schema::dropIfExists('warehouses_imports_items');
    }
}
