<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRmasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rmas_reasons', function (Blueprint $table) {
           $table->increments('id');
           $table->string('name');
           $table->timestamps();
        });
        
        Schema::create('rmas', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('contractor_id');
            $table->unsignedInteger('warehouses_in_id')->nullable();
            $table->unsignedInteger('rmas_reason_id');
            $table->string('document_name');
            $table->string('note');
            $table->integer('type');
            $table->integer('rma_status');
            $table->integer('end_status');
            $table->dateTime('sent_at');
            $table->dateTime('received_at');
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('contractor_id')->references('id')->on('contractors');
            $table->foreign('warehouses_in_id')->references('id')->on('warehouses_in');
            $table->foreign('rmas_reason_id')->references('id')->on('rmas_reasons');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rmas');
        Schema::dropIfExists('rmas_reasons');
    }
}
