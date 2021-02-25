<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarsInsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cars_ins', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('car_id');
            $table->unsignedInteger('client_id');
            $table->unsignedInteger('user_id');
            $table->string('document_name');
            $table->string('notes');
            $table->timestamps();
            
            $table->foreign('car_id')->references('id')->on('cars');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cars_ins', function (Blueprint $table) {
            //
        });
    }
}
