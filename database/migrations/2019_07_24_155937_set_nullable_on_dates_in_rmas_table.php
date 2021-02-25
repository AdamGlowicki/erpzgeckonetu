<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetNullableOnDatesInRmasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rmas', function (Blueprint $table) {
            $table->string('sent_at')->nullable()->change();
            $table->string('received_at')->nullable()->change();
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
            $table->string('sent_at')->nullable(false)->change();
            $table->string('received_at')->nullable(false)->change();
        });
    }
}
