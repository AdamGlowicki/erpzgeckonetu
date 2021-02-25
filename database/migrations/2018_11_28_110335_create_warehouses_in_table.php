<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWarehousesInTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouses_in', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('contractor_id');
            $table->unsignedInteger('warehouse_id');
            $table->unsignedInteger('user_id');
            $table->string('document_name')->unique();
            $table->string('invoice_name');
            $table->date('invoice_date');
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->foreign('contractor_id')->references('id')->on('contractors');
            $table->foreign('warehouse_id')->references('id')->on('warehouses');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('warehouses_in', function (Blueprint $table) {
            $table->dropForeign(['contractor_id']);
            $table->dropForeign(['warehouse_id']);
            $table->dropForeign(['user_id']);
        });
    }
}
