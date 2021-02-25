<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBhpItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bhp_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('unit_id');
            $table->string('name');
            $table->timestamps();
            
            $table->foreign('unit_id')->references('id')->on('units');
        });
        
        Schema::create('bhp_users_stocks_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('bhp_item_id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('quantity');
            $table->timestamps();
            
            $table->foreign('bhp_item_id')->references('id')->on('bhp_items');
            $table->foreign('user_id')->references('id')->on('users');
        });
        
        Schema::create('bhp_outs', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('user_out_id');
            $table->string('document_name');
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('user_out_id')->references('id')->on('users');
        });
        
        Schema::create('bhp_outs_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('bhp_out_id');
            $table->unsignedInteger('bhp_item_id');
            $table->unsignedInteger('quantity');
            $table->timestamps();
            
            $table->foreign('bhp_out_id')->references('id')->on('bhp_outs');
            $table->foreign('bhp_item_id')->references('id')->on('bhp_items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bhp_outs_items');
        Schema::dropIfExists('bhp_outs');
        Schema::dropIfExists('bhp_users_stocks_items');
        Schema::dropIfExists('bhp_items');
    }
}
