<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTerytUlicTableNew extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('teryt_ulic');

        Schema::create('teryt_ulic', function (Blueprint $table) {
            $table->increments('id');
            $table->char('WOJ', 2)->nullable()->default(null);
            $table->char('POW', 2)->nullable()->default(null);
            $table->char('GMI', 2)->nullable()->default(null);
            $table->tinyInteger('RODZ_GMI');
            $table->char('SYM', 7)->nullable()->default(null);
            $table->char('SYM_UL', 5)->nullable()->default(null);
            $table->char('CECHA', 5)->nullable()->default(null);
            $table->string('NAZWA_1')->nullable()->default(null);
            $table->string('NAZWA_2')->nullable()->default(null);
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
        Schema::dropIfExists('teryt_ulic');

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
}
