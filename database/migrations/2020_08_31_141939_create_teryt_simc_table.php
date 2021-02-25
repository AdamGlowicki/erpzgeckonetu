<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTerytSimcTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teryt_simc', function (Blueprint $table) {
            $table->increments('id');
            $table->char('WOJ', 2)->nullable()->default(null);
            $table->char('POW', 2)->nullable()->default(null);
            $table->char('GMI', 2)->nullable()->default(null);
            $table->tinyInteger('RODZ_GMI');
            $table->char('RM', 2)->nullable()->default(null);
            $table->boolean('MZ');
            $table->string('NAZWA')->nullable()->default(null);
            $table->char('SYM', 7)->nullable()->default(null);
            $table->char('SYMPOD', 7)->nullable()->default(null);
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
        Schema::dropIfExists('teryt_simc');
    }
}
