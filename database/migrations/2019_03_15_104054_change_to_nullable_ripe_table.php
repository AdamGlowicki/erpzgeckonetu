<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeToNullableRipeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ripe', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            $table->string('notify')->nullable()->change();
            $table->string('org_name')->nullable()->change();
            $table->string('descr')->nullable()->change();
            $table->string('phone')->nullable()->change();
            $table->string('person')->nullable()->change();
            $table->string('address')->nullable()->change();
            $table->string('ref_nfy')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ripe', function (Blueprint $table) {
            //
        });
    }
}
