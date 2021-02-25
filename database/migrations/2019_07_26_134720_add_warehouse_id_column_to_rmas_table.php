<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddWarehouseIdColumnToRmasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rmas', function (Blueprint $table) {
            $table->unsignedInteger('warehouse_id')->after('end_status')->nullable();
            
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
        Schema::table('rmas', function (Blueprint $table) {
            $table->dropForeign(['warehouse_id']);
            
            $table->dropColumn('warehouse_id');
        });
    }
}
