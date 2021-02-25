<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGraphIdToEdgesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('edges', function (Blueprint $table) {
            $table->unsignedBigInteger('graph_id')->nullable();

            $table->foreign('graph_id')->references('id')->on('graphs');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('edges', function (Blueprint $table) {
            $table->dropColumn('graph_id');
        });
    }
}
