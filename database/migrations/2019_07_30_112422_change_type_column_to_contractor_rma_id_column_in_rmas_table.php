<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeTypeColumnToContractorRmaIdColumnInRmasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rmas', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->string('contractor_rma_id')->after('warehouse_id');
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
            $table->dropColumn('contractor_rma_id');
            $table->integer('type');
        });
    }
}
