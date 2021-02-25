<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddInvestmentIdColumnToCarsInsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cars_ins', function (Blueprint $table) {
            $table->unsignedInteger('investment_id')->nullable();
            $table->unsignedInteger('client_id')->nullable()->change();
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
            $table->dropColumn('investment_id');
        });
    }
}
