<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDataToAutomobilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('automobiles', function (Blueprint $table) {
            $table->date('gasHomologous');
            $table->string('insuranceNumber');
            $table->date('oilPeriodDate');
            $table->date('periodServiceDate');
            $table->date('periodTimingGearDate');
            $table->integer('fuelInspection');
            $table->date('fuelPeriodDate');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('automobiles', function (Blueprint $table) {
            $table->dropColumn('gasHomologous');
            $table->dropColumn('insuranceNumber');
        });
    }
}
