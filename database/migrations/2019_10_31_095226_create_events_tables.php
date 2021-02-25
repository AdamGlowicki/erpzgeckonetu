<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_created_id');
            $table->unsignedInteger('client_id')->nullable();
            $table->unsignedInteger('investment_id')->nullable();
            $table->dateTime('start');
            $table->dateTime('end');
            $table->string('title');
            $table->string('description')->nullable();
            $table->tinyInteger('status');
            $table->tinyInteger('priority');
            $table->timestamps();

            $table->foreign('user_created_id')->references('id')->on('users');
            $table->foreign('client_id')->references('id')->on('clients');
            $table->foreign('investment_id')->references('id')->on('investments');
        });

        Schema::create('events_users', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('event_id');
            $table->unsignedInteger('user_id');
            $table->timestamps();

            $table->foreign('event_id')->references('id')->on('events');
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::create('events_reminders', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('event_id');
            $table->integer('time');
            $table->timestamps();

            $table->foreign('event_id')->references('id')->on('events');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('events_reminders', function (Blueprint $table) {
            $table->dropForeign(['event_id']);
        });

        Schema::dropIfExists('events_reminders');

        Schema::table('events_users', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['event_id']);
        });

        Schema::dropIfExists('events_users');

        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['investment_id']);
            $table->dropForeign(['user_created_id']);
            $table->dropForeign(['client_id']);
        });

        Schema::dropIfExists('events');
    }
}
