<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarsUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cars_users', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('car_id');
            $table->unsignedInteger('user_id')->unique();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('car_id')->references('id')->on('cars');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('cars_users', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['car_id']);
        });

        Schema::dropIfExists('cars_users');
    }
}
