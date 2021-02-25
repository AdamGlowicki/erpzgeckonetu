<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAutomobilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('automobiles', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('user_id');
            $table->string('brand');
            $table->string('model');
            $table->string('numberPlate');
            $table->string('vin');
            $table->smallInteger('oil');
            $table->smallInteger('gasInstallation');
            $table->smallInteger('periodService');
            $table->smallInteger('timingGear');
            $table->date('summerChangeTire');
            $table->date('winterChangeTire');
            $table->smallInteger('snowTire');
            $table->smallInteger('summerTire');

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
        Schema::dropIfExists('automobiles');
    }
}
