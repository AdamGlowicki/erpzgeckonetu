<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUkeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('uke', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('obj_id');
            $table->string('name');
            $table->string('type');
            $table->string('nip');
            $table->string('krs');
            $table->string('address');
            $table->text('data');
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
        Schema::dropIfExists('uke');
    }
}
