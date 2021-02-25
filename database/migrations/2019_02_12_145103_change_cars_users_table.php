<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeCarsUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cars_users', function (Blueprint $table) {
            $table->unsignedInteger('car_id')->nullable()->change();
            $table->dropForeign('cars_users_car_id_foreign');
            $table->foreign('car_id')->references('id')->on('cars')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cars_users', function (Blueprint $table) {
            //
        });
    }
}
