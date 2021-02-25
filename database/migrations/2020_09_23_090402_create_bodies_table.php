<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBodiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bodies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title')->nullable();
            $table->boolean('all_files');
            $table->date('send_date')->nullable();
            $table->date('receive_date')->nullable();
            $table->string('status')->nullable();
            $table->boolean('is_second_table');
            $table->date('second_date')->nullable();
            $table->boolean('is_all_second_files');
            $table->string('second_status');
            $table->unsignedBigInteger('table_id');

            $table->foreign('table_id')->references('id')->on('tables');
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
        Schema::dropIfExists('bodies');
    }
}
