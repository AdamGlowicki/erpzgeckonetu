<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('items_manufacturer_id');
            $table->unsignedInteger('items_category_id');
            $table->unsignedInteger('unit_id');
            $table->string('model_name');
            $table->integer('low_quant');
            $table->tinyInteger('has_data');
            $table->timestamps();

            $table->foreign('items_manufacturer_id')->references('id')->on('items_manufacturers');
            $table->foreign('items_category_id')->references('id')->on('items_categories');
            $table->foreign('unit_id')->references('id')->on('units');
        });

        \DB::update("ALTER TABLE `items` AUTO_INCREMENT = 100;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->dropForeign(['items_manufacturer_id']);
            $table->dropForeign(['items_category_id']);
            $table->dropForeign(['unit_id']);
        });

        Schema::dropIfExists('items');
    }
}
