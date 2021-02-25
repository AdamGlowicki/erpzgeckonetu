<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTangibleAssetsColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('investments_items', function (Blueprint $table) {
            $table->integer('quantity_assets')->after('quantity')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('investments_items', function (Blueprint $table) {
            $table->dropColumn('quantity_assets');
        });
    }
}
