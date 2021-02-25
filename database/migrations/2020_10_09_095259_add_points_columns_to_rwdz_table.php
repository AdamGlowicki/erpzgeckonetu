<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPointsColumnsToRwdzTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rwdz', function (Blueprint $table) {
            $table->float('x1', 10,6)->nullable()->default(null);
            $table->float('y1', 10,6)->nullable()->default(null);
            $table->float('x2', 10,6)->nullable()->default(null);
            $table->float('y2', 10,6)->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rwdz', function (Blueprint $table) {
            $table->dropColumn('x1');
            $table->dropColumn('y1');
            $table->dropColumn('x2');
            $table->dropColumn('y2');
        });
    }
}
