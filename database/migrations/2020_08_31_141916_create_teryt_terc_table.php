<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTerytTercTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teryt_terc', function (Blueprint $table) {
            $table->increments('id');
            $table->char('WOJ', 2)->nullable()->default(null);
            $table->char('POW', 2)->nullable()->default(null);
            $table->char('GMI', 2)->nullable()->default(null);
            $table->tinyInteger('RODZ');
            $table->string('NAZWA')->nullable()->default(null);
            $table->string('NAZDOD')->nullable()->default(null);
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
        Schema::dropIfExists('teryt_terc');
    }
}
