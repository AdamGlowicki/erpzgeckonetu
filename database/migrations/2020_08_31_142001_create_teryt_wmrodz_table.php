<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTerytWmrodzTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teryt_wmrodz', function (Blueprint $table) {
            $table->increments('id');
            $table->char('RM', 2)->nullable()->default(null);
            $table->char('NAZWA_RM', 24)->nullable()->default(null);
            $table->date('STAN_NA');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('teryt_wmrodz');
    }
}
