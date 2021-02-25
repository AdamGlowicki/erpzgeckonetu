<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSingleElementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('single_elements', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('backgroundColor')->nullable();
            $table->integer('radius')->nullable();
            $table->integer('borderSize')->nullable();
            $table->string('borderType')->nullable();
            $table->string('borderColor')->nullable();
            $table->integer('fontSize')->nullable();
            $table->integer('fontWeight')->nullable();
            $table->string('color')->nullable();
            $table->integer('rotate')->nullable();

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
        Schema::dropIfExists('single_elements');
    }
}
