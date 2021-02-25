<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarsAlertsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cars_alerts', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('automobile_id');
            $table->integer('kms')->nullable();
            $table->integer('days')->nullable();
            $table->string('type');
            $table->string('link')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cars_alerts');
    }
}
