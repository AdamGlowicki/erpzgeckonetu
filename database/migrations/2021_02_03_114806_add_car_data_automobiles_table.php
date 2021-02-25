<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCarDataAutomobilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('automobiles', function (Blueprint $table) {
            $table->date('gasDate');
            $table->date('insurance');
            $table->date('techPeriod');
            $table->date('create');
            $table->date('approval');
            $table->boolean('isGas');

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
            $table->dropColumn('gasData');
            $table->dropColumn('insurance');
            $table->dropColumn('techPeriod');
            $table->dropColumn('create');
            $table->dropColumn('approval');
            $table->dropColumn('isGas');
        });
    }
}
