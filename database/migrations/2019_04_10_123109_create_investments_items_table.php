<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvestmentsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('investments_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('investment_id');
            $table->unsignedInteger('item_id');
            $table->integer('quantity');
            $table->timestamps();
            
            $table->foreign('investment_id')->references('id')->on('investments');
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
        Schema::dropIfExists('investments_items');
    }
}
