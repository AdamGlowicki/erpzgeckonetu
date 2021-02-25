<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIndexesToTerytTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('teryt_ulic', function (Blueprint $table) {
            $table->index(['SYM', 'SYM_UL']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('teryt_ulic', function (Blueprint $table) {
            $table->dropIndex(['SYM', 'SYM_UL']);
        });
    }
}
