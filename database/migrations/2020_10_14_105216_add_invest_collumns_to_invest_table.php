<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddInvestCollumnsToInvestTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('invests', function (Blueprint $table) {
            $table->string('country')->nullable();
            $table->string('adder')->nullable();
            $table->date('add_date')->nullable();
            $table->date('deadline')->nullable();
            $table->string('tech')-> nullable();
            $table->text('description')->nullable();
            $table->string('condition')->nullable();
            $table->date('condition_term')->nullable();
            $table->string('arrangements')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('invests', function (Blueprint $table) {
            $table->dropColumn('country');
            $table->dropColumn('adder');
            $table->dropColumn('add_date');
            $table->dropColumn('deadline');
            $table->dropColumn('tech');
            $table->dropColumn('description');
            $table->dropColumn('condition');
            $table->dropColumn('condition_term');
            $table->dropColumn('arrangements');
        });
    }
}
