<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeColumnsInLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn('street');
            $table->dropColumn('street_teryt');
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->string('street')->nullable()->after('city_teryt');
            $table->char('street_teryt', 7)->nullable()->after('street');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn('street');
            $table->dropColumn('street_teryt');
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->string('street')->after('city_teryt');
            $table->char('street_teryt', 7)->after('street');
        });
    }
}
