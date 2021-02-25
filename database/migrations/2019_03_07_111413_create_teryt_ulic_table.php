<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTerytUlicTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teryt_ulic', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('WOJ');
            $table->integer('POW');
            $table->integer('GMI');
            $table->integer('RODZ_GMI');
            $table->integer('SYM');
            $table->integer('SYM_UL');
            $table->string('CECHA');
            $table->string('NAZWA_1');
            $table->string('NAZWA_2');
            $table->string('STAN_NA');
            
            $table->index(['SYM', 'NAZWA_1']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('teryt_ulic');
    }
}
