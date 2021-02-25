<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStatusFieldToInvestmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->tinyInteger('status');
            $table->unsignedInteger('car_id')->nullable()->default(null);

            $table->foreign('car_id')->references('id')->on('cars');
        });

        Schema::table('investments_queue_items', function (Blueprint $table) {
            $table->unsignedInteger('quantity_used')->after('quantity');
            $table->string('comment')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->dropForeign(['car_id']);

            $table->dropColumn('status');
            $table->dropColumn('car_id');
        });

        Schema::table('investments_queue_items', function (Blueprint $table) {
            $table->dropColumn('quantity_used');
            $table->dropColumn('comment');
        });
    }
}
