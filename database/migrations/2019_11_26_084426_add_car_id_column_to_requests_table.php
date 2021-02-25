<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCarIdColumnToRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->unsignedInteger('car_id')->nullable()->after('user_id');

            $table->foreign('car_id')->references('id')->on('cars');
        });

        Schema::table('investments', function (Blueprint $table) {
            $table->unsignedInteger('request_id')->nullable()->after('user_id');
            $table->unsignedInteger('warehouse_id')->nullable()->after('request_id');

            $table->foreign('request_id')->references('id')->on('requests');
            $table->foreign('warehouse_id')->references('id')->on('warehouses');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropForeign(['car_id']);
            $table->dropColumn('car_id');
        });

        Schema::table('investments', function (Blueprint $table) {
            $table->dropForeign(['request_id']);
            $table->dropForeign(['warehouse_id']);
            $table->dropColumn('request_id');
            $table->dropColumn('warehouse_id');
        });
    }
}
