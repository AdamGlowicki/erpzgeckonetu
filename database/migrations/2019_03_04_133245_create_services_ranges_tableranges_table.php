<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServicesRangesTablerangesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('services_ranges', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('service_id');
            $table->integer('terc');
            $table->integer('simc');
            $table->integer('ulic');
            $table->string('building_num');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('services_ranges', function (Blueprint $table) {
            //
        });
    }
}
