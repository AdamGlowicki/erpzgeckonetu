<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersScheduleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_schedules_requests', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');

            $table->date('date');

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::create('users_schedules', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');

            $table->date('date');

            $table->timestamps();

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
        Schema::table('users_schedules', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::dropIfExists('users_schedules');

        Schema::table('users_schedules_requests', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::dropIfExists('users_schedules_requests');
    }
}
